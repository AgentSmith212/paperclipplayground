import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalUsers, totalEvents, topEvents, recentCompletions] =
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
        take: 20,
        select: {
          id: true,
          userId: true,
          properties: true,
          createdAt: true,
        },
      }),
    ]);

  return NextResponse.json({
    totalUsers,
    totalEvents,
    topEvents: topEvents.map((e) => ({ event: e.event, count: e._count.event })),
    recentCompletions,
  });
}
