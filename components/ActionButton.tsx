"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type ActionButtonProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    variant?: "primary" | "ghost" | "soft";
  }
>;

export function ActionButton({
  href,
  children,
  className,
  variant = "primary",
  ...props
}: ActionButtonProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2, scale: 1.01 }}
      whileTap={reduce ? undefined : { y: 1, scale: 0.98 }}
    >
      <Link
        href={href}
        className={cn(
          "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-starlight-pink",
          variant === "primary" &&
            "glass-button border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,159,230,0.48)_38%,rgba(130,199,255,0.52))] text-[#07101f] shadow-[0_18px_52px_rgba(255,159,230,0.28)] hover:shadow-[0_22px_68px_rgba(130,199,255,0.32)]",
          variant === "ghost" &&
            "glass-button border border-white/24 bg-white/10 text-white shadow-[0_12px_38px_rgba(255,159,230,0.1)] hover:border-white/42 hover:bg-white/16",
          variant === "soft" &&
            "glass-button border border-white/42 bg-white/78 text-[#101729] hover:bg-white/88",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}
