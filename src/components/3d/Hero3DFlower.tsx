"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Hero3DFlower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    // Scene, Camera, Renderer
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Boutique Lights
    const ambientLight = new THREE.AmbientLight(0xfff9f4, 1.8);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc8a56a, 3.5, 20);
    goldPointLight.position.set(4, 5, 4);
    scene.add(goldPointLight);

    const roseLight = new THREE.PointLight(0xd99baa, 2.5, 20);
    roseLight.position.set(-4, -2, 3);
    scene.add(roseLight);

    // Group for flower
    const flowerGroup = new THREE.Group();
    scene.add(flowerGroup);

    // Procedural Haute Couture Botanical Flower
    // Materials
    const petalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf4dde3,
      emissive: 0xd99baa,
      emissiveIntensity: 0.15,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });

    const innerPetalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd99baa,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.6,
      side: THREE.DoubleSide,
    });

    const goldStamenMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8a56a,
      roughness: 0.2,
      metalness: 0.85,
    });

    // Create 3 layers of petals (outer, middle, inner)
    const createPetalShape = (scaleX: number, scaleY: number) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.bezierCurveTo(scaleX * 0.8, scaleY * 0.3, scaleX * 0.9, scaleY * 0.8, 0, scaleY);
      shape.bezierCurveTo(-scaleX * 0.9, scaleY * 0.8, -scaleX * 0.8, scaleY * 0.3, 0, 0);

      const geom = new THREE.ShapeGeometry(shape, 16);
      // Curve petal vertices forward
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const zCurvature = Math.sin((y / scaleY) * Math.PI) * 0.35;
        pos.setZ(i, zCurvature);
      }
      geom.computeVertexNormals();
      return geom;
    };

    // Outer Petals (8)
    const outerGeom = createPetalShape(1.1, 2.4);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(outerGeom, petalMaterial);
      petal.rotation.z = angle;
      petal.rotation.x = 0.55;
      petal.position.z = -0.2;
      flowerGroup.add(petal);
    }

    // Mid Petals (6)
    const midGeom = createPetalShape(0.85, 1.8);
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.3;
      const petal = new THREE.Mesh(midGeom, innerPetalMaterial);
      petal.rotation.z = angle;
      petal.rotation.x = 0.4;
      petal.position.z = 0.05;
      flowerGroup.add(petal);
    }

    // Inner Core / Golden Stamen Spheres
    const centerGeom = new THREE.SphereGeometry(0.42, 24, 24);
    const centerMesh = new THREE.Mesh(centerGeom, goldStamenMaterial);
    flowerGroup.add(centerMesh);

    // Floating Stamen Pearls
    for (let i = 0; i < 14; i++) {
      const stamenGeom = new THREE.SphereGeometry(0.06, 12, 12);
      const stamenMesh = new THREE.Mesh(stamenGeom, goldStamenMaterial);
      const phi = Math.random() * Math.PI * 2;
      const r = 0.45 + Math.random() * 0.25;
      stamenMesh.position.set(Math.cos(phi) * r, Math.sin(phi) * r, 0.25 + Math.random() * 0.2);
      flowerGroup.add(stamenMesh);
    }

    // Floating Couture Dust Particles
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 8;
      particlePos[i + 1] = (Math.random() - 0.5) * 8;
      particlePos[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc8a56a,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
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
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating oscillation
      flowerGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;
      flowerGroup.position.x = Math.cos(elapsedTime * 0.6) * 0.08;

      // Mouse drag rotation tracking
      targetRotationY = mouseX * 0.65;
      targetRotationX = -mouseY * 0.45;

      flowerGroup.rotation.y += (targetRotationY - flowerGroup.rotation.y) * 0.05 + 0.003;
      flowerGroup.rotation.x += (targetRotationX - flowerGroup.rotation.x) * 0.05;
      flowerGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.05;

      particles.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!isWebGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center">
        <div className="w-48 h-48 rounded-full bg-[#F4DDE3]/60 border border-[#D99BAA]/40 flex items-center justify-center">
          <span className="font-serif-luxury italic text-[#755B57] text-lg">AIDAH Atelier</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
      aria-label="Interactive 3D Botanical Sculpture"
    >
      <div className="absolute bottom-2 right-4 text-[11px] uppercase tracking-widest text-[#755B57]/60 pointer-events-none select-none">
        3D Atelier Blossom • Drag to inspect
      </div>
    </div>
  );
}
