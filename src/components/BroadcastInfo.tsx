"use client";

import { motion } from "framer-motion";
import { Radio, Clock, User } from "lucide-react";
import type { BroadcastInfo } from "@/hooks/useBroadcastInfo";

interface BroadcastInfoProps {
  info: BroadcastInfo;
  isPlaying: boolean;
}

export default function BroadcastInfoPanel({ info, isPlaying }: BroadcastInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5 space-y-3"
    >
      {/* Live badge + Station */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={
              isPlaying
                ? { scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }
                : { scale: 1, opacity: 0.5 }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full bg-red-500"
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

      {/* Program name */}
      <div>
        <motion.h2
          key={info.programName}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-bold text-white leading-tight"
        >
          {info.programName}
        </motion.h2>
      </div>

      {/* DJ & Time */}
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

      {/* Scrolling text ticker */}
      <div className="overflow-hidden border-t border-white/5 pt-3">
        <motion.div
          animate={{ x: [300, -600] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-xs text-gray-500"
        >
          🎵 지금 방송 중 &nbsp;|&nbsp; MBC 표준FM &nbsp;|&nbsp; 서울 95.9MHz &nbsp;|&nbsp;
          호주 전역에서 스트리밍 중 &nbsp;|&nbsp; {info.programName} &nbsp;|&nbsp;
          진행: {info.djName} &nbsp;|&nbsp; {info.broadcastTime} &nbsp;|&nbsp;
          🎵 지금 방송 중 &nbsp;|&nbsp; MBC 표준FM
        </motion.div>
      </div>
    </motion.div>
  );
}
