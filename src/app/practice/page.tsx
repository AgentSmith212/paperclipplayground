export default function PracticePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-2">Practice Mode</h1>
      <p className="mb-10" style={{ color: "var(--foreground-muted)" }}>
        Interactive beat-matching exercises — coming in Phase 1.
      </p>

      <div
        className="text-center py-24 rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(124,58,237,0.3)",
        }}
      >
        <p className="text-5xl mb-4">🎛️</p>
        <p className="text-xl font-bold mb-2">Beat Matcher — Coming Soon</p>
        <p style={{ color: "var(--foreground-muted)" }}>
          We&apos;re building the Web Audio API engine. Complete some lessons first to earn XP.
        </p>
      </div>
    </div>
  );
}
