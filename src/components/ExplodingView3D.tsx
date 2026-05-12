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
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 3);

      const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      gl.setSize(width, height);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.setClearColor(0x000000, 0);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = embedded ? 1.6 : 1.15;
      el.appendChild(gl.domElement);

      // Bright procedural environment map — the only way to make a dark
      // object readable is strong reflections that reveal surface shape.
      const pmrem = new THREE.PMREMGenerator(gl);
      pmrem.compileEquirectangularShader();
      const envScene = new THREE.Scene();
      envScene.add(
        new THREE.HemisphereLight(new THREE.Color(0x8899bb), new THREE.Color(0x222233), 2.0)
      );
      const panelGeo = new THREE.PlaneGeometry(6, 6);
      // Large bright front panel — creates the broad specular highlight
      // that makes the logo visible when facing the camera
      const fp = new THREE.Mesh(
        panelGeo,
        new THREE.MeshBasicMaterial({ color: 0xbbccdd, side: THREE.DoubleSide })
      );
      fp.position.set(0, 0.2, 4);
      envScene.add(fp);
      // Top panel — adds definition to the upper edge of the device
      const topP = new THREE.Mesh(
        panelGeo,
        new THREE.MeshBasicMaterial({ color: 0x99aabb, side: THREE.DoubleSide })
      );
      topP.position.set(0, 4, 0);
      topP.rotation.x = Math.PI / 2;
      envScene.add(topP);
      // Side panels for when the model rotates to profile views
      const sideGeo = new THREE.PlaneGeometry(4, 4);
      const rightP = new THREE.Mesh(
        sideGeo,
        new THREE.MeshBasicMaterial({ color: 0x8899aa, side: THREE.DoubleSide })
      );
      rightP.position.set(4, 0, 0);
      rightP.rotation.y = -Math.PI / 2;
      envScene.add(rightP);
      const leftP = new THREE.Mesh(
        sideGeo,
        new THREE.MeshBasicMaterial({ color: 0x778899, side: THREE.DoubleSide })
      );
      leftP.position.set(-4, 0, 0);
      leftP.rotation.y = Math.PI / 2;
      envScene.add(leftP);
      // Subtle purple accent in the env map to match brand
      const accentP = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        new THREE.MeshBasicMaterial({ color: 0x6633aa, side: THREE.DoubleSide })
      );
      accentP.position.set(-1, -2, 2);
      accentP.rotation.x = -Math.PI / 4;
      envScene.add(accentP);

      const envMap = pmrem.fromScene(envScene, 0.04).texture;
      scene.environment = envMap;
      envScene.traverse((obj) => {
        const m = obj as InstanceType<typeof THREE.Mesh>;
        if (m.geometry) m.geometry.dispose();
      });
      pmrem.dispose();

      // Hemisphere light — warm-cool ambient fill
      const hemi = new THREE.HemisphereLight(0xdde4f0, 0x1a1a2e, 0.8);
      scene.add(hemi);

      // Key: front-top-right, primary face illumination
      const key = new THREE.DirectionalLight(0xeef0ff, 2.0);
      key.position.set(1.5, 2.0, 3.0);
      scene.add(key);

      // Fill: front-left, opens up shadows on the logo
      const fill = new THREE.DirectionalLight(0xe8eeff, 1.0);
      fill.position.set(-2.0, 0.8, 2.5);
      scene.add(fill);

      // Front dead-center, slightly low — catches the engraved logo edges
      const frontAccent = new THREE.DirectionalLight(0xffffff, 0.8);
      frontAccent.position.set(0, -0.5, 3.5);
      scene.add(frontAccent);

      // Purple accent light from below-left — brand tie-in
      const purpleAccent = new THREE.PointLight(0xa855f7, 0.6, 8);
      purpleAccent.position.set(-1.5, -1.5, 1.5);
      scene.add(purpleAccent);

      // Rim: behind for edge separation
      const rim = new THREE.DirectionalLight(0x8899bb, 0.8);
      rim.position.set(0, 1.0, -3.0);
      scene.add(rim);

      // Top graze: surface contour definition
      const topLight = new THREE.DirectionalLight(0xdde4f0, 0.6);
      topLight.position.set(0.2, 3.5, 1.0);
      scene.add(topLight);

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

          group.traverse((child) => {
            const mesh = child as InstanceType<typeof THREE.Mesh>;
            if (mesh.isMesh && mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              for (const mat of mats) {
                const std = mat as InstanceType<typeof THREE.MeshStandardMaterial>;
                if (std.isMeshStandardMaterial) {
                  std.envMapIntensity = 2.5;
                  std.needsUpdate = true;
                }
              }
            }
          });

          scene.add(group);
          const box = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          const size = new THREE.Vector3();
          box.getCenter(center);
          box.getSize(size);
          group.position.sub(center);
          const maxDim = Math.max(size.x, size.y, size.z);
          const dist = Math.max(maxDim * 0.15, 0.2);
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
            <span className="animate-pulse">Loading 3D model...</span>
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
