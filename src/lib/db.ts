import { createClient, Client } from "@libsql/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Ensure data folder exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dbClient: Client | null = null;

export function getDb(): Client {
  if (!dbClient) {
    const url = process.env.DATABASE_URL || "file:./data/aidah.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;
    dbClient = createClient({
      url,
      authToken,
    });
  }
  return dbClient;
}

// Global initialization flag
let isDbInitialized = false;

export async function initDb(): Promise<void> {
  if (isDbInitialized) return;
  const db = getDb();

  // Execute DDL statements sequentially
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS customer_profiles (
      user_id TEXT PRIMARY KEY,
      bio TEXT,
      avatar_url TEXT,
      preferences_json TEXT,
      default_address_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      street_line1 TEXT NOT NULL,
      street_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'India',
      is_default INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      banner_image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_desc TEXT,
      category_id TEXT NOT NULL,
      collection_id TEXT,
      base_price REAL NOT NULL,
      sale_price REAL,
      fabric TEXT,
      fit TEXT,
      care_instructions TEXT,
      occasion TEXT,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      model_3d_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (collection_id) REFERENCES collections(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      price_override REAL,
      image_url TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS inventory_movements (
      id TEXT PRIMARY KEY,
      variant_id TEXT NOT NULL,
      change_amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      reference_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      session_id TEXT UNIQUE,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      added_at TEXT NOT NULL,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      guest_email TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 0,
      shipping_fee REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      shipping_address_json TEXT NOT NULL,
      tracking_carrier TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      size TEXT NOT NULL,
      color TEXT NOT NULL,
      sku TEXT NOT NULL,
      price_at_purchase REAL NOT NULL,
      quantity INTEGER NOT NULL,
      item_total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      transaction_id TEXT,
      status TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      raw_response_json TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_spend REAL NOT NULL DEFAULT 0,
      max_discount REAL,
      usage_limit INTEGER DEFAULT 100,
      usage_count INTEGER DEFAULT 0,
      valid_from TEXT NOT NULL,
      valid_until TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT,
      author_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      is_verified_purchase INTEGER DEFAULT 1,
      is_approved INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS returns (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested',
      refund_amount REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS homepage_content (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS store_settings (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details_json TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Indexes for high performance
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);`);

  // Seed default data if users table is empty
  await seedDefaultData(db);

  isDbInitialized = true;
}

async function seedDefaultData(db: Client) {
  const usersCheck = await db.execute("SELECT COUNT(*) as count FROM users;");
  const count = Number(usersCheck.rows[0].count);

  if (count > 0) return; // Already seeded

  const now = new Date().toISOString();

  // 1. Admin & Customer Users
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@Aidah2026";
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const customerHash = await bcrypt.hash("Customer@123", 10);

  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ["usr_admin_1", "admin@aidah.com", adminHash, "Atelier Director", "+919876543210", "admin", now, now],
  });

  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, name, phone, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: ["usr_cust_1", "sophia@aidah.com", customerHash, "Lady Sophia Sterling", "+919820011223", "customer", now, now],
  });

  await db.execute({
    sql: `INSERT INTO addresses (id, user_id, full_name, phone, street_line1, street_line2, city, state, postal_code, country, is_default, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "addr_cust_1",
      "usr_cust_1",
      "Lady Sophia Sterling",
      "+919820011223",
      "Apartment 14B, Royal Palms Crest",
      "Pali Hill, Bandra West",
      "Mumbai",
      "Maharashtra",
      "400050",
      "India",
      1,
      now,
    ],
  });

  // 2. Categories
  const categories = [
    { id: "cat_casual", name: "Casual Dresses", slug: "casual-dresses", desc: "Effortless daytime silhouettes in breathable organic linens and silks", img: "/media/catalog/camille-pleated-midi.jpg", order: 1 },
    { id: "cat_party", name: "Party & Cocktail Wear", slug: "party-wear", desc: "Glamorous evening statements sculpted for twilight soirees", img: "/media/catalog/dahlia-draped-cocktail.jpg", order: 2 },
    { id: "cat_gown", name: "Evening Gowns", slug: "evening-gowns", desc: "Regal floor-sweeping silhouettes and opulent pure silks", img: "/media/catalog/seraphina-blush-gown.jpg", order: 3 },
    { id: "cat_floral", name: "Floral Dresses", slug: "floral-dresses", desc: "Delicate botanicals and dreamy hand-painted blossom prints", img: "/media/catalog/celeste-floral-maxi.jpg", order: 4 },
    { id: "cat_ethnic", name: "Ethnic & Fusion Couture", slug: "ethnic-wear", desc: "Timeless organza, intricate hand embroidery, and regal anarkalis", img: "/media/catalog/noor-ethnic-organza-suit.jpg", order: 5 },
    { id: "cat_coord", name: "Co-Ord Sets", slug: "co-ord-sets", desc: "Monochromatic silk sets and tailored feminine duos", img: "/media/catalog/aurora-silk-coord.jpg", order: 6 },
    { id: "cat_skirts", name: "Tops & Skirts", slug: "tops-and-skirts", desc: "Sculpted corsets, tiered organza skirts, and drape blouses", img: "/media/catalog/ophelia-embroidered-set.jpg", order: 7 },
    { id: "cat_acc", name: "Accessories & Adornments", slug: "accessories", desc: "Handcrafted silk scrunchies, pearl chokers, and couture belts", img: "/media/catalog/valeria-rose-corset-dress.jpg", order: 8 },
  ];

  for (const c of categories) {
    await db.execute({
      sql: `INSERT INTO categories (id, name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.name, c.slug, c.desc, c.img, c.order],
    });
  }

  // 3. Collections
  const collections = [
    { id: "col_new", name: "New Arrivals • Spring Reverie", slug: "new-arrivals", desc: "A breath of soft blossoms, blush organza, and poetic hemlines", img: "/media/catalog/hero-campaign.jpg", feat: 1, order: 1 },
    { id: "col_bestseller", name: "Boutique Best Sellers", slug: "best-sellers", desc: "The most coveted iconic pieces cherished by our boutique clientele", img: "/media/catalog/seraphina-blush-gown.jpg", feat: 1, order: 2 },
    { id: "col_spring", name: "Spring Reverie Collection", slug: "spring-reverie", desc: "Sunlit garden aesthetics inspired by vintage Parisian floral salons", img: "/media/catalog/celeste-floral-maxi.jpg", feat: 1, order: 3 },
    { id: "col_twilight", name: "Twilight Soirée", slug: "twilight-elegance", desc: "Midnight hues, champagne accents, and sculpted evening wear", img: "/media/catalog/mariana-champagne-evening.jpg", feat: 1, order: 4 },
    { id: "col_sale", name: "Archive Sale", slug: "sale", desc: "Past season heritage pieces with special privilege pricing", img: "/media/catalog/elysian-satin-slip.jpg", feat: 0, order: 5 },
  ];

  for (const col of collections) {
    await db.execute({
      sql: `INSERT INTO collections (id, name, slug, description, banner_image_url, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [col.id, col.name, col.slug, col.desc, col.img, col.feat, col.order],
    });
  }

  // 4. Products with Variants and Images
  const sampleProducts = [
    {
      id: "prod_seraphina",
      name: "The Seraphina Blush Silk Gown",
      slug: "seraphina-blush-silk-gown",
      sku: "AID-SERA-01",
      description: "An ethereal floor-grazing gown tailored from featherlight blush mulberry silk and French Chantilly lace. Features hand-ruched bodice pleats, an illusion sweet-heart neckline, and a graceful train that floats with effortless grace.",
      short_desc: "Floor-grazing gown in featherlight blush mulberry silk and Chantilly lace.",
      catId: "cat_gown",
      colId: "col_new",
      basePrice: 18499,
      salePrice: 15999,
      fabric: "100% Pure Mulberry Silk & French Chantilly Lace",
      fit: "Tailored corset bodice with soft bias-cut flowing skirt",
      care: "Dry clean only by luxury silk specialists. Store in archival cotton garment bag.",
      occasion: "Evening Gala, Black Tie, Engagement Soirée",
      isFeat: 1, isNew: 1, isBest: 1,
      model3d: "/models/gown_preview.glb",
      img: "/media/catalog/seraphina-blush-gown.jpg",
      variants: [
        { size: "XS", color: "Blush Rose", hex: "#D99BAA", stock: 8 },
        { size: "S", color: "Blush Rose", hex: "#D99BAA", stock: 12 },
        { size: "M", color: "Blush Rose", hex: "#D99BAA", stock: 10 },
        { size: "L", color: "Blush Rose", hex: "#D99BAA", stock: 5 },
        { size: "S", color: "Warm Ivory", hex: "#FFF9F4", stock: 6 },
        { size: "M", color: "Warm Ivory", hex: "#FFF9F4", stock: 7 },
      ],
    },
    {
      id: "prod_aurora",
      name: "Aurora Silk Satin Co-Ord Set",
      slug: "aurora-silk-satin-coord-set",
      sku: "AID-AURO-02",
      description: "A tailored two-piece set featuring a relaxed kimono-lapel silk blazer with pearl buttons and high-waisted pleated palazzo trousers. Delicately draped in our signature luminous cream satin.",
      short_desc: "Two-piece silk satin tailored blazer and wide-leg trouser duo.",
      catId: "cat_coord",
      colId: "col_bestseller",
      basePrice: 12999,
      salePrice: null,
      fabric: "Heavyweight 22 Momme Silk Charmeuse",
      fit: "Relaxed tailored silhouette with elasticized back waist",
      care: "Dry clean or gentle hand wash in cold water with pH-neutral silk wash.",
      occasion: "Art Gallery Opening, High Tea, Destination Wedding Cocktail",
      isFeat: 1, isNew: 0, isBest: 1,
      model3d: null,
      img: "/media/catalog/aurora-silk-coord.jpg",
      variants: [
        { size: "XS", color: "Luminous Cream", hex: "#F7EFE7", stock: 6 },
        { size: "S", color: "Luminous Cream", hex: "#F7EFE7", stock: 14 },
        { size: "M", color: "Luminous Cream", hex: "#F7EFE7", stock: 11 },
        { size: "L", color: "Luminous Cream", hex: "#F7EFE7", stock: 4 },
      ],
    },
    {
      id: "prod_celeste",
      name: "Celeste Botanical Floral Maxi Dress",
      slug: "celeste-botanical-floral-maxi-dress",
      sku: "AID-CELE-03",
      description: "Inspired by sun-drenched gardens of Provence, the Celeste maxi features hand-painted floral motifs on airy georgette, gentle tiered ruffles, balloon sleeves, and an adjustable velvet ribbon tie waist.",
      short_desc: "Romantic georgette maxi with delicate botanical blossoms and tiered ruffles.",
      catId: "cat_floral",
      colId: "col_spring",
      basePrice: 9499,
      salePrice: 7999,
      fabric: "Pure Bemberg Georgette with Organic Cotton Voile lining",
      fit: "Flowing bohemian silhouette with cinched empire waist",
      care: "Delicate dry clean recommended. Steam lightly.",
      occasion: "Brunch, Garden Wedding, Resort Getaway",
      isFeat: 1, isNew: 1, isBest: 1,
      model3d: null,
      img: "/media/catalog/celeste-floral-maxi.jpg",
      variants: [
        { size: "S", color: "Rose Blossom", hex: "#F4DDE3", stock: 15 },
        { size: "M", color: "Rose Blossom", hex: "#F4DDE3", stock: 12 },
        { size: "L", color: "Rose Blossom", hex: "#F4DDE3", stock: 9 },
        { size: "XL", color: "Rose Blossom", hex: "#F4DDE3", stock: 3 },
      ],
    },
    {
      id: "prod_mariana",
      name: "Mariana Champagne Draped Evening Dress",
      slug: "mariana-champagne-draped-evening-dress",
      sku: "AID-MARI-04",
      description: "Sculptural glamour crafted from liquid champagne crepe. The cowl neckline gracefully cascades over the décolletage, complemented by a daring open cowl back and subtle thigh-high split.",
      short_desc: "Liquid champagne crepe cowl dress with sculpted silhouette.",
      catId: "cat_party",
      colId: "col_twilight",
      basePrice: 14999,
      salePrice: 13499,
      fabric: "Liquid Metallic Silk Crepe with Viscose Lining",
      fit: "Bias-cut figure skimming silhouette",
      care: "Specialist dry clean only.",
      occasion: "Cocktail Reception, Evening Gala, Red Carpet",
      isFeat: 1, isNew: 0, isBest: 1,
      model3d: null,
      img: "/media/catalog/mariana-champagne-evening.jpg",
      variants: [
        { size: "XS", color: "Champagne Gold", hex: "#C8A56A", stock: 5 },
        { size: "S", color: "Champagne Gold", hex: "#C8A56A", stock: 9 },
        { size: "M", color: "Champagne Gold", hex: "#C8A56A", stock: 8 },
        { size: "L", color: "Champagne Gold", hex: "#C8A56A", stock: 2 },
      ],
    },
    {
      id: "prod_noor",
      name: "Noor Hand-Embroidered Organza Anarkali Suit",
      slug: "noor-hand-embroidered-organza-anarkali-suit",
      sku: "AID-NOOR-05",
      description: "A tribute to classical Indian royal couture. Woven in diaphanous blush organza adorned with delicate resham threadwork, zardozi accents, and accompanied by silk cigarette pants and an embroidered scalloped dupatta.",
      short_desc: "Regal blush organza anarkali featuring hand-done resham and zardozi embroidery.",
      catId: "cat_ethnic",
      colId: "col_new",
      basePrice: 24999,
      salePrice: 21999,
      fabric: "Handloom Pure Organza & Chanderi Silk",
      fit: "Structured Mughal kalidar silhouette with fitted bodice",
      care: "Dry clean only. Preserve in muslin wrap.",
      occasion: "Mehendi, Sangeet, Festive Soirée, Royal Wedding",
      isFeat: 1, isNew: 1, isBest: 0,
      model3d: null,
      img: "/media/catalog/noor-ethnic-organza-suit.jpg",
      variants: [
        { size: "S", color: "Petal Blush", hex: "#F4DDE3", stock: 4 },
        { size: "M", color: "Petal Blush", hex: "#F4DDE3", stock: 6 },
        { size: "L", color: "Petal Blush", hex: "#F4DDE3", stock: 3 },
      ],
    },
    {
      id: "prod_valeria",
      name: "Valeria Rose Corset & Tiered Skirt",
      slug: "valeria-rose-corset-tiered-skirt",
      sku: "AID-VALE-06",
      description: "An architectural boned corset sculpted in soft rose dupioni silk paired with an ankle-length tiered organza skirt with horsehair hem for dramatic volume.",
      short_desc: "Boned silk corset paired with voluminous tiered organza skirt.",
      catId: "cat_skirts",
      colId: "col_twilight",
      basePrice: 16999,
      salePrice: null,
      fabric: "Raw Dupioni Silk & Multi-Tier Organza",
      fit: "Lace-up corset back providing bespoke contouring",
      care: "Dry clean only.",
      occasion: "Prom, Opera Night, Birthday Milestone Soirée",
      isFeat: 0, isNew: 0, isBest: 1,
      model3d: null,
      img: "/media/catalog/valeria-rose-corset-dress.jpg",
      variants: [
        { size: "XS", color: "Vintage Rose", hex: "#D99BAA", stock: 7 },
        { size: "S", color: "Vintage Rose", hex: "#D99BAA", stock: 10 },
        { size: "M", color: "Vintage Rose", hex: "#D99BAA", stock: 6 },
      ],
    },
    {
      id: "prod_camille",
      name: "Camille Pleated A-Line Midi Dress",
      slug: "camille-pleated-a-line-midi-dress",
      sku: "AID-CAMI-07",
      description: "The epitome of understated daytime luxury. Sunray accordion pleating that swishes with every step, a refined collar with mother-of-pearl buttons, and a matching self-tie belt.",
      short_desc: "Sunray pleated midi dress with mother-of-pearl buttons in warm ivory.",
      catId: "cat_casual",
      colId: "col_spring",
      basePrice: 8499,
      salePrice: 6999,
      fabric: "Japanese Textured Modal & Cotton Blend",
      fit: "Classic A-line midi silhouette with removable belt",
      care: "Hand wash cold, hang dry in shade.",
      occasion: "Daytime Luncheon, Gallery Visit, Sunday High Tea",
      isFeat: 0, isNew: 0, isBest: 0,
      model3d: null,
      img: "/media/catalog/camille-pleated-midi.jpg",
      variants: [
        { size: "S", color: "Warm Ivory", hex: "#FFF9F4", stock: 12 },
        { size: "M", color: "Warm Ivory", hex: "#FFF9F4", stock: 15 },
        { size: "L", color: "Warm Ivory", hex: "#FFF9F4", stock: 8 },
      ],
    },
    {
      id: "prod_elysian",
      name: "Elysian Bias-Cut Satin Slip Gown",
      slug: "elysian-bias-cut-satin-slip-gown",
      sku: "AID-ELYS-08",
      description: "Minimalist perfection reminiscent of 90s supermodel glamour. Skims the curves flawlessly with delicate French spaghetti straps and an alluring low scooped back.",
      short_desc: "Iconic 90s-inspired bias-cut satin slip dress with scooped back.",
      catId: "cat_casual",
      colId: "col_sale",
      basePrice: 7999,
      salePrice: 5499,
      fabric: "Heavyweight Eco-Satin Viscose",
      fit: "True bias cut that drapes naturally to your form",
      care: "Cool iron on reverse, dry clean or gentle hand wash.",
      occasion: "Cocktail, Date Night, Resort Evening",
      isFeat: 0, isNew: 0, isBest: 1,
      model3d: null,
      img: "/media/catalog/elysian-satin-slip.jpg",
      variants: [
        { size: "XS", color: "Cocoa Satin", hex: "#755B57", stock: 4 },
        { size: "S", color: "Cocoa Satin", hex: "#755B57", stock: 8 },
        { size: "M", color: "Cocoa Satin", hex: "#755B57", stock: 7 },
        { size: "L", color: "Cocoa Satin", hex: "#755B57", stock: 2 },
      ],
    },
  ];

  for (const p of sampleProducts) {
    await db.execute({
      sql: `INSERT INTO products (
        id, name, slug, sku, description, short_desc, category_id, collection_id,
        base_price, sale_price, fabric, fit, care_instructions, occasion,
        is_featured, is_new, is_bestseller, is_published, model_3d_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id, p.name, p.slug, p.sku, p.description, p.short_desc, p.catId, p.colId,
        p.basePrice, p.salePrice, p.fabric, p.fit, p.care, p.occasion,
        p.isFeat, p.isNew, p.isBest, 1, p.model3d, now, now,
      ],
    });

    // Primary Image
    await db.execute({
      sql: `INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [`img_${p.id}_1`, p.id, p.img, p.name, 1, 1],
    });

    // Variants
    for (let i = 0; i < p.variants.length; i++) {
      const v = p.variants[i];
      const varId = `var_${p.id}_${i + 1}`;
      const varSku = `${p.sku}-${v.size}-${v.color.replace(/\s+/g, "").toUpperCase()}`;
      await db.execute({
        sql: `INSERT INTO product_variants (id, product_id, size, color, color_hex, sku, stock_quantity, price_override, image_url)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [varId, p.id, v.size, v.color, v.hex, varSku, v.stock, null, p.img],
      });

      // Initial Stock Movement Log
      await db.execute({
        sql: `INSERT INTO inventory_movements (id, variant_id, change_amount, reason, reference_id, created_at)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [`mov_${varId}`, varId, v.stock, "Initial boutique inventory intake", "SYSTEM_SEED", now],
      });
    }

    // Sample Verified Review
    await db.execute({
      sql: `INSERT INTO reviews (id, product_id, user_id, author_name, rating, title, comment, is_verified_purchase, is_approved, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        `rev_${p.id}`,
        p.id,
        "usr_cust_1",
        "Aarohi K.",
        5,
        "Pure poetry in motion",
        `I wore this to a gala last week and was showered with compliments. The fabric breathes beautifully and the drape is second to none!`,
        1,
        1,
        now,
      ],
    });
  }

  // 5. Promotional Coupons
  const coupons = [
    { code: "AIDAH15", type: "percent", val: 15, min: 2000, max: 2000 },
    { code: "WELCOME10", type: "percent", val: 10, min: 1000, max: 1000 },
    { code: "COUTURE500", type: "fixed", val: 500, min: 3500, max: null },
  ];

  for (const c of coupons) {
    await db.execute({
      sql: `INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, max_discount, usage_limit, usage_count, valid_from, valid_until, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [`cpn_${c.code}`, c.code, c.type, c.val, c.min, c.max, 500, 12, "2026-01-01", "2026-12-31", 1],
    });
  }

  // 6. Store Settings
  const defaultSettings = {
    store_name: "AIDAH",
    brand_tagline: "Handcrafted Designer Wear",
    currency: "INR",
    currency_symbol: "₹",
    tax_rate_percent: 5,
    free_shipping_threshold: 3999,
    standard_shipping_rate: 250,
    low_stock_threshold: 3,
    support_email: "concierge@aidah.com",
    support_phone: "+91 22 4580 9200",
    return_window_days: 14,
  };

  await db.execute({
    sql: `INSERT INTO store_settings (id, key, value_json, updated_at) VALUES (?, ?, ?, ?)`,
    args: ["set_main", "general", JSON.stringify(defaultSettings), now],
  });

  // 7. Initial Sample Orders (so admin dashboard has realistic metrics & historical snapshots)
  const orderAddress = JSON.stringify({
    full_name: "Lady Sophia Sterling",
    phone: "+919820011223",
    street_line1: "Apartment 14B, Royal Palms Crest, Pali Hill",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400050",
    country: "India",
  });

  await db.execute({
    sql: `INSERT INTO orders (
      id, order_number, user_id, guest_email, status, payment_status,
      subtotal, discount, tax, shipping_fee, total_amount, currency,
      shipping_address_json, tracking_carrier, tracking_number, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "ord_demo_101",
      "AIDAH-2026-00101",
      "usr_cust_1",
      "sophia@aidah.com",
      "delivered",
      "paid",
      18499,
      2774.85,
      786.2,
      0,
      16510.35,
      "INR",
      orderAddress,
      "BlueDart Couture Express",
      "BD9845120IN",
      "Fragile packaging with satin ribbon and lavender sachet requested.",
      "2026-10-18T10:30:00Z",
      "2026-10-20T16:00:00Z",
    ],
  });

  await db.execute({
    sql: `INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, size, color, sku, price_at_purchase, quantity, item_total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "item_101_1",
      "ord_demo_101",
      "prod_seraphina",
      "var_prod_seraphina_2",
      "The Seraphina Blush Silk Gown",
      "S",
      "Blush Rose",
      "AID-SERA-01-S-BLUSHROSE",
      18499,
      1,
      18499,
    ],
  });

  // Audit log of initialization
  await db.execute({
    sql: `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, details_json, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: ["log_init", "usr_admin_1", "STORE_SEED", "SYSTEM", "ALL", '{"message": "Atelier database initialized successfully with seed catalog and default administrator."}', now],
  });
}
