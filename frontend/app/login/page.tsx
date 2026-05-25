"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: "var(--accent)" }}
      />

      <div className="w-full max-w-sm relative animate-slide-up">
        {/* Header */}
        <div className="mb-10 text-center">
          <div
            className="w-10 h-10 rounded-lg mx-auto mb-6 flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-black font-bold font-mono">TF</span>
          </div>
          <h1 className="font-sans font-bold text-2xl text-text-primary tracking-tight">
            Welcome back
          </h1>
          <p className="font-mono text-sm text-text-muted mt-2">
            Sign in to your workspace
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-lg p-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && (
              <div
                className="font-mono text-xs text-danger px-4 py-3 rounded"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center font-mono text-xs text-text-muted mt-6">
          No account?{" "}
          <Link
            href="/register"
            className="text-accent hover:text-amber-400 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
