"use client";

import { useEffect, useRef } from "react";

interface EqVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export default function EqVisualizer({ isPlaying, barCount = 24 }: EqVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ isPlaying, heights: new Float32Array(barCount) });
  const animFrameRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
    if (!isPlaying) {
      stateRef.current.heights.fill(10);
    }
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const barW = (W - (barCount - 1) * 2) / barCount;

    // 그라데이션 한 번만 생성
    const grad = ctx.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0, "rgba(79, 70, 229, 0.6)");
    grad.addColorStop(1, "rgba(6, 182, 212, 0.9)");
    const gradIdle = ctx.createLinearGradient(0, H, 0, 0);
    gradIdle.addColorStop(0, "rgba(255,255,255,0.05)");
    gradIdle.addColorStop(1, "rgba(255,255,255,0.1)");

    const TICK_INTERVAL = 120; // 80ms → 120ms (33% 부하 감소)

    const draw = (now: number) => {
      const { isPlaying, heights } = stateRef.current;

      // 높이 업데이트는 120ms마다만
      if (isPlaying && now - lastTickRef.current > TICK_INTERVAL) {
        lastTickRef.current = now;
        for (let i = 0; i < barCount; i++) {
          const base = Math.sin(now / 400 + i * 0.5) * 18 + 28;
          const rnd = Math.random() * 25;
          heights[i] = Math.max(5, Math.min(100, base + rnd));
        }
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = isPlaying ? grad : gradIdle;

      for (let i = 0; i < barCount; i++) {
        const h = (heights[i] / 100) * H;
        const x = i * (barW + 2);
        ctx.fillRect(x, H - h, barW, h);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [barCount]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16"
      style={{ display: "block" }}
    />
  );
}
