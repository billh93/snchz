"use client";

import { useCallback, useRef, useState } from "react";

export function useStartupSound() {
  const audioCtx = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);

  const play = useCallback(() => {
    if (!enabled) return;
    try {
      if (!audioCtx.current) {
        audioCtx.current = new AudioContext();
      }
      const ctx = audioCtx.current;
      const now = ctx.currentTime;

      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.7);
      });
    } catch {
      // Web Audio not available
    }
  }, [enabled]);

  return { play, enabled, setEnabled };
}
