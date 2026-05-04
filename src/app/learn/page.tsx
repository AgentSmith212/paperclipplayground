import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";

export default async function LearnPage() {
  const modules = await prisma.module.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { lessons: { where: { isPublished: true }, orderBy: { order: "asc" } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2">DJ Curriculum</h1>
        <p style={{ color: "var(--foreground-muted)" }}>
          Structured lessons from beginner to advanced. Complete them in order to unlock XP.
        </p>
      </div>

      {modules.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p className="text-4xl mb-4">🎵</p>
          <p className="text-lg font-semibold mb-2">Curriculum coming soon</p>
          <p style={{ color: "var(--foreground-muted)" }}>
            Lessons are being loaded. Check back shortly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {modules.map((mod, i) => (
            <div key={mod.id}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                  style={{ background: "var(--brand-primary)", color: "white" }}
                >
                  {i + 1}
                </span>
                <h2 className="text-xl font-bold">{mod.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                {mod.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${mod.slug}/${lesson.slug}`}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-80"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <span className="text-xl">
                      {lesson.type === "VIDEO" ? "🎬" : lesson.type === "INTERACTIVE" ? "🎛️" : lesson.type === "QUIZ" ? "🧠" : "🎵"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{lesson.title}</p>
                      <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                        {lesson.difficulty} · +{lesson.xpReward} XP
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
