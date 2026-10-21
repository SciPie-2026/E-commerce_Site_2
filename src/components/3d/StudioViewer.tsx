"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useCart } from "@/context/CartContext";
import { Sparkles, Sun, Moon, RotateCcw, Check, ShoppingBag } from "lucide-react";

interface ColorOption {
  name: string;
  hex: string;
  threeColor: number;
}

const colorPalette: ColorOption[] = [
  { name: "Blush Rose", hex: "#D99BAA", threeColor: 0xd99baa },
  { name: "Warm Ivory", hex: "#FFF9F4", threeColor: 0xfff9f4 },
  { name: "Champagne Gold", hex: "#C8A56A", threeColor: 0xc8a56a },
  { name: "Cocoa Satin", hex: "#755B57", threeColor: 0x755b57 },
];

interface Hotspot {
  id: string;
  title: string;
  desc: string;
  position: [number, number, number];
}

const hotspots: Hotspot[] = [
  {
    id: "bodice",
    title: "Hand-Ruched Bodice",
    desc: "Featherlight French silk ruched over internal flexible boning for sculpted elegance.",
    position: [0, 1.2, 0.45],
  },
  {
    id: "waist",
    title: "Sculpted Empire Waist",
    desc: "Precision seamlines engineered to elongate the silhouette while ensuring fluid movement.",
    position: [0, 0.3, 0.48],
  },
  {
    id: "hemline",
    title: "Bias-Cut Cascading Train",
    desc: "Double-layered silk organza hem with micro horsehair ribbon for structural buoyancy.",
    position: [0, -1.5, 0.75],
  },
];

export function StudioViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(colorPalette[0]);
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [lightingMode, setLightingMode] = useState<"day" | "twilight">("day");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCart();

  // Three.js References
  const dressMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingMode === "day" ? 0xfff9f4 : 0x1f191c);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambLight = new THREE.AmbientLight(0xfff9f4, 1.5);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    dirLight.position.set(4, 6, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.PointLight(0xc8a56a, 1.8, 15);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Floor Pedestal with subtle marble glow
    const floorGeom = new THREE.CylinderGeometry(2.4, 2.6, 0.15, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf7efe7,
      roughness: 0.25,
      metalness: 0.1,
    });
    const pedestal = new THREE.Mesh(floorGeom, floorMat);
    pedestal.position.y = -2.1;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Mannequin & Dress Group
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // Mannequin Base Pole (Champagne Gold)
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xc8a56a,
      metalness: 0.8,
      roughness: 0.2,
    });
    const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.8, 16);
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.y = -0.6;
    mannequinGroup.add(pole);

    // Dress Material (Physical Silk Fabric)
    const dressMat = new THREE.MeshPhysicalMaterial({
      color: selectedColor.threeColor,
      roughness: 0.32,
      metalness: 0.12,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xffffff),
      side: THREE.DoubleSide,
    });
    dressMaterialRef.current = dressMat;

    // 1. Mannequin Torso / Bodice
    const bodiceGeom = new THREE.CylinderGeometry(0.38, 0.32, 1.1, 32);
    // Sculpt waist curvature
    const bPos = bodiceGeom.attributes.position;
    for (let i = 0; i < bPos.count; i++) {
      const y = bPos.getY(i);
      const factor = 1 - 0.22 * Math.cos((y / 0.55) * (Math.PI / 2));
      bPos.setX(i, bPos.getX(i) * factor);
      bPos.setZ(i, bPos.getZ(i) * factor);
    }
    bodiceGeom.computeVertexNormals();

    const bodice = new THREE.Mesh(bodiceGeom, dressMat);
    bodice.position.y = 0.9;
    bodice.castShadow = true;
    mannequinGroup.add(bodice);

    // 2. Neckline & Collar Accent (Champagne Gold)
    const neckGeom = new THREE.TorusGeometry(0.35, 0.03, 16, 32);
    const neck = new THREE.Mesh(neckGeom, poleMat);
    neck.rotation.x = Math.PI / 2;
    neck.position.y = 1.45;
    mannequinGroup.add(neck);

    // 3. Flowing Couture Gown Skirt
    const skirtGeom = new THREE.ConeGeometry(1.35, 2.2, 36, 12, true);
    // Add poetic rippling fabric folds
    const sPos = skirtGeom.attributes.position;
    for (let i = 0; i < sPos.count; i++) {
      const y = sPos.getY(i);
      const angle = Math.atan2(sPos.getZ(i), sPos.getX(i));
      const ripple = Math.sin(angle * 7) * 0.08 * (1 - y / 1.1);
      sPos.setX(i, sPos.getX(i) + Math.cos(angle) * ripple);
      sPos.setZ(i, sPos.getZ(i) + Math.sin(angle) * ripple);
    }
    skirtGeom.computeVertexNormals();

    const skirt = new THREE.Mesh(skirtGeom, dressMat);
    skirt.position.y = -0.55;
    skirt.castShadow = true;
    mannequinGroup.add(skirt);

    // 4. Waist Sash & Bow
    const sashGeom = new THREE.TorusGeometry(0.34, 0.04, 16, 32);
    const sash = new THREE.Mesh(sashGeom, poleMat);
    sash.rotation.x = Math.PI / 2;
    sash.position.y = 0.35;
    mannequinGroup.add(sash);

    // Mouse / Touch Interaction Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotationVelocityY = deltaX * 0.006;
      rotationVelocityX = deltaY * 0.003;

      mannequinGroup.rotation.y += rotationVelocityY;
      camera.position.y = Math.max(-0.5, Math.min(1.8, camera.position.y + rotationVelocityX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(3.5, Math.min(8.0, camera.position.z + e.deltaY * 0.005));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Inertial damping rotation
      if (!isDragging) {
        mannequinGroup.rotation.y += 0.0035;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [lightingMode]);

  // Update color dynamically in WebGL material
  useEffect(() => {
    if (dressMaterialRef.current) {
      dressMaterialRef.current.color.setHex(selectedColor.threeColor);
      dressMaterialRef.current.needsUpdate = true;
    }
  }, [selectedColor]);

  const handleResetCamera = () => {
    if (mannequinGroupRef.current) {
      mannequinGroupRef.current.rotation.y = 0;
    }
    setActiveHotspot(null);
  };

  const handleAddToCart = () => {
    addItem({
      variant_id: `var_prod_seraphina_custom_${selectedColor.name.toLowerCase()}_${selectedSize}`,
      product_id: "prod_seraphina",
      product_name: "The Seraphina Couture Studio Gown",
      product_slug: "seraphina-blush-silk-gown",
      image_url: "/media/catalog/seraphina-blush-gown.jpg",
      size: selectedSize,
      color: selectedColor.name,
      price: 18499,
      quantity: 1,
      max_stock: 12,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 3D Canvas Viewport (7 Cols) */}
      <div className="lg:col-span-7 bg-[#FFF9F4] rounded-2xl border border-[#D99BAA]/30 shadow-sm relative overflow-hidden flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full p-4 flex items-center justify-between z-10 bg-white/70 backdrop-blur-md border-b border-[#EFE5DC]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C8A56A] animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-medium text-[#755B57]">
              Haute Couture 3D Studio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLightingMode(lightingMode === "day" ? "twilight" : "day")}
              className="p-1.5 rounded-lg border border-[#D99BAA]/40 text-[#755B57] hover:bg-[#F4DDE3] transition-colors flex items-center gap-1.5 text-xs"
              title="Toggle Atelier Lighting"
            >
              {lightingMode === "day" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline capitalize">{lightingMode}light</span>
            </button>

            <button
              onClick={handleResetCamera}
              className="p-1.5 rounded-lg border border-[#D99BAA]/40 text-[#755B57] hover:bg-[#F4DDE3] transition-colors"
              title="Reset 3D Angle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* WebGL Canvas */}
        <div
          ref={containerRef}
          className="w-full h-[480px] md:h-[580px] cursor-grab active:cursor-grabbing relative"
        />

        {/* Interactive Hotspot Buttons Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center z-10 pointer-events-auto">
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-md flex items-center gap-1.5 ${
                activeHotspot?.id === hs.id
                  ? "bg-[#30272B] text-white shadow-md"
                  : "bg-white/85 text-[#755B57] border border-[#D99BAA]/40 hover:bg-[#F4DDE3]"
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#C8A56A]" />
              {hs.title}
            </button>
          ))}
        </div>

        {/* Hotspot Drawer Modal */}
        {activeHotspot && (
          <div className="absolute top-16 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-[#C8A56A]/40 shadow-xl z-20 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="font-serif-luxury text-base font-semibold text-[#30272B]">{activeHotspot.title}</h4>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-xs text-[#755B57] hover:text-[#30272B]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#755B57] leading-relaxed">{activeHotspot.desc}</p>
          </div>
        )}
      </div>

      {/* Garment Customization & Purchase Panel (5 Cols) */}
      <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-[#D99BAA]/30 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#F4DDE3] text-[#755B57]">
              Atelier Bespoke Preview
            </span>
            <span className="text-xs text-[#755B57]/70">• SKU: AID-STUDIO-01</span>
          </div>

          <h2 className="font-serif-luxury text-3xl font-medium text-[#30272B] mb-2">
            The Seraphina Couture Studio Gown
          </h2>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-serif-luxury font-semibold text-[#30272B]">₹18,499</span>
            <span className="text-sm line-through text-[#755B57]/60">₹22,999</span>
            <span className="text-xs font-medium text-[#D99BAA]">Complimentary Custom Fitting</span>
          </div>

          <p className="text-xs md:text-sm text-[#755B57] leading-relaxed mb-6 pb-6 border-b border-[#EFE5DC]">
            Tailored in pure Mulberry Silk Charmeuse with handcrafted corsetry. Use the interactive 3D studio to explore every seamline, rotate in 360°, and preview your shade of choice before our master tailors begin crafting.
          </p>

          {/* Color Switcher */}
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-[#755B57] font-semibold mb-2.5">
              Select Silk Palette: <span className="text-[#30272B] font-normal">{selectedColor.name}</span>
            </label>
            <div className="flex items-center gap-3">
              {colorPalette.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor.name === col.name
                      ? "border-[#30272B] scale-110 shadow-md"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                >
                  {selectedColor.name === col.name && (
                    <Check
                      className={`w-4 h-4 ${
                        col.name === "Warm Ivory" ? "text-[#30272B]" : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs uppercase tracking-widest text-[#755B57] font-semibold">
                Select Size
              </label>
              <a href="/size-guide" className="text-xs text-[#D99BAA] underline hover:text-[#C8A56A]">
                Atelier Size Guide
              </a>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["XS", "S", "M", "L"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                    selectedSize === sz
                      ? "bg-[#30272B] text-white border-[#30272B]"
                      : "bg-[#FFF9F4] text-[#755B57] border-[#D99BAA]/30 hover:border-[#C8A56A]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart CTA */}
        <div>
          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 rounded-full btn-gold font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Added to Boutique Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Order Tailored Gown • ₹18,499
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-[#755B57]/70 mt-3">
            Handcrafted on order • Dispatches within 5-7 business days with insured courier.
          </p>
        </div>
      </div>
    </div>
  );
}
