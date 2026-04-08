"use client";

import { motion } from "framer-motion";

interface VinylRecordProps {
  isPlaying: boolean;
}

export default function VinylRecord({ isPlaying }: VinylRecordProps) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Glow ring — opacity만 변경 (boxShadow 애니메이션 제거, GPU 가속) */}
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-700"
        style={{
          boxShadow: "0 0 40px rgba(79,70,229,0.4), 0 0 80px rgba(79,70,229,0.2)",
          opacity: isPlaying ? 1 : 0.3,
        }}
      />

      {/* Vinyl disc */}
      <motion.div
        className="vinyl-record w-full h-full relative overflow-hidden"
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isPlaying
            ? { duration: 4, repeat: Infinity, ease: "linear" }
            : { duration: 0.5 }
        }
      >
        {/* MBC Logo center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg tracking-widest">MBC</span>
          </div>
        </div>

        {/* Grooves */}
        {[85, 95, 105, 115, 125].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid ${i % 2 === 0 ? "rgba(79,70,229,0.15)" : "rgba(6,182,212,0.15)"}`,
            }}
          />
        ))}
      </motion.div>

      {/* Tonearm */}
      <motion.div
        className="absolute"
        style={{ top: "10%", right: "5%", transformOrigin: "top right" }}
        animate={isPlaying ? { rotate: 25 } : { rotate: 15 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="w-1 h-20 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400" />
        </div>
      </motion.div>

      {/* Sound wave rings — CSS animation으로 대체 (Framer Motion 3개 → CSS 2개) */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full border border-indigo-400 wave-ring" style={{ animationDelay: "0s" }} />
          <div className="absolute inset-0 rounded-full border border-indigo-400 wave-ring" style={{ animationDelay: "0.7s" }} />
        </>
      )}
    </div>
  );
}
