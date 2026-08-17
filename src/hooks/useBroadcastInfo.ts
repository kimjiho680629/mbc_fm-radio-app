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

// MBC 표준FM (서울 95.9MHz, AM 900kHz) 실제 24시간 편성표 (KST 기준)
interface ProgramSchedule {
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  name: string;
  dj: string;
  isWeekendOnly?: boolean;
  isWeekdayOnly?: boolean;
}

const SCHEDULE: ProgramSchedule[] = [
  { startHour: 0, startMin: 0, endHour: 2, endMin: 0, name: "서인의 심야다방", dj: "서인" },
  { startHour: 2, startMin: 0, endHour: 3, endMin: 0, name: "K-POP 투데이", dj: "MBC 아나운서" },
  { startHour: 3, startMin: 0, endHour: 4, endMin: 55, name: "MBC 낭만가요", dj: "음악 DJ" },
  { startHour: 4, startMin: 55, endHour: 5, endMin: 0, name: "애국가 및 방송개시", dj: "MBC 라디오" },
  { startHour: 5, startMin: 0, endHour: 6, endMin: 0, name: "건강한 아침 이진입니다", dj: "이진" },
  { startHour: 6, startMin: 0, endHour: 7, endMin: 0, name: "아침 & 뉴스 류수민입니다", dj: "류수민" },
  
  // 아침 시사/경제 라인업
  { startHour: 7, startMin: 5, endHour: 8, endMin: 30, name: "김종배의 시선집중", dj: "김종배", isWeekdayOnly: true },
  { startHour: 7, startMin: 5, endHour: 8, endMin: 0, name: "김종배의 시선집중 (토/일)", dj: "김종배", isWeekendOnly: true },
  { startHour: 8, startMin: 0, endHour: 9, endMin: 0, name: "이진우의 손에 잡히는 경제 (주말)", dj: "이진우", isWeekendOnly: true },
  { startHour: 8, startMin: 30, endHour: 9, endMin: 0, name: "이진우의 손에 잡히는 경제", dj: "이진우", isWeekdayOnly: true },
  
  // 오전 교양/음악 라인업
  { startHour: 9, startMin: 5, endHour: 11, endMin: 0, name: "여성시대 양희은·김일중입니다", dj: "양희은 · 김일중" },
  { startHour: 11, startMin: 5, endHour: 12, endMin: 0, name: "박정호의 손에 잡히는 경제 플러스", dj: "박정호" },
  { startHour: 12, startMin: 0, endHour: 12, endMin: 20, name: "MBC 정오종합뉴스", dj: "보도국 아나운서" },
  
  // 오후 예능/트로트/음악 라인업
  { startHour: 12, startMin: 20, endHour: 14, endMin: 0, name: "손태진의 트로트라디오", dj: "손태진" },
  { startHour: 14, startMin: 5, endHour: 16, endMin: 0, name: "박준형, 박영진의 2시만세", dj: "박준형 · 박영진" },
  { startHour: 16, startMin: 5, endHour: 18, endMin: 0, name: "정선희·문천식의 지금은 라디오시대", dj: "정선희 · 문천식" },
  
  // 저녁 시사/퇴근길 라인업
  { startHour: 18, startMin: 5, endHour: 20, endMin: 0, name: "권순표 / 조승원의 뉴스하이킥", dj: "조승원 (평일) · 김치형 (주말)" },
  { startHour: 20, startMin: 5, endHour: 21, endMin: 0, name: "원더풀 라디오 김현철입니다", dj: "김현철" },
  { startHour: 21, startMin: 5, endHour: 22, endMin: 0, name: "MBC 뉴스포커스 & 시사", dj: "보도국" },
  { startHour: 22, startMin: 5, endHour: 23, endMin: 0, name: "오늘도 당신 편 이재은입니다", dj: "이재은" },
  { startHour: 23, startMin: 5, endHour: 24, endMin: 0, name: "신혜림의 골든디스크", dj: "신혜림" },
];

function toMinutes(hour: number, min: number): number {
  return hour * 60 + min;
}

export function useBroadcastInfo() {
  const [info, setInfo] = useState<BroadcastInfo>({
    programName: "MBC 표준FM (95.9MHz)",
    djName: "실시간 라이브",
    broadcastTime: "",
    currentTime: "",
    isLive: true,
    listeners: undefined,
  });

  const getCurrentProgram = useCallback(() => {
    const now = new Date();
    // KST: UTC + 9시간
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const kstDay = kstDate.getUTCDay(); // 0: 일요일, 6: 토요일
    const isWeekend = kstDay === 0 || kstDay === 6;

    const currentKstMinutes = kstDate.getUTCHours() * 60 + kstDate.getUTCMinutes();

    // 현재 시간에 맞는 프로그램 정밀 탐색
    let matched = SCHEDULE.find((p) => {
      if (p.isWeekdayOnly && isWeekend) return false;
      if (p.isWeekendOnly && !isWeekend) return false;

      const start = toMinutes(p.startHour, p.startMin);
      const end = toMinutes(p.endHour, p.endMin);
      return currentKstMinutes >= start && currentKstMinutes < end;
    });

    // 정각 5분 뉴스 또는 매칭 누락 시 기본값 처리
    if (!matched) {
      // 5분 뉴스 시간대 (예: 09:00 ~ 09:05 등)
      if (currentKstMinutes % 60 < 5 && kstDate.getUTCHours() >= 6 && kstDate.getUTCHours() <= 23) {
        matched = {
          startHour: kstDate.getUTCHours(),
          startMin: 0,
          endHour: kstDate.getUTCHours(),
          endMin: 5,
          name: "MBC 5분 뉴스",
          dj: "MBC 보도국",
        };
      } else {
        matched = SCHEDULE[0];
      }
    }

    const timeStr = kstDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

    // AEST: UTC + 10시간
    const aestDate = new Date(now.getTime() + (10 * 60 * 60 * 1000));
    const aestTimeStr = aestDate.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });

    setInfo({
      programName: matched.name,
      djName: matched.dj,
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
