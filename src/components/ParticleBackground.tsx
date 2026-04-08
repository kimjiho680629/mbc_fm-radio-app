"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  r: number;
  g: number;
  b: number;
}

interface ParticleBackgroundProps {
  isPlaying: boolean;
}

const PARTICLE_COUNT = 25; // 60 → 25 (58% 감소)

export default function ParticleBackground({ isPlaying }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ isPlaying, frameCount: 0 });
  const animFrameRef = useRef<number>(0);

  // isPlaying 변경 시 canvas re-init 없이 ref만 업데이트
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // 파티클 색상 미리 계산 (매 프레임 문자열 생성 제거)
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const hue = Math.random() * 60 + 220;
      const rad = (hue * Math.PI) / 180;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        // RGB 미리 계산 (hsl → rgb 변환 생략, 근사값)
        r: Math.round(100 + Math.cos(rad) * 80),
        g: Math.round(80 + Math.sin(rad) * 60),
        b: Math.round(200 + Math.sin(rad * 2) * 55),
      };
    });

    const animate = () => {
      const { isPlaying, frameCount } = stateRef.current;
      stateRef.current.frameCount = frameCount + 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const speed = isPlaying ? 1.2 : 0.3;

      // 파티클 그리기 (한 번에 path batch)
      ctx.beginPath();
      particles.forEach((p) => {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      });
      // fillStyle 한 번만 설정 (개별 설정 제거)
      ctx.fillStyle = "rgba(140, 120, 220, 0.5)";
      ctx.fill();

      // 연결선: 4프레임마다 한 번만 계산 (O(n²) 빈도 75% 감소)
      if (isPlaying && frameCount % 4 === 0) {
        ctx.beginPath(); // 모든 선을 하나의 path에 배칭
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy; // sqrt 생략
            if (distSq < 8000) { // 100² = 10000 → 90² = 8100
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
            }
          }
        }
        ctx.strokeStyle = "rgba(79, 70, 229, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke(); // stroke 1번만 호출
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []); // 의존성 배열 비움 — isPlaying은 ref로 처리

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
