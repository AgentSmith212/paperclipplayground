import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LessonExercise from "./lesson-exercise";

export const dynamic = "force-dynamic";

// BPM for exercise lessons — derived from slug/difficulty
function bpmForLesson(slug: string, difficulty: string): number {
  const map: Record<string, number> = {
    "what-is-bpm": 120,
    "counting-beats": 130,
    "tempo-feel": 140,
    "beatmatching-intro": 128,
    "phrase-matching": 135,
    "tight-timing": 150,
  };
  if (map[slug]) return map[slug];
  if (difficulty === "BEGINNER") return 120;
  if (difficulty === "INTERMEDIATE") return 128;
  return 140;
}

const difficultyColors: Record<string, string> = {
  BEGINNER: "var(--brand-success)",
  INTERMEDIATE: "#60a5fa",
  ADVANCED: "var(--brand-accent)",
  EXPERT: "#f472b6",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { moduleSlug, lessonSlug } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { slug: lessonSlug },
    include: { module: true },
  });

  if (!lesson || lesson.module.slug !== moduleSlug || !lesson.isPublished) {
    notFound();
  }

  const progress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
  });

  const bpm = bpmForLesson(lesson.slug, lesson.difficulty);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--foreground-muted)" }}>
        <Link href="/learn" className="hover:underline">Curriculum</Link>
        <span>/</span>
        <span>{lesson.module.title}</span>
        <span>/</span>
        <span style={{ color: "var(--foreground)" }}>{lesson.title}</span>
      </nav>

      {/* Lesson header */}
      <div
        className="p-6 rounded-2xl mb-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: difficultyColors[lesson.difficulty] + "20",
              color: difficultyColors[lesson.difficulty],
              border: `1px solid ${difficultyColors[lesson.difficulty]}40`,
            }}
          >
            {lesson.difficulty}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--surface-elevated)", color: "var(--foreground-muted)" }}
          >
            {lesson.type}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(245,158,11,0.15)", color: "var(--brand-accent)" }}
          >
            +{lesson.xpReward} XP
          </span>
          {progress?.completedAt && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(16,185,129,0.15)", color: "var(--brand-success)" }}
            >
              ✓ Completed {progress.score != null ? `· ${progress.score}%` : ""}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-black mb-2">{lesson.title}</h1>
        <p style={{ color: "var(--foreground-muted)" }}>{lesson.description}</p>
      </div>

      {/* Exercise area */}
      {lesson.type === "EXERCISE" && (
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <h2 className="text-lg font-bold mb-6 text-center">Beat Matching Exercise</h2>
          <LessonExercise
            lessonId={lesson.id}
            bpm={bpm}
            previousScore={progress?.score ?? null}
          />
        </div>
      )}

      {lesson.type !== "EXERCISE" && (
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-4xl mb-4">🎬</p>
          <p className="font-semibold mb-2">Content coming soon</p>
          <p style={{ color: "var(--foreground-muted)" }} className="text-sm">
            This lesson type will be available in a future update.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link
          href="/learn"
          className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          ← Back to Curriculum
        </Link>
      </div>
    </div>
  );
}
