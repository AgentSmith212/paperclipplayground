"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(15, 15, 15, 0.9)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🎧</span>
            <span style={{ color: "var(--brand-primary)" }}>DJ</span>
            <span>Academy</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{
                  color: pathname?.startsWith(link.href)
                    ? "white"
                    : "var(--foreground-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* XP pill */}
                <span
                  className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "var(--brand-accent)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                  }}
                >
                  ⚡ Level {1}
                </span>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {session.user?.name?.split(" ")[0] ?? "Dashboard"}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: "var(--surface-elevated)",
                    color: "var(--foreground-muted)",
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: "var(--brand-primary)",
                    color: "white",
                  }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
