"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeatMatcherProps {
  bpm: number;
  totalBeats?: number;
  onComplete: (score: number) => void;
}

type Phase = "idle" | "countdown" | "playing" | "results";

interface TapResult {
  beatIndex: number;
  offsetMs: number;
  hit: boolean;
}

function scoreFromOffsetMs(ms: number): number {
  const abs = Math.abs(ms);
  if (abs <= 30) return 100;
  if (abs <= 60) return 85;
  if (abs <= 100) return 70;
  if (abs <= 150) return 50;
  return 0;
}

function gradeLabel(score: number): string {
  if (score >= 95) return "Perfect";
  if (score >= 80) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "OK";
  return "Keep Practicing";
}

function gradeColor(score: number): string {
  if (score >= 95) return "var(--brand-accent)";
  if (score >= 80) return "var(--brand-success)";
  if (score >= 60) return "#60a5fa";
  if (score >= 40) return "#fbbf24";
  return "#f87171";
}

// Synthesise a sharp metronome click at the given AudioContext time
function scheduleClick(ctx: AudioContext, time: number, accent: boolean) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = accent ? 1200 : 900;
  gain.gain.setValueAtTime(accent ? 0.6 : 0.35, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
  osc.start(time);
  osc.stop(time + 0.05);
}

export default function BeatMatcher({
  bpm,
  totalBeats = 16,
  onComplete,
}: BeatMatcherProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentBeat, setCurrentBeat] = useState(0);
  const [taps, setTaps] = useState<TapResult[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [lastTapFeedback, setLastTapFeedback] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const beatTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const tapsRef = useRef<TapResult[]>([]);
  const currentBeatRef = useRef(0);
  const phaseRef = useRef<Phase>("idle");
  const beatInterval = 60 / bpm;

  // Keep refs in sync
  useEffect(() => {
    tapsRef.current = taps;
  }, [taps]);
  useEffect(() => {
    currentBeatRef.current = currentBeat;
  }, [currentBeat]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const finishExercise = useCallback(
    (tapResults: TapResult[]) => {
      if (tapResults.length === 0) {
        setFinalScore(0);
        setPhase("results");
        return;
      }
      const avg =
        tapResults.reduce((sum, t) => sum + scoreFromOffsetMs(t.offsetMs), 0) /
        tapResults.length;
      const score = Math.round(avg);
      setFinalScore(score);
      setPhase("results");
      onComplete(score);
    },
    [onComplete]
  );

  const startExercise = useCallback(() => {
    if (typeof AudioContext === "undefined" && typeof (window as { webkitAudioContext?: unknown }).webkitAudioContext === "undefined") {
      setAudioError("Your browser does not support the Web Audio API. Try Chrome or Firefox.");
      return;
    }
    let ctx: AudioContext;
    try {
      const ACtx = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      ctx = new ACtx!();
    } catch {
      setAudioError("Audio could not be initialised. Please allow audio access and try again.");
      return;
    }
    setAudioError(null);
    audioCtxRef.current = ctx;
    tapsRef.current = [];
    setTaps([]);
    setCurrentBeat(0);
    setLastTapFeedback(null);

    // 3-beat countdown then exercise starts
    setCountdown(3);
    setPhase("countdown");

    const countdownStart = ctx.currentTime + 0.1;

    // Schedule countdown clicks (beats -3, -2, -1)
    for (let i = 0; i < 3; i++) {
      scheduleClick(ctx, countdownStart + i * beatInterval, false);
    }

    // Schedule exercise beats
    const exerciseStart = countdownStart + 3 * beatInterval;
    startTimeRef.current = exerciseStart;
    const times: number[] = [];
    for (let i = 0; i < totalBeats; i++) {
      const t = exerciseStart + i * beatInterval;
      times.push(t);
      scheduleClick(ctx, t, i % 4 === 0); // accent on beat 1
    }
    beatTimesRef.current = times;

    // Drive UI updates via setTimeout (approximate — display only)
    let beat = 0;

    function tick() {
      const now = ctx.currentTime;

      // Update countdown
      const elapsed = now - countdownStart;
      if (elapsed < 3 * beatInterval) {
        const countdownBeat = 3 - Math.floor(elapsed / beatInterval);
        setCountdown(countdownBeat);
        setTimeout(tick, 50);
        return;
      }

      setPhase("playing");

      const exElapsed = now - exerciseStart;
      const newBeat = Math.min(Math.floor(exElapsed / beatInterval), totalBeats - 1);
      if (newBeat !== currentBeatRef.current) {
        currentBeatRef.current = newBeat;
        setCurrentBeat(newBeat);
        setPulseKey((k) => k + 1);
        beat = newBeat;
      }

      if (beat < totalBeats - 1) {
        setTimeout(tick, 30);
      } else {
        // Give a short window for the final tap, then finish
        setTimeout(() => {
          setPhase("results");
          finishExercise(tapsRef.current);
        }, Math.round(beatInterval * 1000) + 300);
      }
    }

    setTimeout(tick, 50);
  }, [bpm, beatInterval, totalBeats, finishExercise]);

  const handleTap = useCallback(() => {
    if (phaseRef.current !== "playing") return;

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const beat = currentBeatRef.current;
    const beatTime = beatTimesRef.current[beat];

    // Also check adjacent beats for edge cases
    const candidates = [beat - 1, beat, beat + 1]
      .filter((b) => b >= 0 && b < beatTimesRef.current.length)
      .map((b) => ({ b, diff: now - beatTimesRef.current[b] }))
      .sort((a, z) => Math.abs(a.diff) - Math.abs(z.diff));

    const best = candidates[0];
    const offsetMs = Math.round(best.diff * 1000);
    const hit = Math.abs(offsetMs) <= 150;
    const tapScore = scoreFromOffsetMs(offsetMs);

    const result: TapResult = { beatIndex: best.b, offsetMs, hit };
    tapsRef.current = [...tapsRef.current, result];
    setTaps((prev) => [...prev, result]);

    const feedback =
      tapScore >= 95
        ? "Perfect! 🎯"
        : tapScore >= 85
        ? "Great! ✨"
        : tapScore >= 70
        ? "Good"
        : tapScore >= 50
        ? "OK"
        : offsetMs > 0
        ? "Late"
        : "Early";

    setLastTapFeedback(feedback);
    setTimeout(() => setLastTapFeedback(null), 400);

    // Tap sound feedback
    scheduleClick(ctx, beatTime, false);
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (phase === "idle" || phase === "results") {
          startExercise();
        } else {
          handleTap();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, startExercise, handleTap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const progressPct = totalBeats > 0 ? (currentBeat / totalBeats) * 100 : 0;

  if (audioError) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="text-4xl">🔇</div>
        <p className="font-semibold">Audio unavailable</p>
        <p className="text-sm max-w-xs" style={{ color: "var(--foreground-muted)" }}>{audioError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* BPM Badge */}
      <div className="flex items-center gap-3">
        <span
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: "var(--brand-primary)", color: "white" }}
        >
          {bpm} BPM
        </span>
        {phase === "playing" && (
          <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>
            Beat {currentBeat + 1} / {totalBeats}
          </span>
        )}
      </div>

      {/* Main pulse indicator */}
      <div className="relative flex items-center justify-center">
        {phase === "idle" && (
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: "var(--surface)", border: "2px solid var(--border)" }}
            onClick={startExercise}
          >
            <span className="text-4xl">▶</span>
          </div>
        )}

        {phase === "countdown" && (
          <div
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center"
            style={{ background: "var(--surface)", border: "2px solid var(--brand-primary)" }}
          >
            <span className="text-5xl font-black" style={{ color: "var(--brand-primary)" }}>
              {countdown}
            </span>
            <span className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
              Get ready…
            </span>
          </div>
        )}

        {phase === "playing" && (
          <button
            key={pulseKey}
            onClick={handleTap}
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center cursor-pointer focus:outline-none animate-beat-pulse"
            style={{
              background: `radial-gradient(circle, var(--brand-primary) 0%, #7c3aed 100%)`,
              boxShadow: "0 0 40px rgba(124,58,237,0.5)",
              border: "none",
            }}
          >
            <span className="text-3xl font-black text-white">TAP</span>
            <span className="text-xs text-white/70 mt-1">or SPACE</span>
          </button>
        )}

        {phase === "results" && (
          <div
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center"
            style={{
              background: "var(--surface)",
              border: `3px solid ${gradeColor(finalScore)}`,
              boxShadow: `0 0 30px ${gradeColor(finalScore)}40`,
            }}
          >
            <span className="text-3xl font-black" style={{ color: gradeColor(finalScore) }}>
              {finalScore}%
            </span>
            <span className="text-sm font-semibold" style={{ color: gradeColor(finalScore) }}>
              {gradeLabel(finalScore)}
            </span>
          </div>
        )}

        {/* Tap feedback overlay */}
        {lastTapFeedback && (
          <div
            className="absolute -top-8 text-sm font-bold animate-fade-up"
            style={{ color: "var(--brand-accent)" }}
          >
            {lastTapFeedback}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {phase === "playing" && (
        <div
          className="w-full max-w-xs h-2 rounded-full overflow-hidden"
          style={{ background: "var(--surface-elevated)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
            }}
          />
        </div>
      )}

      {/* Tap history dots */}
      {(phase === "playing" || phase === "results") && taps.length > 0 && (
        <div className="flex gap-1 flex-wrap justify-center max-w-xs">
          {taps.map((t, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: t.hit
                  ? scoreFromOffsetMs(t.offsetMs) >= 85
                    ? "var(--brand-success)"
                    : "var(--brand-accent)"
                  : "#ef4444",
              }}
              title={`${t.offsetMs > 0 ? "+" : ""}${t.offsetMs}ms`}
            />
          ))}
        </div>
      )}

      {/* CTA */}
      {phase === "idle" && (
        <p className="text-sm text-center" style={{ color: "var(--foreground-muted)" }}>
          Click the circle or press <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: "var(--surface-elevated)" }}>SPACE</kbd> to start,
          then tap the beat!
        </p>
      )}

      {phase === "results" && (
        <button
          onClick={startExercise}
          className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
