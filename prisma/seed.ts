import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  const mod1 = await prisma.module.upsert({
    where: { slug: "beat-fundamentals" },
    update: {},
    create: {
      slug: "beat-fundamentals",
      title: "Beat Fundamentals",
      description:
        "Master the foundation of all DJ skills — understanding and feeling the beat.",
      order: 1,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "what-is-bpm" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "what-is-bpm",
      title: "What is BPM?",
      description:
        "Feel a groove at 120 BPM. Tap along to the beat and get your first score.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 50,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "counting-beats" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "counting-beats",
      title: "Counting Beats in 4/4",
      description:
        "Practice counting 1-2-3-4 over a steady 130 BPM rhythm.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 50,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "tempo-feel" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "tempo-feel",
      title: "Developing Tempo Feel",
      description:
        "Can you match a 140 BPM beat with your taps? Train your internal clock.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 75,
      isPublished: true,
    },
  });

  const mod2 = await prisma.module.upsert({
    where: { slug: "mixing-basics" },
    update: {},
    create: {
      slug: "mixing-basics",
      title: "Mixing Basics",
      description:
        "Start blending tracks. Learn how to align beats and manage transitions.",
      order: 2,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "beatmatching-intro" },
    update: {},
    create: {
      moduleId: mod2.id,
      slug: "beatmatching-intro",
      title: "Beatmatching Introduction",
      description:
        "The core DJ skill: match the tempo and phase of two tracks at 128 BPM.",
      type: "EXERCISE",
      difficulty: "INTERMEDIATE",
      order: 1,
      xpReward: 100,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "phrase-matching" },
    update: {},
    create: {
      moduleId: mod2.id,
      slug: "phrase-matching",
      title: "Phrase Matching",
      description:
        "Mix on the phrase boundary at 135 BPM for smooth, pro-sounding transitions.",
      type: "EXERCISE",
      difficulty: "INTERMEDIATE",
      order: 2,
      xpReward: 100,
      isPublished: true,
    },
  });

  const mod3 = await prisma.module.upsert({
    where: { slug: "advanced-techniques" },
    update: {},
    create: {
      slug: "advanced-techniques",
      title: "Advanced Techniques",
      description:
        "Push your skills with faster tempos and tighter timing windows.",
      order: 3,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "tight-timing" },
    update: {},
    create: {
      moduleId: mod3.id,
      slug: "tight-timing",
      title: "Tight Timing at 150 BPM",
      description:
        "High tempo, small timing window. Test how precise your internal clock really is.",
      type: "EXERCISE",
      difficulty: "ADVANCED",
      order: 1,
      xpReward: 150,
      isPublished: true,
    },
  });

  // Seed achievements
  await prisma.achievement.upsert({
    where: { slug: "first-beat" },
    update: {},
    create: {
      slug: "first-beat",
      title: "First Beat",
      description: "Completed your first beat-matching exercise.",
      xpReward: 25,
    },
  });

  await prisma.achievement.upsert({
    where: { slug: "perfect-timing" },
    update: {},
    create: {
      slug: "perfect-timing",
      title: "Perfect Timing",
      description: "Scored 90%+ on a beat-matching exercise.",
      xpReward: 100,
    },
  });

  await prisma.achievement.upsert({
    where: { slug: "module-complete" },
    update: {},
    create: {
      slug: "module-complete",
      title: "Module Master",
      description: "Completed all lessons in a module.",
      xpReward: 200,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
