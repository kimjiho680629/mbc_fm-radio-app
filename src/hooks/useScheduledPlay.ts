"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface Schedule {
  id: string;
  time: string; // HH:MM format (AEST)
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean;
  label: string;
}

export function useScheduledPlay(onPlay: () => void, onStop: () => void) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mbc-schedules");
    if (saved) {
      try {
        setSchedules(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("mbc-schedules", JSON.stringify(schedules));
  }, [schedules]);

  const checkSchedules = useCallback(() => {
    const now = new Date();
    const aestNow = new Date(now.getTime() + 10 * 60 * 60 * 1000);
    const currentHour = aestNow.getUTCHours();
    const currentMin = aestNow.getUTCMinutes();
    const currentDay = aestNow.getUTCDay();
    const currentSec = aestNow.getUTCSeconds();

    schedules.forEach((schedule) => {
      if (!schedule.enabled) return;
      if (!schedule.days.includes(currentDay)) return;

      const [h, m] = schedule.time.split(":").map(Number);
      if (h === currentHour && m === currentMin && currentSec < 5) {
        onPlay();
      }
    });
  }, [schedules, onPlay]);

  useEffect(() => {
    timerRef.current = setInterval(checkSchedules, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkSchedules]);

  const addSchedule = useCallback((schedule: Omit<Schedule, "id">) => {
    setSchedules((prev) => [
      ...prev,
      { ...schedule, id: Date.now().toString() },
    ]);
  }, []);

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const toggleSchedule = useCallback((id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }, []);

  return { schedules, addSchedule, removeSchedule, toggleSchedule };
}
