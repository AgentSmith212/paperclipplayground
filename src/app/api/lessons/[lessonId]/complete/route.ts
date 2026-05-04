import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function computeLevel(xpTotal: number): number {
  return Math.floor(xpTotal / 500) + 1;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId } = await params;
  const body = await request.json().catch(() => ({}));
  const score: number | null = typeof body.score === "number" ? body.score : null;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  const isFirstCompletion = !existing?.completedAt;
  const xpAmount = isFirstCompletion ? lesson.xpReward : Math.round(lesson.xpReward * 0.1);

  const progress = await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: {
      userId: session.user.id,
      lessonId,
      completedAt: new Date(),
      score,
      attempts: 1,
    },
    update: {
      completedAt: new Date(),
      score: score !== null && (existing?.score === null || score > (existing?.score ?? 0))
        ? score
        : undefined,
      attempts: { increment: 1 },
    },
  });

  await prisma.xpEvent.create({
    data: {
      userId: session.user.id,
      amount: xpAmount,
      reason: isFirstCompletion ? `Completed lesson: ${lesson.title}` : `Replayed lesson: ${lesson.title}`,
      sourceId: lessonId,
    },
  });

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      xpTotal: { increment: xpAmount },
      lastActiveAt: new Date(),
    },
  });

  const newLevel = computeLevel(user.xpTotal);
  if (newLevel > user.level) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { level: newLevel },
    });
  }

  // Award "first-beat" achievement on first-ever lesson completion
  if (isFirstCompletion) {
    const totalCompleted = await prisma.userProgress.count({
      where: { userId: session.user.id, completedAt: { not: null } },
    });
    if (totalCompleted === 1) {
      const achievement = await prisma.achievement.findUnique({
        where: { slug: "first-beat" },
      });
      if (achievement) {
        await prisma.userAchievement
          .create({
            data: { userId: session.user.id, achievementId: achievement.id },
          })
          .catch(() => null); // ignore duplicate
      }
    }
  }

  // Award "perfect-timing" achievement on score >= 90
  if (score !== null && score >= 90) {
    const achievement = await prisma.achievement.findUnique({
      where: { slug: "perfect-timing" },
    });
    if (achievement) {
      await prisma.userAchievement
        .create({ data: { userId: session.user.id, achievementId: achievement.id } })
        .catch(() => null);
    }
  }

  return Response.json({
    xpAwarded: xpAmount,
    isFirstCompletion,
    progress,
    newXpTotal: user.xpTotal,
    newLevel: Math.max(newLevel, user.level),
  });
}
