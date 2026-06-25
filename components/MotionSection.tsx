"use client";

import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type MotionSectionProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
