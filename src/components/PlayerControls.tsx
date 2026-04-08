"use client";

import { motion } from "framer-motion";
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
  playerState,
  volume,
  isMuted,
  error,
  retryCount,
  onTogglePlay,
  onStop,
  onVolumeChange,
  onToggleMute,
  onRetry,
}: PlayerControlsProps) {
  const isPlaying = playerState === "playing";
  const isLoading = playerState === "loading";
  const isError = playerState === "error";

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex flex-col gap-4">
      {/* Error/Status message */}
      {(error || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm py-2 px-4 rounded-full ${
            isError
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          }`}
        >
          {isLoading && !error && (
            <span className="inline-flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={14} />
              </motion.span>
              스트리밍 연결 중...
            </span>
          )}
          {error && error}
        </motion.div>
      )}

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Stop button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStop}
          disabled={playerState === "idle"}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Square size={16} />
        </motion.button>

        {/* Play/Pause button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isError ? onRetry : onTogglePlay}
          className="relative w-20 h-20 rounded-full btn-glow flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          ) : isError ? (
            <RefreshCw size={28} className="text-white" />
          ) : isPlaying ? (
            <Pause size={28} className="text-white" />
          ) : (
            <Play size={28} className="text-white ml-1" />
          )}

          {/* Pulse animation when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Retry count indicator */}
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
          {retryCount > 0 ? (
            <span className="text-xs text-yellow-400 font-bold">{retryCount}</span>
          ) : (
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-600"}`} />
          )}
        </div>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleMute}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <VolumeIcon size={18} />
        </motion.button>

        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full h-1"
            style={{
              background: `linear-gradient(to right,
                rgba(79,70,229,0.8) 0%,
                rgba(6,182,212,0.8) ${(isMuted ? 0 : volume) * 100}%,
                rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%,
                rgba(255,255,255,0.1) 100%
              )`,
            }}
          />
        </div>

        <span className="text-xs text-gray-500 w-8 text-right flex-shrink-0">
          {Math.round((isMuted ? 0 : volume) * 100)}
        </span>
      </div>
    </div>
  );
}
