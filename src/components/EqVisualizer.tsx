"use client";

// JS 루프 없음 — 순수 CSS 애니메이션 (GPU transform만 사용)
const BAR_COUNT = 16;
const DURATIONS = [0.6, 0.8, 0.5, 0.9, 0.7, 1.0, 0.6, 0.75, 0.55, 0.85, 0.65, 0.95, 0.7, 0.8, 0.6, 0.9];

export default function EqVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-12 px-2" aria-hidden="true">
      {DURATIONS.map((dur, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm eq-css-bar"
          style={{
            animationDuration: `${dur}s`,
            animationDelay: `${(i * 0.07) % 0.5}s`,
            animationPlayState: isPlaying ? "running" : "paused",
            background: "linear-gradient(to top, rgba(79,70,229,0.7), rgba(6,182,212,0.9))",
            height: isPlaying ? undefined : "4px",
            opacity: isPlaying ? 1 : 0.3,
            transition: "opacity 0.4s, height 0.4s",
          }}
        />
      ))}
    </div>
  );
}
