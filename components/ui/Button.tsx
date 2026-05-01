import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "gold" | "white";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variants = {
  primary:
    "bg-theme-bg text-theme-on-bg hover:bg-theme-bg-deep border-2 border-theme-bg",
  outline:
    "bg-transparent text-theme-fg border-2 border-theme-bg hover:bg-theme-bg hover:text-theme-on-bg",
  gold: "bg-[#c9a84c] text-white hover:bg-[#b8943d] border-2 border-[#c9a84c]",
  white:
    "bg-white text-theme-fg border-2 border-white hover:bg-transparent hover:text-theme-on-bg",
};

const sizes = {
  sm: "px-5 py-2 text-sm",
  md: "px-7 py-3 text-sm",
  lg: "px-10 py-4 text-base",
};

export default function Button({
  href,
  onClick,
  variant = "gold",
  size = "md",
  children,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-semibold uppercase tracking-wider transition-all duration-300 rounded-sm cursor-pointer";
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
