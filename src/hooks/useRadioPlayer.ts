"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type PlayerState = "idle" | "loading" | "playing" | "paused" | "error";

// MBC 표준FM: /api/stream?mode=url 로 동적 HLS URL 획득 후 재생
async function fetchStreamUrl(): Promise<string> {
  try {
    const res = await fetch("/api/stream?mode=url");
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    if (data.url) return data.url;
  } catch {
    // fallback: 직접 시도
  }
  return "https://sminiplay.imbc.com/aacplay.ashx?channel=sfm&agent=webapp&cmp=m";
}

export interface RadioPlayerState {
  playerState: PlayerState;
  volume: number;
  isMuted: boolean;
  error: string | null;
  retryCount: number;
}

export function useRadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<InstanceType<typeof import("hls.js")["default"]> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<RadioPlayerState>({
    playerState: "idle",
    volume: 0.8,
    isMuted: false,
    error: null,
    retryCount: 0,
  });

  const updateState = useCallback((updates: Partial<RadioPlayerState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setupMediaSession = useCallback(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: "MBC 표준FM",
      artist: "MBC Radio",
      album: "라이브 방송",
      artwork: [
        { src: "/icons/mbc-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/mbc-512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      stop();
    });
  }, []);

  const initHls = useCallback(
    async (audio: HTMLAudioElement, url: string) => {
      const Hls = (await import("hls.js")).default;

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          liveDurationInfinity: true,
        });

        hls.loadSource(url);
        hls.attachMedia(audio);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play().catch(() => {
            updateState({ playerState: "error", error: "재생을 시작하려면 클릭하세요" });
          });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                handleStreamError();
                break;
            }
          }
        });
      } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        audio.src = url;
        audio.play().catch(() => {
          updateState({ playerState: "error", error: "재생을 시작할 수 없습니다" });
        });
      } else {
        // Fallback: direct MP3 stream
        audio.src = url;
        audio.play().catch(handleStreamError);
      }
    },
    [updateState]
  );

  const handleStreamError = useCallback(() => {
    setState((prev) => {
      const newRetryCount = prev.retryCount + 1;

      if (newRetryCount <= 5) {
        const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 30000);
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);

        retryTimerRef.current = setTimeout(async () => {
          if (audioRef.current) {
            const url = await fetchStreamUrl();
            initHls(audioRef.current, url);
          }
        }, delay);

        return {
          ...prev,
          playerState: "loading",
          retryCount: newRetryCount,
          error: `재연결 중... (${newRetryCount}/5)`,
        };
      }

      return {
        ...prev,
        playerState: "error",
        retryCount: newRetryCount,
        error: "연결할 수 없습니다. 네트워크를 확인하세요.",
      };
    });
  }, [initHls]);

  const play = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.volume = state.volume;
      audio.muted = state.isMuted;

      audio.addEventListener("playing", () => {
        updateState({ playerState: "playing", error: null, retryCount: 0 });
        setupMediaSession();
      });

      audio.addEventListener("waiting", () => {
        updateState({ playerState: "loading" });
      });

      audio.addEventListener("pause", () => {
        if (state.playerState !== "idle") {
          updateState({ playerState: "paused" });
        }
      });

      audio.addEventListener("error", handleStreamError);

      audioRef.current = audio;
    }

    updateState({ playerState: "loading", error: null });
    const url = await fetchStreamUrl();
    await initHls(audioRef.current, url);
  }, [state.volume, state.isMuted, state.playerState, initHls, updateState, setupMediaSession, handleStreamError]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      updateState({ playerState: "paused" });
    }
  }, [updateState]);

  const stop = useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    updateState({ playerState: "idle", error: null, retryCount: 0 });
  }, [updateState]);

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(1, vol));
      if (audioRef.current) {
        audioRef.current.volume = clamped;
      }
      updateState({ volume: clamped });
    },
    [updateState]
  );

  const toggleMute = useCallback(() => {
    setState((prev) => {
      const newMuted = !prev.isMuted;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (state.playerState === "playing") {
      pause();
    } else if (state.playerState === "paused") {
      audioRef.current?.play();
      updateState({ playerState: "playing" });
    } else {
      play();
    }
  }, [state.playerState, play, pause, updateState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (hlsRef.current) hlsRef.current.destroy();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    stop,
    togglePlay,
    setVolume,
    toggleMute,
  };
}
