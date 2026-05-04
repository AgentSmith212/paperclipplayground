"use client";

import { useState } from "react";
import BeatMatcher from "@/components/beat-matcher";

interface ConceptSection {
  heading: string;
  body: string;
}

interface AudioDemo {
  label: string;
  bpm: number;
}

interface Props {
  lessonId: string;
  sections: ConceptSection[];
  audioDemo?: AudioDemo;
  previousScore: number | null;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function LessonConcept({ lessonId, sections, audioDemo, previousScore }: Props) {
  const [showDemo, setShowDemo] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const [marked, setMarked] = useState(false);

  async function handleMarkComplete() {
    if (marked) return;
    setMarked(true);
    setSaveState("saving");
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: 100 }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setXpAwarded(data.xpAwarded);
      setIsFirstCompletion(data.isFirstCompletion);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setMarked(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Concept sections */}
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          <h3 className="font-bold text-base" style={{ color: "var(--brand-primary)" }}>
            {section.heading}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {section.body}
          </p>
        </div>
      ))}

      {/* Audio demo section */}
      {audioDemo && (
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid rgba(124,58,237,0.25)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-sm">{audioDemo.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                Listen first, then try tapping along
              </p>
            </div>
            <button
              onClick={() => setShowDemo((v) => !v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--brand-primary)", color: "white" }}
            >
              {showDemo ? "Hide Demo" : "Launch Demo"}
            </button>
          </div>

          {showDemo && (
            <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <BeatMatcher
                bpm={audioDemo.bpm}
                totalBeats={8}
                onComplete={() => {}}
              />
            </div>
          )}
        </div>
      )}

      {/* Mark complete */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {saveState === "saved" && xpAwarded !== null ? (
          <div
            className="w-full p-4 rounded-xl text-center"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <p className="font-bold" style={{ color: "var(--brand-success)" }}>
              ✓ Lesson complete!
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--brand-accent)" }}>
              +{xpAwarded} XP {isFirstCompletion ? "🎉 First time bonus!" : ""}
            </p>
            {previousScore !== null && (
              <p className="text-xs mt-1" style={{ color: "var(--foreground-muted)" }}>
                Already completed before
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={handleMarkComplete}
            disabled={marked}
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
            style={{
              background: marked ? "var(--surface-elevated)" : "var(--brand-primary)",
              color: marked ? "var(--foreground-muted)" : "white",
              cursor: marked ? "not-allowed" : "pointer",
            }}
          >
            {saveState === "saving" ? "Saving…" : "Mark as Read — Claim XP"}
          </button>
        )}
        {saveState === "error" && (
          <p className="text-xs" style={{ color: "#f87171" }}>
            Could not save progress. Are you logged in?
          </p>
        )}
      </div>
    </div>
  );
}
