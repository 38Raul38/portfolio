"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DeskCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    // ── Renderer ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
    camera.position.set(0, 3.8, 7);
    camera.lookAt(0, 0.5, 0);

    // ── Lights ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfdf2e3, 0.5));

    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(4, 8, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 30;
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    scene.add(sun);

    // Lamp warm point light (will be updated in animate)
    const lampLight = new THREE.PointLight(0xffd580, 2.5, 5);
    lampLight.position.set(-1.4, 2.0, 0.2);
    lampLight.castShadow = true;
    scene.add(lampLight);

    const fillLight = new THREE.DirectionalLight(0xc0392b, 0.3);
    fillLight.position.set(-4, 0, 3);
    scene.add(fillLight);

    // ── Materials ─────────────────────────────────────────────
    const mat = (color: number, rough = 0.7, metal = 0.0) =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

    const deskMat   = mat(0x8b6340, 0.6, 0.05); // wood
    const legMat    = mat(0x5a3e28, 0.8, 0.0);
    const monMat    = mat(0x1a1a1a, 0.2, 0.8);
    const keyMat    = mat(0x222222, 0.5, 0.3);
    const keycapMat = mat(0x2e2e2e, 0.8, 0.0);
    const lampBaseMat = mat(0x333333, 0.3, 0.9);
    const lampArmMat  = mat(0x444444, 0.4, 0.8);
    const lampShade   = new THREE.MeshStandardMaterial({ color: 0xfdf2e3, roughness: 0.9, metalness: 0.0, emissive: 0xffd580, emissiveIntensity: 0.6 });
    const mugMat    = mat(0xfdf2e3, 0.9, 0.0);
    const mugAccent = mat(0xc0392b, 0.9, 0.0);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.0, metalness: 0.1, emissive: 0x1a4a6e, emissiveIntensity: 0.8 });

    const root = new THREE.Group();

    // ─────────────────────────────────────────────────────────
    // DESK
    // ─────────────────────────────────────────────────────────
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(5, 0.12, 2.2), deskMat);
    deskTop.position.y = 0;
    deskTop.receiveShadow = true;
    root.add(deskTop);

    // Wood grain lines (thin boxes on top)
    for (let i = 0; i < 5; i++) {
      const grain = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.002, 0.012),
        mat(0x7a5530, 0.9, 0)
      );
      grain.position.set(0, 0.062, -0.8 + i * 0.38);
      root.add(grain);
    }

    // Legs
    const legPositions: [number, number][] = [[-2.3, -0.85], [2.3, -0.85], [-2.3, 0.85], [2.3, 0.85]];
    legPositions.forEach(([x, z]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), legMat);
      leg.position.set(x, -0.66, z);
      leg.castShadow = true;
      root.add(leg);
    });

    // ─────────────────────────────────────────────────────────
    // MONITOR
    // ─────────────────────────────────────────────────────────
    const monGroup = new THREE.Group();
    monGroup.position.set(0.3, 0.06, -0.55);

    // Stand base
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.35), mat(0x2a2a2a, 0.3, 0.8));
    standBase.position.y = 0;
    standBase.castShadow = true;
    monGroup.add(standBase);

    // Stand neck
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.55, 0.07), mat(0x2a2a2a, 0.3, 0.8));
    neck.position.y = 0.3;
    neck.castShadow = true;
    monGroup.add(neck);

    // Monitor back
    const monBack = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 0.1), monMat);
    monBack.position.set(0, 1.1, 0);
    monBack.castShadow = true;
    monGroup.add(monBack);

    // Bezel
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.25, 0.02), mat(0x111111, 0.1, 0.5));
    bezel.position.set(0, 1.1, 0.055);
    monGroup.add(bezel);

    // Screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.98, 1.14, 0.005), screenMat);
    screen.position.set(0, 1.1, 0.067);
    monGroup.add(screen);

    // Code lines on screen (bright thin boxes)
    const lineColors = [0x79c0ff, 0x56d364, 0xff7b72, 0xd2a8ff, 0xffa657];
    const lineWidths = [1.1, 0.7, 0.9, 0.5, 0.8, 0.4, 0.6, 1.0, 0.3, 0.75];
    for (let i = 0; i < 10; i++) {
      const codeLine = new THREE.Mesh(
        new THREE.BoxGeometry(lineWidths[i], 0.028, 0.002),
        new THREE.MeshStandardMaterial({
          color: lineColors[i % lineColors.length],
          emissive: lineColors[i % lineColors.length],
          emissiveIntensity: 0.9,
        })
      );
      codeLine.position.set(-0.42 + lineWidths[i] / 2 - 0.99, 1.58 - i * 0.112, 0.072);
      monGroup.add(codeLine);
    }

    root.add(monGroup);

    // ─────────────────────────────────────────────────────────
    // KEYBOARD
    // ─────────────────────────────────────────────────────────
    const kbGroup = new THREE.Group();
    kbGroup.position.set(0.3, 0.06, 0.35);

    // Base
    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.6), keyMat);
    kbBase.castShadow = true;
    kbGroup.add(kbBase);

    // Keys (4 rows x 12 cols)
    const rows = 4, cols = 12;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.03, 0.115), keycapMat);
        key.position.set(-0.77 + c * 0.135, 0.045, -0.2 + r * 0.14);
        kbGroup.add(key);
      }
    }
    // Space bar
    const space = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.115), keycapMat);
    space.position.set(0.0, 0.045, 0.35);
    kbGroup.add(space);

    root.add(kbGroup);

    // ─────────────────────────────────────────────────────────
    // LAMP
    // ─────────────────────────────────────────────────────────
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-1.8, 0.06, -0.4);

    // Base
    const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.05, 20), lampBaseMat);
    lBase.castShadow = true;
    lampGroup.add(lBase);

    // Arm 1 (vertical)
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 10), lampArmMat);
    arm1.position.set(0, 0.475, 0);
    arm1.castShadow = true;
    lampGroup.add(arm1);

    // Joint
    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), lampArmMat);
    joint.position.set(0, 0.95, 0);
    lampGroup.add(joint);

    // Arm 2 (angled)
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10), lampArmMat);
    arm2.rotation.z = -0.5;
    arm2.position.set(0.19, 1.25, 0);
    arm2.castShadow = true;
    lampGroup.add(arm2);

    // Shade (cone)
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.28, 20, 1, true), lampShade);
    shade.rotation.z = Math.PI;
    shade.position.set(0.42, 1.52, 0);
    shade.castShadow = false;
    lampGroup.add(shade);

    root.add(lampGroup);

    // ─────────────────────────────────────────────────────────
    // MUG
    // ─────────────────────────────────────────────────────────
    const mugGroup = new THREE.Group();
    mugGroup.position.set(-0.9, 0.06, 0.3);

    // Body
    const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.38, 24), mugMat);
    mugBody.castShadow = true;
    mugGroup.add(mugBody);

    // Inner (dark coffee)
    const mugInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.01, 24),
      mat(0x3b1f08, 0.9, 0)
    );
    mugInner.position.y = 0.19;
    mugGroup.add(mugInner);

    // Handle (torus)
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.025, 10, 20, Math.PI),
      mugAccent
    );
    handle.rotation.y = Math.PI / 2;
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.19, 0.02, 0);
    mugGroup.add(handle);

    root.add(mugGroup);

    // ─────────────────────────────────────────────────────────
    // MOUSE
    // ─────────────────────────────────────────────────────────
    const mouseBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.075, 0.18, 8, 16),
      mat(0x1a1a1a, 0.3, 0.7)
    );
    mouseBody.rotation.x = Math.PI / 2;
    mouseBody.position.set(1.35, 0.1, 0.3);
    mouseBody.castShadow = true;
    root.add(mouseBody);

    // Scroll wheel
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.06, 12),
      mat(0x444444, 0.5, 0.5)
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(1.35, 0.175, 0.2);
    root.add(wheel);

    // ─────────────────────────────────────────────────────────
    // NOTEPAD
    // ─────────────────────────────────────────────────────────
    const notepad = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.01, 0.8), mat(0xfffde7, 0.95, 0));
    notepad.position.set(1.5, 0.065, -0.2);
    notepad.receiveShadow = true;
    root.add(notepad);

    // Lines on notepad
    for (let i = 0; i < 5; i++) {
      const noteLine = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.002, 0.008), mat(0xb0bec5, 0.9, 0));
      noteLine.position.set(1.5, 0.072, -0.4 + i * 0.14);
      root.add(noteLine);
    }

    // Pen
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.009, 0.55, 12), mat(0xc0392b, 0.7, 0.3));
    pen.rotation.z = 0.4;
    pen.position.set(1.82, 0.09, -0.05);
    pen.castShadow = true;
    root.add(pen);

    scene.add(root);

    // Initial rotation for a nice 3/4 view
    root.rotation.y = -0.35;

    // ── Drag to rotate ───────────────────────────────────────
    let isDragging = false;
    let prevX = 0;
    let rotY = -0.35;
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

    // ── Animate ──────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (isDragging) {
        root.rotation.y = rotY;
      } else {
        velY *= 0.92;
        rotY += velY;
        // Slow auto-drift when idle
        if (Math.abs(velY) < 0.0005) {
          rotY += 0.0018;
        }
        root.rotation.y = rotY;
      }

      // Gentle floating
      root.position.y = Math.sin(t * 0.5) * 0.04;

      // Lamp flicker
      lampLight.intensity = 2.5 + Math.sin(t * 8) * 0.08;

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

  return <div ref={mountRef} className="w-full h-full" style={{ cursor: "grab" }} />;
}
