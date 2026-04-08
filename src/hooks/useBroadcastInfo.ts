"use client";

import { useState, useEffect, useCallback } from "react";

export interface BroadcastInfo {
  programName: string;
  djName: string;
  broadcastTime: string;
  currentTime: string;
  isLive: boolean;
  listeners?: number;
}

// MBC 표준FM 프로그램 편성표 (실제 방송 시간 기준, KST)
const SCHEDULE: Array<{ start: number; end: number; name: string; dj: string }> = [
  { start: 0, end: 2, name: "MBC 심야방송", dj: "심야 DJ", },
  { start: 2, end: 5, name: "MBC 새벽방송", dj: "새벽 DJ" },
  { start: 5, end: 7, name: "MBC 여명", dj: "방송국" },
  { start: 7, end: 9, name: "굿모닝 FM with 임백천", dj: "임백천" },
  { start: 9, end: 11, name: "FM 정류장", dj: "장기하" },
  { start: 11, end: 12, name: "이건 어때요", dj: "한상진" },
  { start: 12, end: 14, name: "정오의 희망곡 김신영입니다", dj: "김신영" },
  { start: 14, end: 16, name: "두시의 데이트 박준형입니다", dj: "박준형" },
  { start: 16, end: 18, name: "여성시대 양희은·서경석입니다", dj: "양희은·서경석" },
  { start: 18, end: 20, name: "배철수의 음악캠프", dj: "배철수" },
  { start: 20, end: 22, name: "FM 영화음악 차승원·이지연입니다", dj: "차승원·이지연" },
  { start: 22, end: 24, name: "별이 빛나는 밤에", dj: "박선영" },
];

export function useBroadcastInfo() {
  const [info, setInfo] = useState<BroadcastInfo>({
    programName: "MBC 표준FM",
    djName: "",
    broadcastTime: "",
    currentTime: "",
    isLive: true,
    listeners: undefined,
  });

  const getCurrentProgram = useCallback(() => {
    // 현재 KST 시간 계산 (호주 AEST는 UTC+10, KST는 UTC+9)
    const now = new Date();
    const kstHour = new Date(now.getTime() + (9 * 60 * 60 * 1000)).getUTCHours();

    const program = SCHEDULE.find(
      (p) => kstHour >= p.start && kstHour < p.end
    ) || SCHEDULE[0];

    const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const timeStr = kstTime.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const aestTime = new Date(now.getTime() + (10 * 60 * 60 * 1000));
    const aestTimeStr = aestTime.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setInfo({
      programName: program.name,
      djName: program.dj,
      broadcastTime: `KST ${timeStr} | AEST ${aestTimeStr}`,
      currentTime: timeStr,
      isLive: true,
    });
  }, []);

  useEffect(() => {
    getCurrentProgram();
    const interval = setInterval(getCurrentProgram, 10000);
    return () => clearInterval(interval);
  }, [getCurrentProgram]);

  return info;
}
