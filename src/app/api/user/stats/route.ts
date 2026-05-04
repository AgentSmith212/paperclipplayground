import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ level: 1, xpTotal: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { level: true, xpTotal: true },
  });

  return NextResponse.json({ level: user?.level ?? 1, xpTotal: user?.xpTotal ?? 0 });
}
