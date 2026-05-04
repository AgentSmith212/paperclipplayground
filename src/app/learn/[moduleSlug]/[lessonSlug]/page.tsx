import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LessonExercise from "./lesson-exercise";
import LessonQuiz from "./lesson-quiz";
import LessonConcept from "./lesson-concept";

export const dynamic = "force-dynamic";

const difficultyColors: Record<string, string> = {
  BEGINNER: "var(--brand-success)",
  INTERMEDIATE: "#60a5fa",
  ADVANCED: "var(--brand-accent)",
  EXPERT: "#f472b6",
};

const typeIcons: Record<string, string> = {
  INTERACTIVE: "📖",
  EXERCISE: "🎵",
  QUIZ: "🧠",
  VIDEO: "🎬",
};

// ——— Content type shapes ——————————————————————————————————
interface ConceptSection { heading: string; body: string }
interface AudioDemo { label: string; bpm: number }
interface InteractiveContent { sections: ConceptSection[]; audioDemo?: AudioDemo }
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
interface QuizContent { questions: QuizQuestion[] }
interface ExerciseContent { bpm: number; beats: number }

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

  // Load all lessons in this module for navigation
  const moduleLessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId, isPublished: true },
    orderBy: { order: "asc" },
  });
  const currentIndex = moduleLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? moduleLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < moduleLessons.length - 1 ? moduleLessons[currentIndex + 1] : null;

  const content = lesson.content as unknown;

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
            {typeIcons[lesson.type]} {lesson.type}
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

      {/* Lesson body */}
      <div
        className="p-8 rounded-2xl mb-8"
        style={{
          background: "var(--surface)",
          border:
            lesson.type === "EXERCISE"
              ? "1px solid rgba(124,58,237,0.25)"
              : "1px solid var(--border)",
        }}
      >
        {lesson.type === "EXERCISE" && (() => {
          const ec = content as ExerciseContent | null;
          const bpm = ec?.bpm ?? 120;
          const beats = ec?.beats ?? 16;
          return (
            <>
              <h2 className="text-lg font-bold mb-6 text-center">Beat Exercise — {bpm} BPM</h2>
              <LessonExercise
                lessonId={lesson.id}
                bpm={bpm}
                totalBeats={beats}
                previousScore={progress?.score ?? null}
              />
            </>
          );
        })()}

        {lesson.type === "QUIZ" && (() => {
          const qc = content as QuizContent | null;
          const questions = qc?.questions ?? [];
          return (
            <>
              <h2 className="text-lg font-bold mb-6">Knowledge Check</h2>
              <LessonQuiz
                lessonId={lesson.id}
                questions={questions}
                previousScore={progress?.score ?? null}
              />
            </>
          );
        })()}

        {lesson.type === "INTERACTIVE" && (() => {
          const ic = content as InteractiveContent | null;
          const sections = ic?.sections ?? [];
          return (
            <>
              <h2 className="text-lg font-bold mb-6">Lesson</h2>
              <LessonConcept
                lessonId={lesson.id}
                sections={sections}
                audioDemo={ic?.audioDemo}
                previousScore={progress?.score ?? null}
              />
            </>
          );
        })()}

        {lesson.type === "VIDEO" && (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🎬</p>
            <p className="font-semibold mb-2">Video coming soon</p>
            <p style={{ color: "var(--foreground-muted)" }} className="text-sm">
              This video lesson will be available shortly.
            </p>
          </div>
        )}
      </div>

      {/* Module progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--foreground-muted)" }}>
          <span>Lesson {currentIndex + 1} of {moduleLessons.length}</span>
          <span>{lesson.module.title}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${((currentIndex + 1) / moduleLessons.length) * 100}%`,
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/learn/${moduleSlug}/${prevLesson.slug}`}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            ← {prevLesson.title}
          </Link>
        ) : (
          <Link
            href="/learn"
            className="px-4 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            ← Back to Curriculum
          </Link>
        )}

        {nextLesson && (
          <Link
            href={`/learn/${moduleSlug}/${nextLesson.slug}`}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80 text-center"
            style={{ background: "var(--brand-primary)", color: "white" }}
          >
            {nextLesson.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
