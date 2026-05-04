import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function xpToNextLevel(level: number) {
  return level * 500;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      achievements: { include: { achievement: true }, take: 3 },
      progress: { where: { completedAt: { not: null } }, take: 5, orderBy: { completedAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const xpForNext = xpToNextLevel(user.level);
  const xpProgress = Math.min((user.xpTotal % xpForNext) / xpForNext, 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-1">
          Welcome back, {user.name?.split(" ")[0] ?? "DJ"} 🎧
        </h1>
        <p style={{ color: "var(--foreground-muted)" }}>
          {user.streakDays > 0 ? `🔥 ${user.streakDays}-day streak!` : "Start a streak — practice today!"}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Level", value: user.level, color: "#a78bfa" },
          { label: "Total XP", value: user.xpTotal.toLocaleString(), color: "var(--brand-accent)" },
          { label: "Lessons done", value: user.progress.length, color: "var(--brand-success)" },
          { label: "Badges", value: user.achievements.length, color: "#f472b6" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl flex flex-col gap-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--foreground-muted)" }}>
              {stat.label}
            </span>
            <span className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* XP progress bar */}
      <div
        className="p-6 rounded-2xl mb-10"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Level {user.level} → {user.level + 1}</span>
          <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>
            {user.xpTotal % xpForNext} / {xpForNext} XP
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
          <div
            className="h-full rounded-full transition-all glow-amber"
            style={{
              width: `${xpProgress * 100}%`,
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
            }}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/learn"
          className="p-6 rounded-2xl transition-all hover:opacity-90 flex flex-col gap-2"
          style={{ background: "var(--brand-primary)" }}
        >
          <span className="text-2xl">📚</span>
          <span className="font-bold text-lg">Continue Learning</span>
          <span className="text-sm opacity-75">Pick up where you left off</span>
        </Link>

        <Link
          href="/practice"
          className="p-6 rounded-2xl transition-all hover:opacity-90 flex flex-col gap-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🎛️</span>
          <span className="font-bold text-lg">Practice</span>
          <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>Beat matching exercises</span>
        </Link>

        <Link
          href="/leaderboard"
          className="p-6 rounded-2xl transition-all hover:opacity-90 flex flex-col gap-2"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <span className="text-2xl">🏆</span>
          <span className="font-bold text-lg">Leaderboard</span>
          <span className="text-sm" style={{ color: "var(--foreground-muted)" }}>See your ranking</span>
        </Link>
      </div>
    </div>
  );
}
