"use client";

import { useState, useEffect } from "react";

/** 탭이 숨겨지면 true — 모든 애니메이션 정지용 */
export function usePageVisibility() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onChange = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return hidden;
}

/** 모바일/저성능 기기 감지 */
export function useIsLowPower() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.innerWidth < 768;
    setLowPower(isMobile || prefersReduced || isSmallScreen);
  }, []);

  return lowPower;
}
