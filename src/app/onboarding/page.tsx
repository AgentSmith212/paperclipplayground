"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "welcome" | "skill" | "goal" | "done";

const SKILL_OPTIONS = [
  {
    value: "beginner",
    label: "Never DJed before",
    icon: "🌱",
    desc: "I'm starting from zero",
  },
  {
    value: "intermediate",
    label: "Some experience",
    icon: "🎚️",
    desc: "I've mixed at home or at small events",
  },
  {
    value: "advanced",
    label: "Experienced DJ",
    icon: "🔥",
    desc: "I perform regularly and want to level up",
  },
];

const GOAL_OPTIONS = [
  { value: "hobbyist", label: "Just for fun", icon: "🎉", desc: "Mix for myself and friends" },
  { value: "performer", label: "Perform live", icon: "🎤", desc: "Play clubs, parties, or events" },
  { value: "producer", label: "Produce music", icon: "🎛️", desc: "Create original tracks" },
  { value: "educator", label: "Teach others", icon: "📚", desc: "Share knowledge with students" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [djGoal, setDjGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillLevel, djGoal }),
    });
    setStep("done");
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1800);
  }

  const stepNumber = step === "welcome" ? 1 : step === "skill" ? 2 : step === "goal" ? 3 : 4;
  const totalSteps = 3;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        {step !== "done" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
                Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                {Math.round(((stepNumber - 1) / totalSteps) * 100)}% complete
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((stepNumber - 1) / totalSteps) * 100}%`,
                  background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
                }}
              />
            </div>
          </div>
        )}

        <div
          className="p-8 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* ——— WELCOME ——— */}
          {step === "welcome" && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎧</div>
              <h1 className="text-3xl font-black mb-3">Welcome to DJ Academy!</h1>
              <p className="mb-8" style={{ color: "var(--foreground-muted)" }}>
                Answer two quick questions so we can personalise your learning path. Takes about 30 seconds.
              </p>
              <div className="flex flex-col gap-3 text-sm mb-8" style={{ color: "var(--foreground-muted)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span>Personalised curriculum based on your level</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span>100 XP welcome bonus already in your account</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">✅</span>
                  <span>Track your progress and earn badges</span>
                </div>
              </div>
              <button
                onClick={() => setStep("skill")}
                className="w-full py-3 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-primary)", color: "white" }}
              >
                Let&apos;s go →
              </button>
            </div>
          )}

          {/* ——— SKILL LEVEL ——— */}
          {step === "skill" && (
            <div>
              <h2 className="text-2xl font-black mb-2">What&apos;s your DJ experience?</h2>
              <p className="text-sm mb-6" style={{ color: "var(--foreground-muted)" }}>
                Be honest — we&apos;ll tailor your starting point.
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {SKILL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSkillLevel(opt.value)}
                    className="flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                    style={{
                      background: skillLevel === opt.value ? "rgba(124,58,237,0.15)" : "var(--surface-elevated)",
                      border: skillLevel === opt.value ? "1px solid var(--brand-primary)" : "1px solid var(--border)",
                    }}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("goal")}
                disabled={!skillLevel}
                className="w-full py-3 rounded-xl font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: "var(--brand-primary)", color: "white" }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ——— DJ GOAL ——— */}
          {step === "goal" && (
            <div>
              <h2 className="text-2xl font-black mb-2">What&apos;s your main goal?</h2>
              <p className="text-sm mb-6" style={{ color: "var(--foreground-muted)" }}>
                We&apos;ll highlight the most relevant tracks for you.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDjGoal(opt.value)}
                    className="flex flex-col items-start gap-2 p-4 rounded-xl text-left transition-all"
                    style={{
                      background: djGoal === opt.value ? "rgba(124,58,237,0.15)" : "var(--surface-elevated)",
                      border: djGoal === opt.value ? "1px solid var(--brand-primary)" : "1px solid var(--border)",
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("skill")}
                  className="px-4 py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-80"
                  style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}
                >
                  ← Back
                </button>
                <button
                  onClick={finish}
                  disabled={!djGoal || loading}
                  className="flex-1 py-3 rounded-xl font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: "var(--brand-primary)", color: "white" }}
                >
                  {loading ? "Saving…" : "Start learning →"}
                </button>
              </div>
            </div>
          )}

          {/* ——— DONE ——— */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-black mb-3">You&apos;re all set!</h2>
              <p style={{ color: "var(--foreground-muted)" }}>
                Taking you to your dashboard…
              </p>
              <div className="mt-6 flex justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--brand-primary)", borderTopColor: "transparent" }} />
              </div>
            </div>
          )}
        </div>

        {step !== "done" && (
          <p className="text-center text-xs mt-4" style={{ color: "var(--foreground-muted)" }}>
            <button onClick={finish} className="underline hover:text-white transition-colors">
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
