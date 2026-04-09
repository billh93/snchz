"use client";

import { useEffect, useRef, useCallback } from "react";

// Simplex-inspired noise, compact 2D implementation
function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  return (x: number, y: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);

    const aa = perm[perm[xi] + yi] & 7;
    const ab = perm[perm[xi] + yi + 1] & 7;
    const ba = perm[perm[xi + 1] + yi] & 7;
    const bb = perm[perm[xi + 1] + yi + 1] & 7;

    const dot = (g: number[], fx: number, fy: number) =>
      g[0] * fx + g[1] * fy;

    const x1 =
      dot(grad[aa], xf, yf) * (1 - u) + dot(grad[ba], xf - 1, yf) * u;
    const x2 =
      dot(grad[ab], xf, yf - 1) * (1 - u) +
      dot(grad[bb], xf - 1, yf - 1) * u;

    return x1 * (1 - v) + x2 * v;
  };
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
};

const PARTICLE_COUNT = 1500;
const NOISE_SCALE = 0.003;
const NOISE_SPEED = 0.0003;
const FLOW_STRENGTH = 1.2;
const CURSOR_RADIUS = 150;
const CURSOR_FORCE = 3;
const FRICTION = 0.97;
const GOLDEN_RATIO = 0.08;

export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const noiseRef = useRef(createNoise());
  const timeRef = useRef(0);
  const prefersReducedMotion = useRef(false);

  const createParticle = useCallback(
    (w: number, h: number): Particle => {
      const isGolden = Math.random() < GOLDEN_RATIO;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 200 + Math.random() * 300,
        hue: isGolden ? 85 : 275,
        size: isGolden ? 1.5 + Math.random() : 0.8 + Math.random() * 0.8,
      };
    },
    []
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mql.matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const noise = noiseRef.current;

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(w, h)
    );

    if (prefersReducedMotion.current) {
      ctx.fillStyle = "oklch(0.13 0.025 275)";
      ctx.fillRect(0, 0, w, h);

      const gradient = ctx.createRadialGradient(
        w * 0.3,
        h * 0.4,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.6
      );
      gradient.addColorStop(0, "oklch(0.20 0.04 275 / 0.4)");
      gradient.addColorStop(0.5, "oklch(0.15 0.025 275 / 0.2)");
      gradient.addColorStop(1, "oklch(0.13 0.025 275 / 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const animate = () => {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      timeRef.current += NOISE_SPEED;

      ctx.fillStyle = "oklch(0.13 0.025 275 / 0.08)";
      ctx.fillRect(0, 0, cw, ch);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        if (p.life > p.maxLife || p.x < -20 || p.x > cw + 20 || p.y < -20 || p.y > ch + 20) {
          Object.assign(p, createParticle(cw, ch));
          p.life = 0;
          continue;
        }

        const n = noise(
          p.x * NOISE_SCALE,
          p.y * NOISE_SCALE + timeRef.current
        );
        const angle = n * Math.PI * 4;

        p.vx += Math.cos(angle) * FLOW_STRENGTH * 0.1;
        p.vy += Math.sin(angle) * FLOW_STRENGTH * 0.1;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        const lifePct = p.life / p.maxLife;
        const fade = lifePct < 0.1
          ? lifePct / 0.1
          : lifePct > 0.8
            ? 1 - (lifePct - 0.8) / 0.2
            : 1;

        const isGolden = p.hue === 85;
        const lightness = isGolden ? 0.78 : 0.45 + Math.random() * 0.15;
        const chroma = isGolden ? 0.15 : 0.03;
        const alpha = fade * (isGolden ? 0.7 : 0.35);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(${lightness} ${chroma} ${p.hue} / ${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
