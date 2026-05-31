"use client";

import { useEffect, useRef } from "react";

export interface StarfieldProps {
  /** stars per parallax layer */
  density?: number;
  /** number of parallax layers (back → front) */
  layers?: number;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  r: number;
  base: number; // base brightness 0..1
  twPhase: number; // twinkle phase
  twSpeed: number;
  vy: number; // drift speed
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

const LAYER_TINTS = ["#cfd6ff", "#dbe6ff", "#ffffff"];

export function Starfield({ density = 120, layers = 3, className }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let starLayers: Star[][] = [];
    let shooting: Shooting[] = [];
    let raf = 0;
    let lastSpawn = 0;
    let running = true;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      starLayers = Array.from({ length: layers }, (_, li) => {
        const depth = (li + 1) / layers; // 0..1, front = 1
        return Array.from({ length: Math.round(density * (0.6 + depth)) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: rand(0.3, 1.2) * (0.5 + depth),
          base: rand(0.2, 0.9) * (0.4 + depth * 0.6),
          twPhase: Math.random() * Math.PI * 2,
          twSpeed: rand(0.6, 2.2),
          vy: (0.02 + depth * 0.06) * (reduced ? 0 : 1),
        }));
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      starLayers.forEach((layer, li) => {
        ctx!.fillStyle = LAYER_TINTS[li % LAYER_TINTS.length];
        for (const s of layer) {
          ctx!.globalAlpha = s.base;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx!.fill();
        }
      });
      ctx!.globalAlpha = 1;
    }

    function maybeSpawnShooting(t: number) {
      if (t - lastSpawn < rand(8000, 16000)) return;
      lastSpawn = t;
      const fromLeft = Math.random() > 0.5;
      const speed = rand(6, 10);
      shooting.push({
        x: fromLeft ? rand(0, width * 0.3) : rand(width * 0.7, width),
        y: rand(0, height * 0.4),
        vx: (fromLeft ? 1 : -1) * speed,
        vy: speed * rand(0.35, 0.6),
        life: 0,
        max: rand(40, 70),
      });
    }

    function frame(t: number) {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      starLayers.forEach((layer, li) => {
        const tint = LAYER_TINTS[li % LAYER_TINTS.length];
        ctx!.fillStyle = tint;
        for (const s of layer) {
          const tw = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twSpeed + s.twPhase);
          ctx!.globalAlpha = Math.min(1, s.base * (0.55 + 0.45 * tw));
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx!.fill();
          s.y += s.vy;
          if (s.y > height + 2) {
            s.y = -2;
            s.x = Math.random() * width;
          }
        }
      });
      ctx!.globalAlpha = 1;

      maybeSpawnShooting(t);
      shooting = shooting.filter((sh) => sh.life < sh.max);
      for (const sh of shooting) {
        sh.life += 1;
        sh.x += sh.vx;
        sh.y += sh.vy;
        const fade = 1 - sh.life / sh.max;
        const tailX = sh.x - sh.vx * 6;
        const tailY = sh.y - sh.vy * 6;
        const grad = ctx!.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.6;
        ctx!.beginPath();
        ctx!.moveTo(sh.x, sh.y);
        ctx!.lineTo(tailX, tailY);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [density, layers]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -2,
        pointerEvents: "none",
      }}
    />
  );
}
