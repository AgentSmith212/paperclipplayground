import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const BADGE_ICONS: Record<string, string> = {
  "first-beat":      "🥁",
  "lessons-5":       "🎵",
  "lessons-10":      "🎶",
  "lessons-25":      "🎸",
  "module-complete": "🏅",
  "perfect-timing":  "⏱️",
  "flawless":        "💎",
  "streak-3":        "🔥",
  "streak-7":        "🌟",
  "streak-30":       "👑",
  "level-5":         "⭐",
  "level-10":        "🚀",
};

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [allAchievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { xpReward: "asc" } }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true, earnedAt: true },
    }),
  ]);

  const earned = new Map(userAchievements.map((ua) => [ua.achievementId, ua.earnedAt]));
  const earnedCount = userAchievements.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Achievements</h1>
        <p style={{ color: "var(--foreground-muted)" }}>
          {earnedCount} of {allAchievements.length} badges unlocked
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="p-5 rounded-2xl mb-10"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Collection progress</span>
          <span style={{ color: "var(--foreground-muted)" }}>
            {Math.round((earnedCount / allAchievements.length) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-elevated)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(earnedCount / allAchievements.length) * 100}%`,
              background: "linear-gradient(90deg, #a78bfa, #f472b6)",
            }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map((a) => {
          const earnedAt = earned.get(a.id);
          const isEarned = !!earnedAt;

          return (
            <div
              key={a.id}
              className="p-5 rounded-2xl flex gap-4 items-start transition-all"
              style={{
                background: isEarned ? "var(--surface)" : "var(--surface-elevated)",
                border: `1px solid ${isEarned ? "var(--brand-primary)" : "var(--border)"}`,
                opacity: isEarned ? 1 : 0.55,
              }}
            >
              <span
                className="text-3xl flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
                style={{ background: isEarned ? "rgba(139,92,246,0.15)" : "var(--surface)" }}
              >
                {isEarned ? (BADGE_ICONS[a.slug] ?? "🏆") : "🔒"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{a.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                  {a.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.15)", color: "var(--brand-accent)" }}
                  >
                    +{a.xpReward} XP
                  </span>
                  {earnedAt && (
                    <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {new Date(earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
