import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

// ——— Content helpers ——————————————————————————————————————————
type ConceptSection = { heading: string; body: string };
type AudioDemo = { label: string; bpm: number };
type InteractiveContent = { sections: ConceptSection[]; audioDemo?: AudioDemo };
type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
type QuizContent = { questions: QuizQuestion[] };
type ExerciseContent = { bpm: number; beats: number };

// ——— Module 1: Understanding BPM and Tempo ———————————————————
const bpmModule = {
  slug: "bpm-and-tempo",
  title: "Understanding BPM and Tempo",
  description:
    "The heartbeat of music. Learn what BPM means, how to feel it, and why it's the most important concept in DJing.",
  order: 1,
};

const bpmConceptContent: InteractiveContent = {
  sections: [
    {
      heading: "What is BPM?",
      body: "BPM stands for Beats Per Minute — it's the speed of a track. If a song is at 120 BPM, there are exactly 120 evenly spaced beats every minute. Most dance music sits between 120–145 BPM depending on the genre.",
    },
    {
      heading: "Why Does It Matter for DJs?",
      body: "DJs mix two tracks simultaneously. If track A plays at 128 BPM and track B plays at 130 BPM, the beats will drift out of sync within seconds. Matching BPM is the first step to a seamless blend.",
    },
    {
      heading: "Counting the Beat",
      body: "Most electronic music is in 4/4 time — four beats per bar. You count: 1-2-3-4, 1-2-3-4. Beat 1 (the downbeat) is the strongest. DJs use these boundaries to plan their mix transitions.",
    },
    {
      heading: "Listen and Feel",
      body: "The exercise below plays a steady metronome. Your job: tap along with every beat. The closer your taps are to the actual beat, the higher your score. Start slow, then build precision.",
    },
  ],
  audioDemo: { label: "120 BPM metronome demo", bpm: 120 },
};

const bpmQuizContent: QuizContent = {
  questions: [
    {
      id: "bpm-q1",
      question: "What does BPM stand for?",
      options: [
        "Bass Per Minute",
        "Beats Per Minute",
        "Bars Per Measure",
        "Beat Phase Matching",
      ],
      correctIndex: 1,
      explanation:
        "BPM = Beats Per Minute. It measures how many beats occur in one minute and defines the speed of a track.",
    },
    {
      id: "bpm-q2",
      question: "A track plays at 120 BPM. How many beats happen in 30 seconds?",
      options: ["30", "60", "90", "120"],
      correctIndex: 1,
      explanation:
        "120 BPM means 120 beats per 60 seconds. In 30 seconds: 120 ÷ 2 = 60 beats.",
    },
    {
      id: "bpm-q3",
      question: "In 4/4 time, how many beats are in one bar?",
      options: ["2", "3", "4", "8"],
      correctIndex: 2,
      explanation:
        "4/4 time has 4 beats per bar — counted 1, 2, 3, 4. Most electronic music uses 4/4.",
    },
    {
      id: "bpm-q4",
      question: "Why do DJs need to match BPM?",
      options: [
        "To make music louder",
        "To keep beats aligned so the mix doesn't sound chaotic",
        "To add more bass",
        "BPM doesn't matter for mixing",
      ],
      correctIndex: 1,
      explanation:
        "If two tracks play at different BPMs, beats drift out of sync quickly. Matching BPM is step 1 of beatmatching.",
    },
    {
      id: "bpm-q5",
      question: "Which genre typically has the highest BPM?",
      options: ["Hip-hop (80-100)", "House (120-130)", "Drum & Bass (160-180)", "Ambient (60-80)"],
      correctIndex: 2,
      explanation:
        "Drum & Bass runs at 160-180 BPM. Hip-hop is slowest, House is mid-range, and D&B is fastest of these.",
    },
  ],
};

// ——— Module 2: Beat-Matching Basics ——————————————————————————
const beatMatchingModule = {
  slug: "beat-matching-basics",
  title: "Beat-Matching Basics",
  description:
    "The core DJ skill. Learn how to align the beats of two tracks so they play in perfect sync.",
  order: 2,
};

const beatMatchingConceptContent: InteractiveContent = {
  sections: [
    {
      heading: "What is Beat-Matching?",
      body: "Beat-matching is the process of synchronising the tempo and phase of two tracks so their beats land at exactly the same time. It's what allows a DJ to blend songs without the beat 'breaking' — that jarring moment where one beat crashes into another.",
    },
    {
      heading: "Two Steps: Tempo Then Phase",
      body: "Step 1 is tempo: both tracks must be at the same BPM. Step 2 is phase: beat 1 of track A must land on beat 1 of track B. A track can be at the right speed but offset by half a beat — that's a phase error.",
    },
    {
      heading: "How DJs Used to Do It",
      body: "Before CDJs and sync buttons, DJs used vinyl and their ears. They'd speed up or slow down a record by touching the platter until the beats locked in, then release at exactly the right moment. It took thousands of hours to master.",
    },
    {
      heading: "Modern Beat-Matching",
      body: "Today's software can auto-sync BPM, but elite DJs still use manual beatmatching. Understanding it deeply gives you full control — you're not guessing, you hear exactly where the beats are and how to correct them.",
    },
    {
      heading: "Your Exercise",
      body: "Below, you'll tap along to a 128 BPM track — the standard house tempo. Focus on precision. You need to feel the beat before you can match another track to it.",
    },
  ],
  audioDemo: { label: "128 BPM house groove demo", bpm: 128 },
};

const beatMatchingQuizContent: QuizContent = {
  questions: [
    {
      id: "bm-q1",
      question: "What are the two steps of beat-matching?",
      options: [
        "Volume and EQ",
        "Tempo and phase alignment",
        "Key and BPM",
        "Reverb and delay",
      ],
      correctIndex: 1,
      explanation:
        "Step 1: match tempo (BPM). Step 2: align phase so beat 1 of each track lands simultaneously.",
    },
    {
      id: "bm-q2",
      question: "What is a 'phase error'?",
      options: [
        "Two tracks at different BPMs",
        "Two tracks at the same BPM but beats are offset",
        "A track playing backwards",
        "Distortion in the signal",
      ],
      correctIndex: 1,
      explanation:
        "A phase error means BPMs match but the beats are offset — one track's beat 1 hits between beats of the other track.",
    },
    {
      id: "bm-q3",
      question: "What BPM is standard for house music?",
      options: ["90-100", "110-115", "120-130", "140-160"],
      correctIndex: 2,
      explanation:
        "House music typically runs 120-130 BPM. 128 BPM is an extremely common standard in the genre.",
    },
    {
      id: "bm-q4",
      question: "Before DJ software, how did DJs adjust a record's speed?",
      options: [
        "By changing the needle",
        "By touching the platter to speed it up or slow it down",
        "By pressing a pitch button",
        "Records couldn't be adjusted",
      ],
      correctIndex: 1,
      explanation:
        "Vinyl DJs touched the platter edge to brake a record (slow it down) or pushed the label to speed it up, nudging tempo by feel.",
    },
  ],
};

// ——— Module 3: Basic Mixing — In/Out Transitions —————————————
const basicMixingModule = {
  slug: "basic-mixing",
  title: "Basic Mixing — In/Out Transitions",
  description:
    "Move between tracks smoothly. Learn phrase structure, when to mix, and how to execute a clean transition.",
  order: 3,
};

const basicMixingConceptContent: InteractiveContent = {
  sections: [
    {
      heading: "What Makes a Good Mix?",
      body: "A mix is the moment you move the audience from one track to another without them noticing — or without breaking the energy. The best transitions feel inevitable. The worst feel like car crashes.",
    },
    {
      heading: "Phrase Structure",
      body: "Most dance music is built in 8-bar phrases. Four bars make a half-phrase, 8 bars a full phrase, 16 bars a double-phrase. DJs mix at phrase boundaries — usually every 16 or 32 bars — because that's when musical elements change.",
    },
    {
      heading: "The Basic Transition: Crossfade",
      body: "The simplest mix: bring track B in gradually while fading track A out. Use the crossfader or channel faders. You want beats aligned, BPMs matched, and the swap to happen during a low-energy section of track A (like a breakdown).",
    },
    {
      heading: "Reading the Waveform",
      body: "Modern CDJs and software show waveforms. A busy, tall waveform = lots of elements (verse, drop). A flat section = breakdown or intro. Mix in during breakdowns — fewer elements = less sonic clash.",
    },
    {
      heading: "Exercise: Phrase Matching",
      body: "This exercise runs at 135 BPM. Focus on staying on the beat through 16 full bars. This builds the muscle memory to maintain your tap through a full transition window.",
    },
  ],
  audioDemo: { label: "135 BPM groove — 16 bars", bpm: 135 },
};

const basicMixingQuizContent: QuizContent = {
  questions: [
    {
      id: "mix-q1",
      question: "How many bars are in a typical full phrase in dance music?",
      options: ["2", "4", "8", "16"],
      correctIndex: 2,
      explanation:
        "Most dance music uses 8-bar phrases. DJs typically mix at 8 or 16 bar boundaries for musical transitions.",
    },
    {
      id: "mix-q2",
      question: "Where in a track should you start bringing in the new song?",
      options: [
        "During the drop (highest energy)",
        "During a breakdown or intro (lower energy)",
        "At a random point",
        "Right at the start",
      ],
      correctIndex: 1,
      explanation:
        "Mix during breakdowns or intros — fewer elements playing means less sonic clash as you blend two tracks together.",
    },
    {
      id: "mix-q3",
      question: "What does a flat waveform section indicate?",
      options: [
        "The track is broken",
        "A high-energy drop",
        "A breakdown, intro, or outro with fewer elements",
        "The track is at maximum volume",
      ],
      correctIndex: 2,
      explanation:
        "Flat waveform = low amplitude = fewer instruments playing. These are ideal mixing windows.",
    },
    {
      id: "mix-q4",
      question: "In a crossfade mix, what happens to the outgoing track?",
      options: [
        "It stops immediately",
        "It gradually fades out while the incoming track fades in",
        "It gets louder",
        "It loops",
      ],
      correctIndex: 1,
      explanation:
        "A crossfade gradually decreases the outgoing track's volume while increasing the incoming track's volume, creating a smooth blend.",
    },
    {
      id: "mix-q5",
      question: "Why do DJs mix at phrase boundaries?",
      options: [
        "It's easier",
        "Musical elements change there, making transitions feel natural",
        "The BPM changes at boundaries",
        "Phrase boundaries don't matter",
      ],
      correctIndex: 1,
      explanation:
        "Phrase boundaries are where verses, choruses, drops, and breakdowns begin. Transitions there feel musically intentional.",
    },
  ],
};

// ——— Module 4: EQ Fundamentals ———————————————————————————————
const eqModule = {
  slug: "eq-fundamentals",
  title: "EQ Fundamentals",
  description:
    "Control the frequency spectrum. Use EQ to prevent clashing elements and shape the sonic texture of your mix.",
  order: 4,
};

const eqConceptContent: InteractiveContent = {
  sections: [
    {
      heading: "What is EQ?",
      body: "EQ (Equaliser) lets you boost or cut specific frequency ranges. Most DJ mixers have a 3-band EQ per channel: Low (bass, 20-250Hz), Mid (vocals/synths, 250Hz-4kHz), and High (hi-hats/cymbals, 4kHz-20kHz).",
    },
    {
      heading: "Why EQ Matters in Mixing",
      body: "When two tracks play simultaneously, two kick drums hit at the same time — doubling the bass energy and muddying the mix. DJs use EQ to duck the bass of the incoming track, then gradually swap it in as they fade out the outgoing track's bass.",
    },
    {
      heading: "The Bass Swap Technique",
      body: "This is the most important EQ move: cut the Low band fully on track B before the transition. Fade B in — only mids and highs play. Then at the right moment, cut the lows on track A and bring up the lows on track B. One kick, clean mix.",
    },
    {
      heading: "EQ for Energy Control",
      body: "Beyond mixing, EQ shapes energy. Cutting highs creates a warm, muffled effect. Dropping mids removes presence. Rolling off the bass creates a breakdown feeling. These techniques let you build and release tension throughout a set.",
    },
    {
      heading: "Common EQ Mistakes",
      body: "Boosting too aggressively causes distortion. Never boost lows on both channels simultaneously — it clips the master. Don't live-EQ too fast; slow, musical movements sound intentional. Subtlety wins over radical cuts.",
    },
  ],
};

const eqDemoContent: InteractiveContent = {
  sections: [
    {
      heading: "EQ in Practice: The Bass Swap",
      body: "In the exercise below, you're timing your taps to represent the 'swap moment' — when you'd cut bass on the outgoing track and open bass on the incoming track. At 125 BPM, this typically happens on beat 1 of a new phrase.",
    },
    {
      heading: "Frequency Ranges to Know",
      body: "Low: 20-250Hz (kick, bass). Cut this to remove weight. Mid: 250Hz-4kHz (synths, vocals, snare body). High: 4kHz-20kHz (hi-hats, shimmer, air). Each 3-band EQ controls these three regions.",
    },
  ],
  audioDemo: { label: "125 BPM — practice the swap timing", bpm: 125 },
};

const eqQuizContent: QuizContent = {
  questions: [
    {
      id: "eq-q1",
      question: "What frequency range does the 'Low' EQ band control?",
      options: [
        "4kHz - 20kHz",
        "250Hz - 4kHz",
        "20Hz - 250Hz",
        "1kHz - 8kHz",
      ],
      correctIndex: 2,
      explanation:
        "The Low band (20-250Hz) controls bass and kick drum energy — the foundation of dance music.",
    },
    {
      id: "eq-q2",
      question: "Why do DJs cut the bass on the incoming track before mixing it in?",
      options: [
        "To make it sound quieter",
        "To prevent two kick drums doubling and muddying the mix",
        "Bass cuts are mandatory",
        "It has no practical effect",
      ],
      correctIndex: 1,
      explanation:
        "Two kick drums at full volume create a muddy low-end. Cutting the incoming track's bass prevents this clash.",
    },
    {
      id: "eq-q3",
      question: "The 'Mid' frequency band primarily contains which elements?",
      options: [
        "Kick drums and bass",
        "Hi-hats and cymbals",
        "Vocals, synths, and snare body",
        "Sub-bass only",
      ],
      correctIndex: 2,
      explanation:
        "The Mid band (250Hz-4kHz) contains most melodic content: vocals, synth leads, and the body of the snare.",
    },
    {
      id: "eq-q4",
      question: "What happens if you boost the Low EQ on both channels simultaneously at high levels?",
      options: [
        "The mix sounds better",
        "Nothing happens",
        "The master output clips and distorts",
        "The tracks speed up",
      ],
      correctIndex: 2,
      explanation:
        "Boosting bass on both channels simultaneously can easily clip the master output, causing harsh digital distortion.",
    },
  ],
};

// ——— Module 5: Your First Mix — Capstone ————————————————————
const capstonModule = {
  slug: "your-first-mix",
  title: "Your First Mix — Capstone",
  description:
    "Put everything together. Apply BPM knowledge, beatmatching, transitions, and EQ in one final challenge.",
  order: 5,
};

const capstoneConceptContent: InteractiveContent = {
  sections: [
    {
      heading: "You've Come This Far",
      body: "You now know the core skills: reading BPM and feeling the beat, aligning phase through beatmatching, choosing when to transition with phrase awareness, and using EQ to keep the frequency spectrum clean.",
    },
    {
      heading: "The DJ's Mental Stack",
      body: "A professional DJ runs multiple tracks in their head simultaneously: What's the BPM? Are the beats synced? Where are we in the phrase? Does anything clash in the EQ? What's the energy doing? This becomes automatic with practice.",
    },
    {
      heading: "Your Final Challenge",
      body: "The capstone exercise runs at 130 BPM — a slightly faster groove than you've practiced before. You'll need to maintain 16 beats of steady tapping. This is your first real-world DJ tempo challenge.",
    },
    {
      heading: "What's Next",
      body: "After this module, you'll move to Intermediate content: harmonic mixing, using keys to make transitions musical, advanced EQ moves, and building set structure. The foundation you've built here carries through everything.",
    },
  ],
};

const capstoneQuizContent: QuizContent = {
  questions: [
    {
      id: "cap-q1",
      question: "Which step comes FIRST when mixing a new track in?",
      options: [
        "Apply EQ cuts",
        "Match the BPM (tempo)",
        "Start the crossfade",
        "Choose the next track",
      ],
      correctIndex: 1,
      explanation:
        "Always match BPM first. Without tempo sync, the phase alignment step is impossible to maintain.",
    },
    {
      id: "cap-q2",
      question: "You're mixing at 128 BPM. The new track reads 130 BPM on your CDJ. What do you do?",
      options: [
        "Mix anyway — 2 BPM difference is fine",
        "Adjust the pitch/tempo of the new track down to 128 BPM",
        "Speed up the playing track to 130 BPM",
        "Stop and start over",
      ],
      correctIndex: 1,
      explanation:
        "Always adjust the incoming track to match the playing one (not the reverse, which would affect the live mix).",
    },
    {
      id: "cap-q3",
      question: "What is the correct order for a bass swap during a transition?",
      options: [
        "Cut A's bass → bring in B with bass → fade A out",
        "Cut B's bass before mixing in → swap bass at phrase boundary → open B's bass, cut A's bass",
        "Open both basses simultaneously",
        "Never touch the EQ during a transition",
      ],
      correctIndex: 1,
      explanation:
        "Standard bass swap: pre-cut B's bass, mix in B's mids/highs, then at the phrase boundary cut A's bass and open B's bass — one clean swap.",
    },
    {
      id: "cap-q4",
      question: "You're 8 bars into a transition and the beats start drifting. What's the most likely cause?",
      options: [
        "The EQ is wrong",
        "The BPMs are slightly mismatched — pitch drift is happening",
        "The crossfader position",
        "The master volume is too high",
      ],
      correctIndex: 1,
      explanation:
        "Gradual drift after initially matching beats indicates a small BPM difference. Nudge the incoming track's pitch to re-lock.",
    },
    {
      id: "cap-q5",
      question: "What technique lets you mix tracks in the same musical key?",
      options: [
        "Beat-matching",
        "Harmonic mixing (using the Camelot wheel)",
        "EQ matching",
        "Tempo locking",
      ],
      correctIndex: 1,
      explanation:
        "Harmonic mixing uses the Camelot (or Open Key) wheel to identify tracks whose musical keys are compatible, preventing melodic clashes.",
    },
  ],
};

async function main() {
  // ——— Module 1: BPM and Tempo ———
  const mod1 = await prisma.module.upsert({
    where: { slug: bpmModule.slug },
    update: { title: bpmModule.title, description: bpmModule.description, order: bpmModule.order, isPublished: true },
    create: { ...bpmModule, isPublished: true },
  });

  await prisma.lesson.upsert({
    where: { slug: "bpm-concept" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "bpm-concept",
      title: "What is BPM?",
      description: "Understand beats per minute, tempo, and why it's the foundation of all DJing.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 25,
      content: bpmConceptContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "bpm-tap-exercise" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "bpm-tap-exercise",
      title: "Tap the Beat at 120 BPM",
      description: "Feel a groove at 120 BPM. Tap along to the beat and get your first score.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 50,
      content: { bpm: 120, beats: 16 } satisfies ExerciseContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "bpm-quiz" },
    update: {},
    create: {
      moduleId: mod1.id,
      slug: "bpm-quiz",
      title: "BPM Knowledge Check",
      description: "Test your understanding of BPM, tempo, and 4/4 time.",
      type: "QUIZ",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 35,
      content: bpmQuizContent,
      isPublished: true,
    },
  });

  // ——— Module 2: Beat-Matching Basics ———
  const mod2 = await prisma.module.upsert({
    where: { slug: beatMatchingModule.slug },
    update: { title: beatMatchingModule.title, description: beatMatchingModule.description, order: beatMatchingModule.order, isPublished: true },
    create: { ...beatMatchingModule, isPublished: true },
  });

  await prisma.lesson.upsert({
    where: { slug: "bm-concept" },
    update: {},
    create: {
      moduleId: mod2.id,
      slug: "bm-concept",
      title: "How DJs Sync Tracks",
      description: "Learn the two-step process of matching tempo and phase between two tracks.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 25,
      content: beatMatchingConceptContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "bm-exercise-128" },
    update: {},
    create: {
      moduleId: mod2.id,
      slug: "bm-exercise-128",
      title: "Beat Exercise at 128 BPM",
      description: "The core DJ skill: stay locked to a 128 BPM house groove for 16 beats.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 75,
      content: { bpm: 128, beats: 16 } satisfies ExerciseContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "bm-quiz" },
    update: {},
    create: {
      moduleId: mod2.id,
      slug: "bm-quiz",
      title: "Beat-Matching Quiz",
      description: "Check your knowledge of tempo, phase, and beat-matching techniques.",
      type: "QUIZ",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 40,
      content: beatMatchingQuizContent,
      isPublished: true,
    },
  });

  // ——— Module 3: Basic Mixing ———
  const mod3 = await prisma.module.upsert({
    where: { slug: basicMixingModule.slug },
    update: { title: basicMixingModule.title, description: basicMixingModule.description, order: basicMixingModule.order, isPublished: true },
    create: { ...basicMixingModule, isPublished: true },
  });

  await prisma.lesson.upsert({
    where: { slug: "mix-concept" },
    update: {},
    create: {
      moduleId: mod3.id,
      slug: "mix-concept",
      title: "The Art of the Transition",
      description: "Learn phrase structure, mixing windows, and what makes a transition sound musical.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 25,
      content: basicMixingConceptContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "mix-phrase-exercise" },
    update: {},
    create: {
      moduleId: mod3.id,
      slug: "mix-phrase-exercise",
      title: "Phrase Matching at 135 BPM",
      description: "Stay tight to a 135 BPM groove through 16 bars — the length of a real mixing window.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 75,
      content: { bpm: 135, beats: 16 } satisfies ExerciseContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "mix-quiz" },
    update: {},
    create: {
      moduleId: mod3.id,
      slug: "mix-quiz",
      title: "Mixing Fundamentals Quiz",
      description: "Test your knowledge of phrases, transitions, and waveform reading.",
      type: "QUIZ",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 40,
      content: basicMixingQuizContent,
      isPublished: true,
    },
  });

  // ——— Module 4: EQ Fundamentals ———
  const mod4 = await prisma.module.upsert({
    where: { slug: eqModule.slug },
    update: { title: eqModule.title, description: eqModule.description, order: eqModule.order, isPublished: true },
    create: { ...eqModule, isPublished: true },
  });

  await prisma.lesson.upsert({
    where: { slug: "eq-concept" },
    update: {},
    create: {
      moduleId: mod4.id,
      slug: "eq-concept",
      title: "What is EQ?",
      description: "Understand frequency bands and why EQ is essential for clean, professional mixes.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 25,
      content: eqConceptContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "eq-practice" },
    update: {},
    create: {
      moduleId: mod4.id,
      slug: "eq-practice",
      title: "EQ in Practice — Bass Swap",
      description: "Learn the bass swap technique and practice the timing at 125 BPM.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 60,
      content: eqDemoContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "eq-exercise" },
    update: {},
    create: {
      moduleId: mod4.id,
      slug: "eq-exercise",
      title: "EQ Timing Exercise at 125 BPM",
      description: "Lock in to 125 BPM — the timing where you'd execute an EQ bass swap.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 60,
      content: { bpm: 125, beats: 16 } satisfies ExerciseContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "eq-quiz" },
    update: {},
    create: {
      moduleId: mod4.id,
      slug: "eq-quiz",
      title: "EQ Knowledge Check",
      description: "Test your understanding of frequency bands and EQ mixing techniques.",
      type: "QUIZ",
      difficulty: "BEGINNER",
      order: 4,
      xpReward: 40,
      content: eqQuizContent,
      isPublished: true,
    },
  });

  // ——— Module 5: Capstone — Your First Mix ———
  const mod5 = await prisma.module.upsert({
    where: { slug: capstonModule.slug },
    update: { title: capstonModule.title, description: capstonModule.description, order: capstonModule.order, isPublished: true },
    create: { ...capstonModule, isPublished: true },
  });

  await prisma.lesson.upsert({
    where: { slug: "capstone-overview" },
    update: {},
    create: {
      moduleId: mod5.id,
      slug: "capstone-overview",
      title: "Putting It All Together",
      description: "Review what you've learned and prepare for the final mix challenge.",
      type: "INTERACTIVE",
      difficulty: "BEGINNER",
      order: 1,
      xpReward: 25,
      content: capstoneConceptContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "capstone-mix-challenge" },
    update: {},
    create: {
      moduleId: mod5.id,
      slug: "capstone-mix-challenge",
      title: "Final Mix Challenge at 130 BPM",
      description: "Your capstone: stay locked to 130 BPM for a full 16-beat run. This is DJ tempo.",
      type: "EXERCISE",
      difficulty: "BEGINNER",
      order: 2,
      xpReward: 150,
      content: { bpm: 130, beats: 16 } satisfies ExerciseContent,
      isPublished: true,
    },
  });

  await prisma.lesson.upsert({
    where: { slug: "capstone-final-quiz" },
    update: {},
    create: {
      moduleId: mod5.id,
      slug: "capstone-final-quiz",
      title: "Final Assessment",
      description: "Prove you've mastered the beginner fundamentals with this comprehensive quiz.",
      type: "QUIZ",
      difficulty: "BEGINNER",
      order: 3,
      xpReward: 75,
      content: capstoneQuizContent,
      isPublished: true,
    },
  });

  // ——— Achievements ———
  const achievements = [
    { slug: "first-beat",      title: "First Beat",       description: "Completed your first lesson.",                 xpReward: 25  },
    { slug: "lessons-5",       title: "On A Roll",         description: "Completed 5 lessons.",                         xpReward: 50  },
    { slug: "lessons-10",      title: "Dedicated DJ",      description: "Completed 10 lessons.",                        xpReward: 100 },
    { slug: "lessons-25",      title: "Grind Mode",        description: "Completed 25 lessons.",                        xpReward: 250 },
    { slug: "module-complete", title: "Module Master",     description: "Completed every lesson in a module.",          xpReward: 200 },
    { slug: "perfect-timing",  title: "Perfect Timing",    description: "Scored 90%+ on an exercise.",                  xpReward: 100 },
    { slug: "flawless",        title: "Flawless",          description: "Achieved a perfect 100% score.",               xpReward: 150 },
    { slug: "streak-3",        title: "Hat Trick",         description: "Practiced 3 days in a row.",                   xpReward: 75  },
    { slug: "streak-7",        title: "Week Warrior",      description: "Maintained a 7-day streak.",                   xpReward: 150 },
    { slug: "streak-30",       title: "Dedicated Mixer",   description: "Kept a 30-day streak alive.",                  xpReward: 500 },
    { slug: "level-5",         title: "Rising Star",       description: "Reached Level 5.",                             xpReward: 100 },
    { slug: "level-10",        title: "Pro DJ",            description: "Reached Level 10.",                            xpReward: 250 },
    { slug: "quiz-ace",        title: "Quiz Ace",          description: "Scored 100% on any quiz.",                     xpReward: 75  },
    { slug: "beginner-grad",   title: "Beginner Graduate", description: "Completed all 5 beginner modules.",            xpReward: 300 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: { title: a.title, description: a.description, xpReward: a.xpReward },
      create: a,
    });
  }

  console.log("✅ Seed complete — 5 modules, 17 lessons, 14 achievements");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
