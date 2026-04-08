"use client";

import { useEffect, useRef } from "react";
import { useIsLowPower, usePageVisibility } from "@/hooks/usePageVisibility";

const PARTICLE_COUNT = 15;
const CONNECTION_DIST_SQ = 6400; // 80px²

export default function ParticleBackground({ isPlaying }: { isPlaying: boolean }) {
  const lowPower = useIsLowPower();
  const hidden = usePageVisibility();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ isPlaying, hidden: false });

  useEffect(() => { stateRef.current.isPlaying = isPlaying; }, [isPlaying]);
  useEffect(() => { stateRef.current.hidden = hidden; }, [hidden]);

  // 모바일이면 렌더 자체를 건너뜀
  if (lowPower) return null;

  return <DesktopCanvas canvasRef={canvasRef} rafRef={rafRef} stateRef={stateRef} />;
}

function DesktopCanvas({ canvasRef, rafRef, stateRef }: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  rafRef: React.MutableRefObject<number>;
  stateRef: React.MutableRefObject<{ isPlaying: boolean; hidden: boolean }>;
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 파티클 초기화 (색상 pre-compute)
    const pts = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    let frameCount = 0;

    const draw = () => {
      const { isPlaying, hidden } = stateRef.current;

      // 탭 숨김 시 완전 정지
      if (hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const speed = isPlaying ? 0.8 : 0.2;

      // 파티클 이동 + 그리기 (단색 배치 path)
      ctx.beginPath();
      for (const p of pts) {
        p.x = (p.x + p.vx * speed + canvas.width) % canvas.width;
        p.y = (p.y + p.vy * speed + canvas.height) % canvas.height;
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
      }
      ctx.fillStyle = "rgba(130, 110, 220, 0.45)";
      ctx.fill();

      // 연결선: 재생 중 + 6프레임마다
      if (isPlaying && frameCount % 6 === 0) {
        ctx.beginPath();
        for (let i = 0; i < pts.length - 1; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            if (dx * dx + dy * dy < CONNECTION_DIST_SQ) {
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
            }
          }
        }
        ctx.strokeStyle = "rgba(79, 70, 229, 0.06)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      frameCount = (frameCount + 1) % 60;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [canvasRef, rafRef, stateRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.45 }}
    />
  );
}
