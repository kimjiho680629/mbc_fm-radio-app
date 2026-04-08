"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { useBroadcastInfo } from "@/hooks/useBroadcastInfo";
import { useScheduledPlay } from "@/hooks/useScheduledPlay";
import VinylRecord from "@/components/VinylRecord";
import EqVisualizer from "@/components/EqVisualizer";
import PlayerControls from "@/components/PlayerControls";
import BroadcastInfoPanel from "@/components/BroadcastInfo";
import SchedulePanel from "@/components/SchedulePanel";

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), {
  ssr: false,
});

export default function Home() {
  const radio = useRadioPlayer();
  const broadcastInfo = useBroadcastInfo();
  const { schedules, addSchedule, removeSchedule, toggleSchedule } =
    useScheduledPlay(radio.play, radio.stop);

  const isPlaying = radio.playerState === "playing";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated particle background */}
      <ParticleBackground isPlaying={isPlaying} />

      {/* Background gradient overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0520] to-[#050510]" />

        {/* Ambient glow based on play state */}
        <motion.div
          className="absolute inset-0"
          animate={
            isPlaying
              ? {
                  background: [
                    "radial-gradient(ellipse at 20% 50%, rgba(79,70,229,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(6,182,212,0.1) 0%, transparent 60%)",
                    "radial-gradient(ellipse at 50% 20%, rgba(79,70,229,0.15) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.1) 0%, transparent 60%)",
                  ],
                }
              : {
                  background:
                    "radial-gradient(ellipse at 50% 50%, rgba(79,70,229,0.05) 0%, transparent 70%)",
                }
          }
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-xs font-black">M</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">MBC 표준FM</h1>
              <p className="text-xs text-gray-500">Seoul 95.9 MHz</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            <MapPin size={12} className="text-indigo-400" />
            <span>Australia</span>
          </motion.div>
        </header>

        {/* Main content area */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md space-y-6">

            {/* Vinyl + EQ section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Title above vinyl */}
              <div className="text-center mb-6">
                <motion.h2
                  className="text-3xl font-black gradient-text mb-1"
                  animate={
                    isPlaying
                      ? { textShadow: ["0 0 20px rgba(79,70,229,0.5)", "0 0 40px rgba(79,70,229,0.8)", "0 0 20px rgba(79,70,229,0.5)"] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  표준FM
                </motion.h2>
                <p className="text-xs text-gray-500 tracking-widest uppercase">
                  Live from Seoul, Korea
                </p>
              </div>

              {/* Vinyl record */}
              <VinylRecord isPlaying={isPlaying} />

              {/* EQ visualizer below vinyl */}
              <div className="mt-4">
                <EqVisualizer isPlaying={isPlaying} barCount={40} />
              </div>
            </motion.div>

            {/* Player controls card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-3xl p-6"
            >
              <PlayerControls
                playerState={radio.playerState}
                volume={radio.volume}
                isMuted={radio.isMuted}
                error={radio.error}
                retryCount={radio.retryCount}
                onTogglePlay={radio.togglePlay}
                onStop={radio.stop}
                onVolumeChange={radio.setVolume}
                onToggleMute={radio.toggleMute}
                onRetry={radio.play}
              />
            </motion.div>

            {/* Broadcast info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BroadcastInfoPanel info={broadcastInfo} isPlaying={isPlaying} />
            </motion.div>

            {/* Schedule panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SchedulePanel
                schedules={schedules}
                onAdd={addSchedule}
                onRemove={removeSchedule}
                onToggle={toggleSchedule}
              />
            </motion.div>

            {/* Footer tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-xs text-gray-600"
            >
              브라우저 탭을 최소화해도 계속 재생됩니다 ·
              AEST 기준 예약 청취 지원
            </motion.p>
          </div>
        </main>
      </div>
    </div>
  );
}
