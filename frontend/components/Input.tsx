"use client";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  autoComplete,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs uppercase tracking-widest text-text-secondary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full bg-bg-secondary text-text-primary
          border rounded px-4 py-3
          font-mono text-sm
          placeholder:text-text-muted
          transition-colors duration-200
          focus:outline-none focus:ring-0
          disabled:opacity-40
          ${
            error
              ? "border-danger focus:border-danger"
              : "border-border-dim focus:border-accent"
          }
        `}
      />
      {error && <span className="font-mono text-xs text-danger">{error}</span>}
    </div>
  );
}
