"use client";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useRadioPlayer } from "@/hooks/useRadioPlayer";
import { useBroadcastInfo } from "@/hooks/useBroadcastInfo";
import { useScheduledPlay } from "@/hooks/useScheduledPlay";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import VinylRecord from "@/components/VinylRecord";
import EqVisualizer from "@/components/EqVisualizer";
import PlayerControls from "@/components/PlayerControls";
import BroadcastInfoPanel from "@/components/BroadcastInfo";
import SchedulePanel from "@/components/SchedulePanel";

// 데스크탑 전용 — 모바일에서 자동 null 반환
const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false });

export default function Home() {
  const radio = useRadioPlayer();
  const broadcastInfo = useBroadcastInfo();
  const pageHidden = usePageVisibility();
  const { schedules, addSchedule, removeSchedule, toggleSchedule } =
    useScheduledPlay(radio.play, radio.stop);

  const isPlaying = radio.playerState === "playing";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground isPlaying={isPlaying} />

      {/* 배경 — static gradient (애니메이션 없음) */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#050510] via-[#0a0520] to-[#050510]" />

      {/* 재생 중 앰비언트 글로우 — opacity CSS transition만 */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(79,70,229,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(6,182,212,0.08) 0%, transparent 60%)",
          opacity: isPlaying ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 헤더 */}
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-xs font-black">M</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">MBC 표준FM</h1>
              <p className="text-xs text-gray-500">Seoul 95.9 MHz</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="text-indigo-400" />
            <span>Australia</span>
          </div>
        </header>

        {/* 메인 */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md space-y-6">

            {/* 타이틀 + 바이닐 + EQ */}
            <div className="text-center">
              <h2
                className="text-3xl font-black gradient-text mb-1"
                style={{ opacity: pageHidden ? 0.5 : 1, transition: "opacity 0.5s" }}
              >
                표준FM
              </h2>
              <p className="text-xs text-gray-500 tracking-widest uppercase mb-6">
                Live from Seoul, Korea
              </p>
              <VinylRecord isPlaying={isPlaying} />
              <div className="mt-4">
                <EqVisualizer isPlaying={isPlaying} />
              </div>
            </div>

            {/* 플레이어 컨트롤 */}
            <div className="glass-strong rounded-3xl p-6">
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
            </div>

            {/* 방송 정보 */}
            <BroadcastInfoPanel info={broadcastInfo} isPlaying={isPlaying} />

            {/* 예약 */}
            <SchedulePanel
              schedules={schedules}
              onAdd={addSchedule}
              onRemove={removeSchedule}
              onToggle={toggleSchedule}
            />

            <p className="text-center text-xs text-gray-600">
              탭 최소화 시 모든 애니메이션 정지 · 오디오만 재생
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
