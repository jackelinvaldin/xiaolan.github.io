import Link from "next/link";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
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
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-px active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-starlight-pink",
        variant === "primary" &&
          "glass-button border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,159,230,0.48)_38%,rgba(130,199,255,0.52))] text-[#07101f] shadow-[0_18px_52px_rgba(255,159,230,0.28)] hover:shadow-[0_22px_68px_rgba(130,199,255,0.32)]",
        variant === "ghost" &&
          "glass-button border border-sky-200/70 bg-white/58 text-sky-950 shadow-[0_12px_38px_rgba(96,160,210,0.13)] hover:border-white hover:bg-white/78",
        variant === "soft" &&
          "glass-button border border-white/42 bg-white/78 text-[#101729] hover:bg-white/88",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
