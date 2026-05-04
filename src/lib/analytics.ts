const SESSION_KEY = "dja_session";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, properties, sessionId: getSessionId() }),
  }).catch(() => {});
}
