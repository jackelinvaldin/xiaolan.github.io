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
            "bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] text-[#07101f] shadow-[0_16px_42px_rgba(255,159,230,0.28)] hover:shadow-[0_18px_52px_rgba(130,199,255,0.32)]",
          variant === "ghost" &&
            "border border-white/20 bg-white/8 text-white hover:border-white/34 hover:bg-white/13",
          variant === "soft" && "bg-white text-[#101729] hover:bg-[#e9f6ff]",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
}
