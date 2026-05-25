"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2 
    font-mono text-sm font-medium tracking-wider uppercase
    px-5 py-2.5 rounded
    transition-all duration-200
    disabled:opacity-40 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
  `;

  const variants = {
    primary: `
      bg-accent text-black 
      hover:bg-amber-400 
      active:scale-[0.98]
    `,
    secondary: `
      bg-transparent text-text-primary 
      border border-border-bright
      hover:bg-bg-hover hover:border-accent
    `,
    danger: `
      bg-transparent text-danger 
      border border-danger/30
      hover:bg-danger/10
    `,
    ghost: `
      bg-transparent text-text-secondary 
      hover:text-text-primary hover:bg-bg-hover
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
