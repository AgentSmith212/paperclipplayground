"use client";

import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="alert"
      style={{
        background: "#f97316",
        color: "#fff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "0.875rem",
        fontWeight: 600,
      }}
    >
      You&apos;re offline — audio exercises may not work until you reconnect.
    </div>
  );
}
