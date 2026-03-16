"use client";

import React, { useEffect, useRef, useState } from "react";

const MODEL_PATH = "/models/exploding-view.glb";

export function ExplodingView3D({ embedded = false }: { embedded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const modelUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${MODEL_PATH}?t=${Date.now()}`
        : MODEL_PATH;

    let animationId: number;
    let controls: InstanceType<typeof import("three/addons/controls/OrbitControls.js").OrbitControls> | null = null;
    let cancelled = false;

    async function init() {
      if (!container) return;
      const el = container;
      const THREE = await import("three");
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");

      const width = el.offsetWidth;
      const height = Math.max(el.offsetHeight, 400);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(embedded ? 0x141414 : 0xb8bcc4);

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 3);

      const gl = new THREE.WebGLRenderer({ antialias: true, alpha: !embedded });
      gl.setSize(width, height);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      gl.outputColorSpace = THREE.SRGBColorSpace;
      if (embedded) {
        gl.setClearColor(0x141414, 1);
        gl.toneMapping = THREE.LinearToneMapping;
        gl.toneMappingExposure = 1;
      } else {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }
      el.appendChild(gl.domElement);

      // Very low ambient so engraving has strong light/shadow and reads detailed
      const ambient = new THREE.AmbientLight(0xffffff, 0.14);
      scene.add(ambient);
      // Key: strong raking – sharp highlight on one side of engraving
      const key = new THREE.DirectionalLight(0xffffff, 1.75);
      key.position.set(2.5, 1.4, 0.7);
      scene.add(key);
      const rake = new THREE.DirectionalLight(0xffffff, 1.15);
      rake.position.set(-2.2, 0.5, 0.9);
      scene.add(rake);
      // Fill: gentle so engraving stays defined – open up shadows so recessed logo isn’t a black hole
      const fill = new THREE.DirectionalLight(0xffffff, 0.18);
      fill.position.set(-0.6, 0.1, 1.4);
      scene.add(fill);
      // Rim: from behind – edge light to separate figure from background
      const rim = new THREE.DirectionalLight(0xffffff, 0.55);
      rim.position.set(0, 0.5, -1.8);
      scene.add(rim);
      // Top graze – sharp rim on engraving circle
      const top = new THREE.DirectionalLight(0xffffff, 0.65);
      top.position.set(0.3, 2.5, 0.5);
      scene.add(top);
      // Detail: tight grazing from right to pick out engraving edges
      const detail = new THREE.DirectionalLight(0xffffff, 0.5);
      detail.position.set(1.2, 0.3, 0.4);
      scene.add(detail);

      controls = new OrbitControls(camera, gl.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.8;

      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          if (cancelled) return;
          const group = gltf.scene;
          scene.add(group);
          const box = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          const size = new THREE.Vector3();
          box.getCenter(center);
          box.getSize(size);
          group.position.sub(center);
          const maxDim = Math.max(size.x, size.y, size.z);
          // Half that distance: very tight crop on tracker
          const dist = Math.max(maxDim * 0.25, 0.2);
          camera.position.set(0, 0, dist);
          controls?.target.set(0, 0, 0);
          if (controls) {
            controls.minDistance = dist;
            controls.maxDistance = dist;
          }
          setError(null);
          setLoading(false);
        },
        undefined,
        (err) => {
          if (cancelled) return;
          console.error("GLB load error:", err);
          const errMsg = err instanceof Error ? err.message : "";
          const message =
            errMsg.includes("404") || errMsg.includes("Not Found")
              ? "Model file not found. Add exploding-view.glb to public/models/."
              : "Could not load 3D model. Check the file is a valid GLB.";
          setError(message);
          setLoading(false);
        }
      );

      function resize() {
        const w = el.offsetWidth;
        const h = Math.max(el.offsetHeight, 400);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        gl.setSize(w, h);
      }
      window.addEventListener("resize", resize);

      function animate() {
        animationId = requestAnimationFrame(animate);
        controls?.update();
        gl.render(scene, camera);
      }
      animate();

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationId);
        controls?.dispose();
        gl.dispose();
        if (el.contains(gl.domElement)) el.removeChild(gl.domElement);
      };
    }

    let cleanup: (() => void) | null = null;
    init().then((fn) => {
      if (cancelled && fn) fn();
      else cleanup = fn ?? null;
    });
    return () => {
      cancelled = true;
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const content = (
    <div className={embedded ? "w-full" : "mx-auto max-w-6xl px-6"}>
      {!embedded && (
        <>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 mb-4 text-center">
            EXPLORE THE <span className="text-primary">TRACKER</span>
          </h2>
          <p className="text-neutral-600 text-center text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Drag to adjust rotation — it keeps spinning.
          </p>
        </>
      )}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden flex items-center justify-center ${embedded ? "" : "rounded-2xl"}`}
        style={{
          minHeight: embedded ? "48vh" : "60vh",
          backgroundColor: embedded ? "transparent" : "#9ca3af",
        }}
      >
        {loading && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${embedded ? "text-white/50" : "text-neutral-500"}`}>
            <span className="animate-pulse">Loading 3D model…</span>
          </div>
        )}
        {error && (
          <div className={`absolute inset-0 flex items-center justify-center text-center px-6 z-10 ${embedded ? "text-white/50" : "text-neutral-400"}`}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section
      id="explore-3d"
      className="relative py-20 md:py-28 bg-[#b8bcc4] overflow-hidden"
    >
      {content}
    </section>
  );
}
