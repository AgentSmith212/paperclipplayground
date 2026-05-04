"use client";

import { useState } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
  previousScore: number | null;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function LessonQuiz({ lessonId, questions, previousScore }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);

  const score =
    submitted && questions.length > 0
      ? Math.round(
          (questions.filter((q) => answers[q.id] === q.correctIndex).length /
            questions.length) *
            100
        )
      : null;

  function handleSelect(questionId: string, index: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
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

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setSaveState("idle");
    setXpAwarded(null);
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = submitted
    ? questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Questions */}
      {questions.map((q, qi) => {
        const selected = answers[q.id];
        const isCorrect = submitted && selected === q.correctIndex;
        const isWrong = submitted && selected !== undefined && selected !== q.correctIndex;

        return (
          <div
            key={q.id}
            className="rounded-xl p-5"
            style={{
              background: "var(--surface)",
              border: `1px solid ${
                submitted
                  ? isCorrect
                    ? "rgba(16,185,129,0.4)"
                    : isWrong
                    ? "rgba(239,68,68,0.4)"
                    : "var(--border)"
                  : "var(--border)"
              }`,
            }}
          >
            <p className="font-semibold mb-4 text-sm">
              <span
                className="inline-block mr-2 px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: "var(--brand-primary)", color: "white" }}
              >
                {qi + 1}
              </span>
              {q.question}
            </p>

            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const isThisCorrect = oi === q.correctIndex;
                let bg = "var(--surface-elevated)";
                let border = "1px solid var(--border)";
                let color = "var(--foreground)";

                if (submitted) {
                  if (isThisCorrect) {
                    bg = "rgba(16,185,129,0.1)";
                    border = "1px solid rgba(16,185,129,0.5)";
                    color = "var(--brand-success)";
                  } else if (isSelected && !isThisCorrect) {
                    bg = "rgba(239,68,68,0.08)";
                    border = "1px solid rgba(239,68,68,0.4)";
                    color = "#f87171";
                  }
                } else if (isSelected) {
                  bg = "rgba(124,58,237,0.12)";
                  border = "1px solid rgba(124,58,237,0.5)";
                  color = "var(--brand-primary)";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(q.id, oi)}
                    disabled={submitted}
                    className="text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                    style={{ background: bg, border, color, cursor: submitted ? "default" : "pointer" }}
                  >
                    <span className="mr-2 font-mono opacity-60">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div
                className="mt-3 p-3 rounded-lg text-xs"
                style={{
                  background: isCorrect ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  color: isCorrect ? "var(--brand-success)" : "#f87171",
                }}
              >
                <span className="font-bold">{isCorrect ? "✓ Correct" : "✗ Incorrect"} — </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {/* Score display */}
      {submitted && score !== null && (
        <div
          className="p-5 rounded-2xl text-center"
          style={{
            background:
              score >= 80
                ? "rgba(16,185,129,0.1)"
                : score >= 60
                ? "rgba(245,158,11,0.1)"
                : "rgba(239,68,68,0.1)",
            border: `1px solid ${
              score >= 80
                ? "rgba(16,185,129,0.3)"
                : score >= 60
                ? "rgba(245,158,11,0.3)"
                : "rgba(239,68,68,0.3)"
            }`,
          }}
        >
          <p
            className="text-3xl font-black mb-1"
            style={{
              color:
                score >= 80
                  ? "var(--brand-success)"
                  : score >= 60
                  ? "var(--brand-accent)"
                  : "#f87171",
            }}
          >
            {score}%
          </p>
          <p className="text-sm font-semibold mb-1">
            {correctCount} / {questions.length} correct
          </p>
          {saveState === "saved" && xpAwarded !== null && (
            <p className="text-sm" style={{ color: "var(--brand-accent)" }}>
              +{xpAwarded} XP {isFirstCompletion ? "🎉 First completion!" : ""}
            </p>
          )}
          {previousScore !== null && score > previousScore && (
            <p className="text-xs mt-1" style={{ color: "var(--brand-success)" }}>
              New best (was {previousScore}%)
            </p>
          )}
          {saveState === "error" && (
            <p className="text-xs mt-1" style={{ color: "#f87171" }}>
              Score not saved — are you logged in?
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={answeredCount < questions.length}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity"
          style={{
            background:
              answeredCount < questions.length
                ? "var(--surface-elevated)"
                : "var(--brand-primary)",
            color:
              answeredCount < questions.length ? "var(--foreground-muted)" : "white",
            cursor: answeredCount < questions.length ? "not-allowed" : "pointer",
            opacity: answeredCount < questions.length ? 0.6 : 1,
          }}
        >
          {answeredCount < questions.length
            ? `Answer all questions (${answeredCount}/${questions.length})`
            : "Submit Answers"}
        </button>
      ) : (
        <button
          onClick={handleRetry}
          className="w-full py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
