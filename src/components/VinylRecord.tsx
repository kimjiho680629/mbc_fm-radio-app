"use client";

import { motion } from "framer-motion";

interface VinylRecordProps {
  isPlaying: boolean;
}

export default function VinylRecord({ isPlaying }: VinylRecordProps) {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={
          isPlaying
            ? {
                boxShadow: [
                  "0 0 30px rgba(79,70,229,0.3), 0 0 60px rgba(79,70,229,0.1)",
                  "0 0 60px rgba(79,70,229,0.6), 0 0 100px rgba(79,70,229,0.3)",
                  "0 0 30px rgba(79,70,229,0.3), 0 0 60px rgba(79,70,229,0.1)",
                ],
              }
            : { boxShadow: "0 0 20px rgba(79,70,229,0.2)" }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vinyl disc */}
      <motion.div
        className="vinyl-record w-full h-full relative overflow-hidden"
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={
          isPlaying
            ? { duration: 3, repeat: Infinity, ease: "linear" }
            : { duration: 0.5 }
        }
      >
        {/* MBC Logo center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg tracking-widest">MBC</span>
          </div>
        </div>

        {/* Grooves with color bands */}
        {[85, 95, 105, 115, 125].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-opacity-10"
            style={{
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: i % 2 === 0
                ? "rgba(79,70,229,0.15)"
                : "rgba(6,182,212,0.15)",
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-glow" />
        </div>
      </motion.div>

      {/* Sound wave rings when playing */}
      {isPlaying && [1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-indigo-500"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
