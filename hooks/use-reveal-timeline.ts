'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { revealConfig } from '@/reveal.config';

export function useRevealTimeline() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const syncTime = useCallback(() => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (!audioRef.current.paused) frameRef.current = requestAnimationFrame(syncTime);
  }, []);
  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);
  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setAudioError(false); await audio.play(); setStarted(true); setPaused(false);
      frameRef.current = requestAnimationFrame(syncTime);
    } catch { setAudioError(true); }
  }, [syncTime]);
  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { await audio.play(); setPaused(false); frameRef.current = requestAnimationFrame(syncTime); }
    else { audio.pause(); setPaused(true); if (frameRef.current) cancelAnimationFrame(frameRef.current); }
  }, [syncTime]);
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, revealConfig.audioDuration - 0.1));
    setCurrentTime(audioRef.current.currentTime); setEnded(false);
  }, []);
  const stageIndex = useMemo(() => {
    let active = 0;
    revealConfig.timeline.forEach((item, index) => { if (currentTime >= item.start) active = index; });
    return active;
  }, [currentTime]);
  const stage = revealConfig.timeline[stageIndex];
  return {
    audioRef, currentTime, started, paused, ended, audioError, stage,
    progress: Math.min(100, (currentTime / revealConfig.audioDuration) * 100),
    start, togglePlayback, seek,
    nextStage: () => seek(revealConfig.timeline[Math.min(stageIndex + 1, revealConfig.timeline.length - 1)].start),
    previousStage: () => seek(revealConfig.timeline[Math.max(stageIndex - 1, 0)].start),
    onEnded: () => { setEnded(true); setPaused(true); setCurrentTime(revealConfig.audioDuration); },
  };
}
