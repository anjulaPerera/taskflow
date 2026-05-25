"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { registerUser } from "@/lib/api";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await registerUser(email, password, name);
      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="fixed top-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "var(--accent)" }}
      />

      <div className="w-full max-w-sm relative animate-slide-up">
        <div className="mb-10 text-center">
          <div
            className="w-10 h-10 rounded-lg mx-auto mb-6 flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-black font-bold font-mono">TF</span>
          </div>
          <h1 className="font-sans font-bold text-2xl text-text-primary tracking-tight">
            Create account
          </h1>
          <p className="font-mono text-sm text-text-muted mt-2">
            Start managing your projects
          </p>
        </div>

        <div
          className="rounded-lg p-8"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="Anjula Perera"
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 6 characters"
              error={errors.password}
              autoComplete="new-password"
            />

            {errors.general && (
              <div
                className="font-mono text-xs text-danger px-4 py-3 rounded"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                {errors.general}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center font-mono text-xs text-text-muted mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-amber-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
