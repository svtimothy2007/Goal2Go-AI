import React from "react";

const VARIANTS = {
  primary:
    "bg-signal text-base hover:bg-signal-glow shadow-glow disabled:opacity-40 disabled:shadow-none",
  secondary:
    "bg-surface-alt text-ink border border-surface-border hover:border-signal/50 disabled:opacity-40",
  ghost:
    "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-alt disabled:opacity-40",
  success:
    "bg-okgreen text-base hover:brightness-110 disabled:opacity-40",
  danger:
    "bg-alert text-base hover:brightness-110 disabled:opacity-40",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}) {
  const sizeCls =
    size === "sm"
      ? "text-xs px-3 py-1.5 gap-1.5"
      : size === "lg"
      ? "text-base px-6 py-3 gap-2.5"
      : "text-sm px-4 py-2.5 gap-2";

  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
        "disabled:cursor-not-allowed",
        sizeCls,
        VARIANTS[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
