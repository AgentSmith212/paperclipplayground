import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { skillLevel, djGoal } = body;

  const validSkillLevels = ["beginner", "intermediate", "advanced"];
  const validGoals = ["hobbyist", "performer", "producer", "educator"];

  if (skillLevel && !validSkillLevels.includes(skillLevel)) {
    return NextResponse.json({ error: "Invalid skillLevel" }, { status: 400 });
  }
  if (djGoal && !validGoals.includes(djGoal)) {
    return NextResponse.json({ error: "Invalid djGoal" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingCompleted: true,
      skillLevel: skillLevel ?? null,
      djGoal: djGoal ?? null,
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      userId: session.user.id,
      event: "onboarding_completed",
      properties: { skillLevel, djGoal },
    },
  });

  return NextResponse.json({ ok: true });
}
