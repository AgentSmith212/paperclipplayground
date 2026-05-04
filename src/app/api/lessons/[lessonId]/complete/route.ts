import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function computeLevel(xpTotal: number): number {
  return Math.floor(xpTotal / 500) + 1;
}

/** Returns the updated streak count given the user's last active date. */
function computeStreak(lastActiveAt: Date | null, currentStreak: number): number {
  if (!lastActiveAt) return 1;

  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const lastUTC = Date.UTC(
    lastActiveAt.getUTCFullYear(),
    lastActiveAt.getUTCMonth(),
    lastActiveAt.getUTCDate()
  );
  const daysDiff = (todayUTC - lastUTC) / 86_400_000;

  if (daysDiff === 0) return currentStreak; // already active today
  if (daysDiff === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken
}

async function awardAchievement(userId: string, slug: string): Promise<void> {
  const achievement = await prisma.achievement.findUnique({ where: { slug } });
  if (!achievement) return;

  const awarded = await prisma.userAchievement
    .create({ data: { userId, achievementId: achievement.id } })
    .catch(() => null);

  if (awarded) {
    // Award the achievement's XP bonus
    if (achievement.xpReward > 0) {
      await prisma.xpEvent.create({
        data: {
          userId,
          amount: achievement.xpReward,
          reason: `Achievement unlocked: ${achievement.title}`,
          sourceId: achievement.id,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { xpTotal: { increment: achievement.xpReward } },
      });
    }
  }
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

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { lessons: { where: { isPublished: true } } } } },
  });
  if (!lesson) {
    return Response.json({ error: "Lesson not found" }, { status: 404 });
  }

  const existing = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  const isFirstCompletion = !existing?.completedAt;
  const xpAmount = isFirstCompletion ? lesson.xpReward : Math.round(lesson.xpReward * 0.1);

  await prisma.userProgress.upsert({
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
      score:
        score !== null && (existing?.score === null || score > (existing?.score ?? 0))
          ? score
          : undefined,
      attempts: { increment: 1 },
    },
  });

  await prisma.xpEvent.create({
    data: {
      userId: session.user.id,
      amount: xpAmount,
      reason: isFirstCompletion
        ? `Completed lesson: ${lesson.title}`
        : `Replayed lesson: ${lesson.title}`,
      sourceId: lessonId,
    },
  });

  // Fetch current user state for streak + level calculations
  const userBefore = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
  const newStreak = computeStreak(userBefore.lastActiveAt, userBefore.streakDays);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      xpTotal: { increment: xpAmount },
      lastActiveAt: new Date(),
      streakDays: newStreak,
    },
  });

  const newLevel = computeLevel(user.xpTotal);
  let leveledUp = false;
  if (newLevel > user.level) {
    leveledUp = true;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { level: newLevel },
    });
  }

  // ——— Achievement checks ———

  const userId = session.user.id;

  // First lesson ever
  if (isFirstCompletion) {
    const totalCompleted = await prisma.userProgress.count({
      where: { userId, completedAt: { not: null } },
    });
    if (totalCompleted === 1) await awardAchievement(userId, "first-beat");
    if (totalCompleted === 5) await awardAchievement(userId, "lessons-5");
    if (totalCompleted === 10) await awardAchievement(userId, "lessons-10");
    if (totalCompleted === 25) await awardAchievement(userId, "lessons-25");

    // Module completion: check if all published lessons in the module are now done
    const moduleLessonIds = lesson.module.lessons.map((l) => l.id);
    const completedInModule = await prisma.userProgress.count({
      where: {
        userId,
        lessonId: { in: moduleLessonIds },
        completedAt: { not: null },
      },
    });
    if (completedInModule === moduleLessonIds.length) {
      await awardAchievement(userId, "module-complete");
    }
  }

  // Score-based achievements
  if (score !== null && score >= 90) {
    await awardAchievement(userId, "perfect-timing");
  }
  if (score !== null && score === 100) {
    await awardAchievement(userId, "flawless");
  }

  // Streak achievements
  if (newStreak >= 3) await awardAchievement(userId, "streak-3");
  if (newStreak >= 7) await awardAchievement(userId, "streak-7");
  if (newStreak >= 30) await awardAchievement(userId, "streak-30");

  // Level achievements
  if (newLevel >= 5) await awardAchievement(userId, "level-5");
  if (newLevel >= 10) await awardAchievement(userId, "level-10");

  // Re-read to get accurate final xpTotal after any achievement bonuses
  const finalUser = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  return Response.json({
    xpAwarded: xpAmount,
    isFirstCompletion,
    newXpTotal: finalUser.xpTotal,
    newLevel: Math.max(newLevel, user.level),
    newStreak,
    leveledUp,
  });
}
