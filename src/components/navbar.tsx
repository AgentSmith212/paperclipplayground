"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/achievements", label: "Achievements" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLevel, setUserLevel] = useState<number>(1);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch real user level when session exists
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((data) => setUserLevel(data.level ?? 1))
      .catch(() => {});
  }, [session]);

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menu on route change (render-phase reset avoids cascading effect)
  const prevPathnameRef = useRef(pathname);
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    setMenuOpen(false);
  }

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
          <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
            <span className="text-2xl">🎧</span>
            <span style={{ color: "var(--brand-primary)" }}>DJ</span>
            <span>Academy</span>
          </Link>

          {/* Desktop nav links */}
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

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <span
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    color: "var(--brand-accent)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                  }}
                >
                  ⚡ Level {userLevel}
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
                  style={{ background: "var(--brand-primary)", color: "white" }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: level pill + hamburger */}
          <div className="flex md:hidden items-center gap-2" ref={menuRef}>
            {session && (
              <span
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "var(--brand-accent)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                }}
              >
                ⚡ {userLevel}
              </span>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg transition-colors"
              style={{
                background: menuOpen ? "var(--surface-elevated)" : "transparent",
                color: "var(--foreground)",
              }}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
              <div
                className="absolute top-16 left-0 right-0 border-b flex flex-col"
                style={{
                  background: "rgba(15, 15, 15, 0.98)",
                  backdropFilter: "blur(12px)",
                  borderColor: "var(--border)",
                }}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-6 py-4 text-sm font-medium border-b transition-colors hover:bg-white/5"
                    style={{
                      color: pathname?.startsWith(link.href) ? "white" : "var(--foreground-muted)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-6 py-4 flex flex-col gap-3">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium"
                        style={{ color: "var(--foreground-muted)" }}
                      >
                        👤 {session.user?.name?.split(" ")[0] ?? "Dashboard"}
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-sm text-left"
                        style={{ color: "var(--foreground-muted)" }}
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
                        className="text-sm font-semibold px-4 py-2 rounded-lg text-center transition-all hover:opacity-90"
                        style={{ background: "var(--brand-primary)", color: "white" }}
                      >
                        Get started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
