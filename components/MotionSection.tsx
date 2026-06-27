import type { CSSProperties, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type MotionSectionProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  return (
    <section
      className={cn("reveal-on-scroll", className)}
      style={delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </section>
  );
}
