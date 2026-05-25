"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      style={{ borderBottom: "1px solid var(--border)" }}
      className="bg-bg-primary sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div
            className="w-6 h-6 rounded-sm flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-black text-xs font-bold font-mono">TF</span>
          </div>
          <span className="font-sans font-bold text-sm tracking-widest uppercase text-text-primary">
            TaskFlow
          </span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-text-muted hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
