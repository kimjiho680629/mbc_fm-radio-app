"use client";

import { Radio, Clock, User } from "lucide-react";
import type { BroadcastInfo } from "@/hooks/useBroadcastInfo";

// Framer Motion 없음 — CSS transition만 사용
export default function BroadcastInfoPanel({ info, isPlaying }: { info: BroadcastInfo; isPlaying: boolean }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      {/* Live badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full bg-red-500"
            style={{ animation: isPlaying ? "pulse 1.5s ease-in-out infinite" : "none" }}
          />
          <span className="text-xs font-bold text-red-400 tracking-widest uppercase">
            {info.isLive ? "LIVE" : "OFF AIR"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Radio size={12} />
          <span>MBC 표준FM 95.9MHz</span>
        </div>
      </div>

      {/* 프로그램명 */}
      <h2 className="text-lg font-bold text-white leading-tight">{info.programName}</h2>

      {/* DJ / 시각 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-gray-400">
          <User size={13} />
          <span>{info.djName || "–"}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Clock size={12} />
          <span>{info.broadcastTime}</span>
        </div>
      </div>
    </div>
  );
}
