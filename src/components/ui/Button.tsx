import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-terracotta text-white hover:bg-coral"
      : "border border-terracotta/40 text-cocoa hover:border-terracotta hover:bg-linen";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 ${classes}`}
      href={href}
    >
      {children}
    </Link>
  );
}
