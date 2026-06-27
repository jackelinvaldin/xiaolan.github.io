import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <div className={cn("glass-panel hover-flip-card rounded-[28px]", className)} {...props}>
      {children}
    </div>
  );
}
