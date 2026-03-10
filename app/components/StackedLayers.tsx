"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Bottom layer = Learning, top = Frontend (current)
const LAYERS = [
  { label: "Learning",        color: 0xa8b5a0, emissive: 0x4a6a44 }, // sage
  { label: "Junior Dev",      color: 0x5a7a8a, emissive: 0x1a3a4a }, // slate
  { label: "Full-Stack",      color: 0xd4918e, emissive: 0x8a2020 }, // salmon
  { label: "Frontend",        color: 0xc0392b, emissive: 0xc0392b }, // accent (top/active)
];

interface Props {
  activeIndex?: number; // 0=bottom … 3=top
}

export default function StackedLayers({ activeIndex = 3 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeIndex);
  activeRef.current = activeIndex;

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0.5, 3.0, 7.5);
    camera.lookAt(0, 0.8, 0);

    // ── Lights ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(4, 8, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xfdf2e3, 0.5);
    fill.position.set(-4, 2, 3);
    scene.add(fill);

    // ── Build staircase ───────────────────────────────────────
    const root = new THREE.Group();

    const treadW   = 1.6;   // tread width (X)
    const treadH   = 0.26;  // tread height (Y) — slab thickness
    const treadD   = 1.5;   // tread depth  (Z)
    const stepX    = 0.82;  // horizontal offset per step
    const stepY    = 0.52;  // vertical rise per step
    const startX   = -(LAYERS.length - 1) * stepX * 0.5; // center the staircase

    const layerMeshes: THREE.Mesh[] = [];
    const glowLights: THREE.PointLight[] = [];
    const baseMats: THREE.MeshStandardMaterial[] = [];

    LAYERS.forEach((def, i) => {
      const cx = startX + i * stepX;
      const cy = i * stepY;

      // ── Tread (horizontal slab) ──────────────────────────
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.35,
        metalness: 0.15,
        emissive: 0x000000,
        emissiveIntensity: 0,
      });
      baseMats.push(mat);

      const tread = new THREE.Mesh(new THREE.BoxGeometry(treadW, treadH, treadD), mat);
      tread.position.set(cx, cy, 0);
      tread.castShadow = true;
      tread.receiveShadow = true;
      root.add(tread);
      layerMeshes.push(tread);

      // ── Riser (vertical face on front-right of step) ─────
      if (i > 0) {
        const riserH = stepY;
        const riserMat = new THREE.MeshStandardMaterial({
          color: def.color,
          roughness: 0.5,
          metalness: 0.1,
        });
        const riser = new THREE.Mesh(new THREE.BoxGeometry(treadW, riserH, 0.06), riserMat);
        riser.position.set(cx, cy - treadH * 0.5 - riserH * 0.5 + 0.01, treadD * 0.5 - 0.03);
        root.add(riser);
      }

      // ── Edge rim glow strip (front edge of tread) ────────
      const rimMat = new THREE.MeshStandardMaterial({
        color: def.color,
        roughness: 0.05,
        metalness: 0.8,
        emissive: def.emissive,
        emissiveIntensity: 0.5,
      });
      const rim = new THREE.Mesh(new THREE.BoxGeometry(treadW, 0.04, 0.07), rimMat);
      rim.position.set(cx, cy + treadH * 0.5 - 0.01, treadD * 0.5 + 0.02);
      root.add(rim);

      // ── Step number pill ─────────────────────────────────
      const pillMat = new THREE.MeshStandardMaterial({
        color: 0xfdf2e3,
        roughness: 0.8,
        emissive: 0xfdf2e3,
        emissiveIntensity: 0.1,
      });
      const pill = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), pillMat);
      pill.position.set(cx - treadW * 0.35, cy + treadH * 0.5 + 0.02, 0);
      root.add(pill);

      // ── Glow light ────────────────────────────────────────
      const glow = new THREE.PointLight(def.emissive, 0, 3.5);
      glow.position.set(cx, cy + 0.6, 1.0);
      scene.add(glow);
      glowLights.push(glow);

      // ── Groove lines on tread surface ─────────────────────
      for (let s = 0; s < 3; s++) {
        const groove = new THREE.Mesh(
          new THREE.BoxGeometry(treadW - 0.2, 0.01, 0.035),
          new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.07 })
        );
        groove.position.set(cx, cy + treadH * 0.5 + 0.005, -0.4 + s * 0.38);
        root.add(groove);
      }
    });

    // Floating particles above top layer
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const topLayerX = startX + (LAYERS.length - 1) * stepX;
    const topLayerY = (LAYERS.length - 1) * stepY + treadH;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = topLayerX + (Math.random() - 0.5) * treadW;
      positions[i * 3 + 1] = topLayerY + Math.random() * 1.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * treadD;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc0392b,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    root.add(particles);

    scene.add(root);
    root.rotation.y = 0.35;

    // ── Drag to rotate ────────────────────────────────────────
    let isDragging = false;
    let prevX = 0;
    let rotY = 0.35;
    let velY = 0;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevX = "touches" in e ? e.touches[0].clientX : e.clientX;
      velY = 0;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      velY = (x - prevX) * 0.012;
      rotY += velY;
      prevX = x;
    };
    const onUp = () => { isDragging = false; renderer.domElement.style.cursor = "grab"; };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("mousedown", onDown);
    renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    // ── Animate ───────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const active = activeRef.current;

      // Rotation
      if (!isDragging) {
        velY *= 0.92;
        if (Math.abs(velY) < 0.0005) velY = 0;
        rotY += velY + 0.003;
      }
      root.rotation.y = rotY;

      // Gentle float
      root.position.y = Math.sin(t * 0.5) * 0.06 - 0.5;

      // Layer highlight animation
      LAYERS.forEach((def, i) => {
        const isActive = i === active;
        const mat = baseMats[i];
        const glow = glowLights[i];

        // Smoothly animate emissiveIntensity and glow
        const targetEmissive = isActive ? 0.22 : 0;
        const targetGlow = isActive ? 2.2 : 0;
        const targetY = isActive ? Math.sin(t * 2.5) * 0.04 : 0; // active layer bobs

        mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.06;
        mat.emissive.set(isActive ? def.emissive : 0x000000);
        glow.intensity += (targetGlow - glow.intensity) * 0.06;

        const baseY = i * stepY;
        layerMeshes[i].position.y += (baseY + targetY - layerMeshes[i].position.y) * 0.08;
      });

      // Particle drift upward
      const pos = particles.geometry.attributes.position;
      const topBase = (LAYERS.length - 1) * stepY + treadH;
      const topLayerX = startX + (LAYERS.length - 1) * stepX;
      for (let i = 0; i < particleCount; i++) {
        pos.setY(i, pos.getY(i) + 0.004);
        if (pos.getY(i) > topBase + 1.4) {
          pos.setY(i, topBase);
          pos.setX(i, topLayerX + (Math.random() - 0.5) * treadW);
        }
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────
    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener("mousedown", onDown);
      renderer.domElement.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
