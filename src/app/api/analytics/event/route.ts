import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { event, properties, sessionId } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ error: "event required" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        userId: session?.user?.id ?? null,
        event,
        properties: properties ?? null,
        sessionId: sessionId ?? null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
