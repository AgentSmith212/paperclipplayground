import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const top = await prisma.user.findMany({
    orderBy: { xpTotal: "desc" },
    take: 20,
    select: { id: true, name: true, xpTotal: true, level: true, image: true },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-2">Leaderboard</h1>
      <p className="mb-10" style={{ color: "var(--foreground-muted)" }}>
        Top DJs ranked by total XP earned.
      </p>

      <div className="flex flex-col gap-2">
        {top.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <span
              className="w-8 text-center font-black text-sm"
              style={{
                color: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7c2f" : "var(--foreground-muted)",
              }}
            >
              {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{user.name ?? "Anonymous DJ"}</p>
              <p className="text-xs" style={{ color: "var(--foreground-muted)" }}>Level {user.level}</p>
            </div>
            <span className="font-black" style={{ color: "var(--brand-accent)" }}>
              {user.xpTotal.toLocaleString()} XP
            </span>
          </div>
        ))}

        {top.length === 0 && (
          <div className="text-center py-16" style={{ color: "var(--foreground-muted)" }}>
            No players yet — be the first to sign up and earn XP!
          </div>
        )}
      </div>
    </div>
  );
}
