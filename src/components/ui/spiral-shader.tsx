"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type ShaderAnimationProps = {
  /** When set, animation runs for this many ms then freezes. */
  runOnceMs?: number;
  /** Called when runOnceMs finishes. */
  onComplete?: () => void;
  /** Optional class for the wrapper. */
  className?: string;
};

export function ShaderAnimation({ runOnceMs, onComplete, className = "" }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } };
    animationId: number;
    geometry: THREE.PlaneGeometry;
    material: THREE.ShaderMaterial;
    running: boolean;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float fadeOut;

      vec3 getColor(float intensity) {
          vec3 color1 = vec3(1.0, 0.05, 0.25);
          vec3 color2 = vec3(1.0, 0.4, 0.0);
          vec3 color3 = vec3(1.0, 1.0, 0.0);
          vec3 color4 = vec3(0.1, 1.0, 0.1);
          vec3 color5 = vec3(0.2, 0.5, 1.0);
          vec3 color6 = vec3(0.7, 0.0, 1.0);
          vec3 color7 = vec3(1.0, 0.0, 0.7);

          vec3 finalColor = color1;
          finalColor = mix(finalColor, color2, smoothstep(0.0, 0.17, intensity));
          finalColor = mix(finalColor, color3, smoothstep(0.17, 0.34, intensity));
          finalColor = mix(finalColor, color4, smoothstep(0.34, 0.51, intensity));
          finalColor = mix(finalColor, color5, smoothstep(0.51, 0.68, intensity));
          finalColor = mix(finalColor, color6, smoothstep(0.68, 0.85, intensity));
          finalColor = mix(finalColor, color7, smoothstep(0.85, 1.0, intensity));
          return finalColor;
      }

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.003;

        float radius = length(uv);
        float angle = atan(uv.y, uv.x);
        float total_intensity = 0.0;

        for(int i=0; i < 5; i++){
          float spiral_pattern = radius * 2.0 + angle * 0.5;
          total_intensity += lineWidth*float(i*i) / abs(fract(t + float(i)*0.02)*5.0 - spiral_pattern + mod(uv.x+uv.y, 0.2));
        }

        vec3 finalColor = getColor(fract(total_intensity * 0.25 + t * 0.1));
        float alpha = 1.0 - fadeOut;
        gl_FragColor = vec4(finalColor * total_intensity * alpha, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      fadeOut: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    let running = true;
    sceneRef.current = {
      camera,
      renderer,
      uniforms,
      animationId: 0,
      geometry,
      material,
      running: true,
    };

    const fadeOutMs = 700;
    const startFadeAt = runOnceMs != null && runOnceMs > 0 ? runOnceMs - fadeOutMs : Infinity;
    const startTime = typeof performance !== "undefined" ? performance.now() : 0;

    // One full cycle in the shader: t = time*0.05, fract(t) has period 1, so time 0→20 = one cycle
    const TIME_ONE_CYCLE = 20;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (runOnceMs != null && runOnceMs > 0) {
      timeoutId = setTimeout(() => {
        running = false;
        if (sceneRef.current) sceneRef.current.running = false;
        uniforms.time.value = TIME_ONE_CYCLE;
        uniforms.fadeOut.value = 1;
        onComplete?.();
      }, runOnceMs);
    }

    const animate = () => {
      const id = requestAnimationFrame(animate);
      if (sceneRef.current) sceneRef.current.animationId = id;
      const elapsed = (typeof performance !== "undefined" ? performance.now() : 0) - startTime;
      if (runOnceMs != null && runOnceMs > 0) {
        const progress = Math.min(1, elapsed / runOnceMs);
        uniforms.time.value = progress * TIME_ONE_CYCLE;
      } else if (running && sceneRef.current?.running !== false) {
        uniforms.time.value += 0.05;
      }
      if (elapsed >= startFadeAt && elapsed < startFadeAt + fadeOutMs) {
        uniforms.fadeOut.value = Math.min(1, (elapsed - startFadeAt) / fadeOutMs);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      window.removeEventListener("resize", onWindowResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        sceneRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- runOnceMs is the only intentional trigger; onComplete is called once
  }, [runOnceMs]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{
        background: "#141414",
        overflow: "hidden",
      }}
    />
  );
}

export default ShaderAnimation;
