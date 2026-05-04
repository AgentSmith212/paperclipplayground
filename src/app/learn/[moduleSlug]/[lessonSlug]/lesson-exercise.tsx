"use client";

import { useState } from "react";
import BeatMatcher from "@/components/beat-matcher";

interface Props {
  lessonId: string;
  bpm: number;
  totalBeats?: number;
  previousScore: number | null;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function LessonExercise({ lessonId, bpm, totalBeats = 16, previousScore }: Props) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const [latestScore, setLatestScore] = useState<number | null>(null);

  async function handleComplete(score: number) {
    setLatestScore(score);
    setSaveState("saving");
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setXpAwarded(data.xpAwarded);
      setIsFirstCompletion(data.isFirstCompletion);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <BeatMatcher bpm={bpm} totalBeats={totalBeats} onComplete={handleComplete} />

      {/* Save feedback */}
      {saveState === "saving" && (
        <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
          Saving score…
        </p>
      )}

      {saveState === "saved" && xpAwarded !== null && (
        <div
          className="px-5 py-3 rounded-xl text-center"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
        >
          <p className="font-bold" style={{ color: "var(--brand-accent)" }}>
            +{xpAwarded} XP {isFirstCompletion ? "🎉 First completion bonus!" : ""}
          </p>
          {previousScore !== null && latestScore !== null && latestScore > previousScore && (
            <p className="text-sm mt-1" style={{ color: "var(--brand-success)" }}>
              New best score: {latestScore}% (was {previousScore}%)
            </p>
          )}
        </div>
      )}

      {saveState === "error" && (
        <p className="text-sm" style={{ color: "#f87171" }}>
          Could not save score. Are you logged in?
        </p>
      )}
    </div>
  );
}
