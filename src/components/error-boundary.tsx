"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-4 text-center gap-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-sm max-w-sm" style={{ color: "var(--foreground-muted)" }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--brand-primary)", color: "white" }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
