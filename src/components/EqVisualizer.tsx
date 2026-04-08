"use client";

import { useEffect, useState } from "react";

interface EqVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export default function EqVisualizer({ isPlaying, barCount = 32 }: EqVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(
    Array.from({ length: barCount }, () => Math.random() * 30 + 10)
  );

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array.from({ length: barCount }, () => 10));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Create a more musical-looking pattern
          const base = Math.sin(Date.now() / 300 + i * 0.5) * 20 + 30;
          const random = Math.random() * 30;
          return Math.max(5, Math.min(100, base + random));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-end gap-[2px] h-16 px-2">
      {heights.map((height, i) => (
        <div
          key={i}
          className="waveform-bar flex-1"
          style={{
            height: `${height}%`,
            transition: isPlaying ? "height 0.08s ease" : "height 0.3s ease",
            background: isPlaying
              ? `linear-gradient(to top,
                  rgba(79, 70, 229, ${0.4 + (i / barCount) * 0.4}),
                  rgba(6, 182, 212, ${0.6 + (i / barCount) * 0.4})
                )`
              : "rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  );
}
