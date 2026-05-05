import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalUsers, totalEvents, topEvents, recentCompletions, levelDist] =
    await Promise.all([
      prisma.user.count(),
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.groupBy({
        by: ["event"],
        _count: { event: true },
        orderBy: { _count: { event: "desc" } },
        take: 10,
      }),
      prisma.analyticsEvent.findMany({
        where: { event: "lesson_complete" },
        orderBy: { createdAt: "desc" },
        take: 15,
        select: { id: true, userId: true, properties: true, createdAt: true },
      }),
      prisma.user.groupBy({
        by: ["level"],
        _count: { level: true },
        orderBy: { level: "asc" },
      }),
    ]);

  return { totalUsers, totalEvents, topEvents, recentCompletions, levelDist };
}

export default async function AdminPage() {
  const { totalUsers, totalEvents, topEvents, recentCompletions, levelDist } =
    await getStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8">Analytics Dashboard</h1>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Total Events", value: totalEvents },
          {
            label: "Lesson Completions",
            value: topEvents.find((e) => e.event === "lesson_complete")?._count
              .event ?? 0,
          },
          {
            label: "Avg Level",
            value:
              levelDist.length > 0
                ? (
                    levelDist.reduce(
                      (s, r) => s + r.level * r._count.level,
                      0
                    ) / totalUsers
                  ).toFixed(1)
                : "—",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground-muted)" }}>
              {k.label.toUpperCase()}
            </p>
            <p className="text-3xl font-black">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Event funnel */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-bold mb-4">Top Events</h2>
        <div className="space-y-2">
          {topEvents.map((e) => (
            <div key={e.event} className="flex items-center gap-3">
              <span className="font-mono text-sm w-48 truncate">{e.event}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (e._count.event / (topEvents[0]?._count.event || 1)) * 100)}%`,
                    background: "var(--brand-accent)",
                  }}
                />
              </div>
              <span className="text-sm font-semibold w-10 text-right">{e._count.event}</span>
            </div>
          ))}
          {topEvents.length === 0 && (
            <p style={{ color: "var(--foreground-muted)" }}>No events recorded yet.</p>
          )}
        </div>
      </div>

      {/* Recent completions */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-lg font-bold mb-4">Recent Lesson Completions</h2>
        {recentCompletions.length === 0 ? (
          <p style={{ color: "var(--foreground-muted)" }}>No completions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--foreground-muted)" }}>
                <th className="text-left pb-2">User</th>
                <th className="text-left pb-2">Score</th>
                <th className="text-left pb-2">XP</th>
                <th className="text-left pb-2">When</th>
              </tr>
            </thead>
            <tbody>
              {recentCompletions.map((ev) => {
                const p = ev.properties as Record<string, unknown> | null;
                return (
                  <tr key={ev.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2 font-mono text-xs">{ev.userId?.slice(0, 8) ?? "anon"}</td>
                    <td className="py-2">{p?.score != null ? `${p.score}%` : "—"}</td>
                    <td className="py-2">{p?.xpAwarded != null ? `+${p.xpAwarded}` : "—"}</td>
                    <td className="py-2 text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {new Date(ev.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
