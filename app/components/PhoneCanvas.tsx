"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PhoneCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Lights ───────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 5, 5);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xc0392b, 0.8); // red fill
    fill.position.set(-4, -2, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xfdf2e3, 0.5); // cream rim
    rim.position.set(0, -5, -3);
    scene.add(rim);

    // ── Helper: rounded box via CapsuleGeometry hack ──────────
    // Build phone from primitives grouped together
    const phone = new THREE.Group();

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.1, 2.2, 0.14, 1, 1, 1);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.15,
      metalness: 0.9,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    phone.add(body);

    // Screen bezel (slightly raised dark rect)
    const bezelGeo = new THREE.BoxGeometry(0.95, 1.95, 0.01);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.05,
      metalness: 0.3,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = 0.075;
    phone.add(bezel);

    // Screen display (emissive glow)
    const screenGeo = new THREE.BoxGeometry(0.88, 1.82, 0.005);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      emissive: 0xc0392b,
      emissiveIntensity: 0.15,
      roughness: 0.0,
      metalness: 0.1,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.082;
    phone.add(screen);

    // Dynamic island / notch (pill shape via capsule)
    const notchGeo = new THREE.CapsuleGeometry(0.05, 0.15, 4, 8);
    const notchMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.9 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.rotation.z = Math.PI / 2;
    notch.position.set(0, 0.8, 0.088);
    phone.add(notch);

    // Camera bump (back)
    const camBumpGeo = new THREE.BoxGeometry(0.32, 0.32, 0.06);
    const camBumpMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.1, metalness: 0.95 });
    const camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
    camBump.position.set(-0.22, 0.72, -0.1);
    phone.add(camBump);

    // Camera lens 1
    const lens1Geo = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 0.0, metalness: 0.8 });
    const lens1 = new THREE.Mesh(lens1Geo, lensMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(-0.28, 0.78, -0.13);
    phone.add(lens1);

    // Camera lens 2
    const lens2 = lens1.clone();
    lens2.position.set(-0.16, 0.67, -0.13);
    phone.add(lens2);

    // Side button
    const btnGeo = new THREE.BoxGeometry(0.03, 0.18, 0.06);
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.set(0.565, 0.2, 0);
    phone.add(btn);

    // Volume buttons (left side)
    const vol1 = btn.clone();
    vol1.position.set(-0.565, 0.35, 0);
    phone.add(vol1);
    const vol2 = btn.clone();
    vol2.position.set(-0.565, 0.1, 0);
    phone.add(vol2);

    scene.add(phone);
    phone.rotation.x = 0.15;
    phone.rotation.y = -0.3;

    // ── Drag-to-rotate ───────────────────────────────────────
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    // Current accumulated rotation
    let rotY = -0.3;
    let rotX = 0.15;

    // Velocity (inertia)
    let velX = 0;
    let velY = 0;

    const getXY = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const { x, y } = getXY(e);
      prevPointerX = x;
      prevPointerY = y;
      velX = 0;
      velY = 0;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const { x, y } = getXY(e);
      const dx = x - prevPointerX;
      const dy = y - prevPointerY;
      velY = dx * 0.01;
      velX = dy * 0.01;
      rotY += velY;
      rotX += velX;
      // Clamp vertical rotation so phone doesn't flip upside-down
      rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
      prevPointerX = x;
      prevPointerY = y;
    };

    const onPointerUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = "grab";
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("mousedown", onPointerDown);
    renderer.domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // ── Animate ──────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (isDragging) {
        // Direct drag — apply instantly
        phone.rotation.y = rotY;
        phone.rotation.x = rotX;
      } else {
        // Apply inertia
        velY *= 0.94;
        velX *= 0.94;
        rotY += velY;
        rotX += velX;
        rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));

        // Smooth lerp toward resting state when velocity is tiny
        const isResting = Math.abs(velY) < 0.0005 && Math.abs(velX) < 0.0005;
        if (isResting) {
          // Gentle idle animation
          phone.rotation.y = rotY + Math.sin(t * 0.4) * 0.25;
          phone.rotation.x = rotX + Math.sin(t * 0.3) * 0.05;
        } else {
          phone.rotation.y = rotY;
          phone.rotation.x = rotX;
        }
      }

      // Floating
      phone.position.y = Math.sin(t * 0.6) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener("mousedown", onPointerDown);
      renderer.domElement.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
