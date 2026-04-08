"use client";

// Framer Motion 완전 제거 — CSS transition/animation만 사용
import { Play, Pause, Square, Volume2, VolumeX, Volume1, RefreshCw } from "lucide-react";
import type { PlayerState } from "@/hooks/useRadioPlayer";

interface PlayerControlsProps {
  playerState: PlayerState;
  volume: number;
  isMuted: boolean;
  error: string | null;
  retryCount: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onRetry: () => void;
}

export default function PlayerControls({
  playerState, volume, isMuted, error, retryCount,
  onTogglePlay, onStop, onVolumeChange, onToggleMute, onRetry,
}: PlayerControlsProps) {
  const isPlaying = playerState === "playing";
  const isLoading = playerState === "loading";
  const isError   = playerState === "error";
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const pct = (isMuted ? 0 : volume) * 100;

  return (
    <div className="flex flex-col gap-4">
      {/* 상태 메시지 */}
      {(error || isLoading) && (
        <div className={`text-center text-sm py-2 px-4 rounded-full fade-in ${
          isError
            ? "bg-red-500/20 text-red-300 border border-red-500/30"
            : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
        }`}>
          {isLoading && !error && (
            <span className="inline-flex items-center gap-2">
              <RefreshCw size={14} className="spin-css" />
              스트리밍 연결 중...
            </span>
          )}
          {error && error}
        </div>
      )}

      {/* 컨트롤 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onStop}
          disabled={playerState === "idle"}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-90"
        >
          <Square size={16} />
        </button>

        {/* 재생 버튼 */}
        <button
          onClick={isError ? onRetry : onTogglePlay}
          className="relative w-20 h-20 rounded-full btn-glow flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)" }}
        >
          {isLoading
            ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full spin-css" />
            : isError
              ? <RefreshCw size={28} className="text-white" />
              : isPlaying
                ? <Pause size={28} className="text-white" />
                : <Play  size={28} className="text-white ml-1" />
          }
          {/* 재생 중 링 — CSS only */}
          {isPlaying && <div className="absolute inset-0 rounded-full border-2 border-indigo-400 wave-ring" />}
        </button>

        {/* 재시도 / 상태 표시 */}
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
          {retryCount > 0
            ? <span className="text-xs text-yellow-400 font-bold">{retryCount}</span>
            : <div className={`w-2 h-2 rounded-full transition-colors ${isPlaying ? "bg-green-400" : "bg-gray-600"}`} />
          }
        </div>
      </div>

      {/* 볼륨 */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0 active:scale-90"
        >
          <VolumeIcon size={18} />
        </button>
        <div className="flex-1">
          <input
            type="range" min={0} max={1} step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1"
            style={{
              background: `linear-gradient(to right, rgba(79,70,229,0.8) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
            }}
          />
        </div>
        <span className="text-xs text-gray-500 w-8 text-right flex-shrink-0">
          {Math.round(pct)}
        </span>
      </div>
    </div>
  );
}
