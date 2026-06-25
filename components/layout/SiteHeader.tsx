"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, House, List, MagnifyingGlass, UserCircle, X } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/data/site";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/team", label: "团队" },
  { href: "/server", label: "服务器" },
  { href: "/community", label: "社区" },
  { href: "/announcements", label: "公告" },
  { href: "/profile", label: "个人空间" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-full border border-white/18 bg-[#0b1020]/64 px-4 shadow-[0_14px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-white text-[#0b1020] shadow-[0_0_30px_rgba(255,159,230,0.32)]">
            <House size={18} weight="fill" />
          </span>
          <span className="hidden text-base font-bold tracking-wide sm:block">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white",
                  active &&
                    "border border-white/18 bg-white/14 !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-white/18"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="搜索"
            className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white/78 transition hover:bg-white/14 hover:text-white"
          >
            <MagnifyingGlass size={18} />
          </button>
          <button
            type="button"
            aria-label="通知"
            className="grid size-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white/78 transition hover:bg-white/14 hover:text-white"
          >
            <Bell size={18} />
          </button>
          <Link
            href="/login"
            aria-label="用户头像"
            className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,#82c7ff,#ff9fe6)] text-[#0b1020]"
          >
            <UserCircle size={22} weight="fill" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          className="grid size-10 place-items-center rounded-full border border-white/14 bg-white/8 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/16 bg-[#0b1020]/92 p-3 shadow-[0_18px_70px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm text-white/72",
                    active && "bg-white/14 !text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
