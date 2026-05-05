"use client";

import { useState } from "react";
import Link from "next/link";
import BeatMatcher from "@/components/beat-matcher";

const BPM_PRESETS = [
  { label: "Slow", bpm: 90 },
  { label: "House", bpm: 128 },
  { label: "Techno", bpm: 140 },
  { label: "DnB", bpm: 174 },
];

export default function PracticePage() {
  const [selectedBpm, setSelectedBpm] = useState(128);
  const [customBpm, setCustomBpm] = useState("");
  const [activeBpm, setActiveBpm] = useState(128);
  const [key, setKey] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);

  function applyBpm(bpm: number) {
    setActiveBpm(bpm);
    setKey((k) => k + 1);
  }

  function handlePreset(bpm: number) {
    setSelectedBpm(bpm);
    setCustomBpm("");
    applyBpm(bpm);
  }

  function handleCustom() {
    const n = parseInt(customBpm, 10);
    if (n >= 60 && n <= 220) applyBpm(n);
  }

  function handleComplete(score: number) {
    setBestScore((prev) => (prev === null || score > prev ? score : prev));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Practice Mode</h1>
        <p style={{ color: "var(--foreground-muted)" }}>
          Free-play beat matching. Scores here don&apos;t count for XP — use lessons for that.
        </p>
      </div>

      {/* BPM selector */}
      <div
        className="p-5 rounded-2xl mb-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--foreground-muted)" }}>
          SELECT BPM
        </p>
        <div className="flex gap-2 flex-wrap mb-4">
          {BPM_PRESETS.map((p) => (
            <button
              key={p.bpm}
              onClick={() => handlePreset(p.bpm)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={
                selectedBpm === p.bpm && !customBpm
                  ? { background: "var(--brand-primary)", color: "white" }
                  : { background: "var(--surface-elevated)", color: "var(--foreground)" }
              }
            >
              {p.label} · {p.bpm}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min={60}
            max={220}
            placeholder="Custom BPM (60–220)"
            value={customBpm}
            onChange={(e) => setCustomBpm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          />
          <button
            onClick={handleCustom}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--brand-primary)", color: "white" }}
          >
            Set
          </button>
        </div>
      </div>

      {/* Beat matcher */}
      <div
        className="p-8 rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        <BeatMatcher key={key} bpm={activeBpm} totalBeats={16} onComplete={handleComplete} />
      </div>

      {bestScore !== null && (
        <p className="text-center mt-4 text-sm" style={{ color: "var(--foreground-muted)" }}>
          Session best: <span className="font-bold" style={{ color: "var(--brand-accent)" }}>{bestScore}%</span>
        </p>
      )}

      <p className="text-center mt-6 text-sm" style={{ color: "var(--foreground-muted)" }}>
        Want XP?{" "}
        <Link href="/learn" className="underline" style={{ color: "var(--brand-primary)" }}>
          Go to the curriculum
        </Link>
      </p>
    </div>
  );
}
