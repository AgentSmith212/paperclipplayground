import Link from "next/link";

const features = [
  {
    icon: "🎵",
    title: "Beat Matching",
    description: "Train your ear with real-time feedback on BPM sync and phase alignment.",
  },
  {
    icon: "🎛️",
    title: "Mixing Techniques",
    description: "Master EQ, filters, and transitions through structured video lessons.",
  },
  {
    icon: "🏆",
    title: "Earn XP & Badges",
    description: "Level up with every completed lesson. Compete on the leaderboard.",
  },
  {
    icon: "🎧",
    title: "Interactive Exercises",
    description: "Practice with real audio in the browser — no hardware required.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              color: "#a78bfa",
            }}
          >
            ⚡ Now in early access
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Learn to DJ.{" "}
            <span style={{ color: "var(--brand-primary)" }}>Level up.</span>
          </h1>

          <p className="text-xl mb-10" style={{ color: "var(--foreground-muted)" }}>
            Gamified DJ training that turns hours of practice into XP, badges,
            and real skills — all in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl text-lg font-bold transition-all hover:opacity-90 glow-violet"
              style={{ background: "var(--brand-primary)", color: "white" }}
            >
              Start for free →
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 rounded-xl text-lg font-medium transition-colors"
              style={{
                background: "var(--surface-elevated)",
                color: "var(--foreground-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Browse curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20 w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to become a DJ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-6 rounded-2xl"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4 py-20">
        <div
          className="inline-block max-w-2xl mx-auto px-8 py-12 rounded-3xl"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <h2 className="text-3xl font-black mb-4">Ready to drop your first beat?</h2>
          <p className="mb-8" style={{ color: "var(--foreground-muted)" }}>
            Join thousands of aspiring DJs and start earning XP today.
          </p>
          <Link
            href="/signup"
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90"
            style={{ background: "var(--brand-primary)", color: "white" }}
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}
