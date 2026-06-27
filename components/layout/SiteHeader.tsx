"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Bell, House, List, UserCircle, X } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteName } from "@/lib/data/site";
import { SiteSearch } from "@/components/layout/SiteSearch";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-full border border-white/75 bg-white/78 px-4 text-sky-950 shadow-[0_16px_46px_rgba(72,142,195,0.18)] backdrop-blur-2xl">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,#d5f0ff,#ffe2f4)] text-sky-950 shadow-[0_0_30px_rgba(105,175,226,0.26)]">
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
                  "rounded-full px-4 py-2 text-sm text-sky-900/70 transition hover:bg-sky-50 hover:text-sky-950",
                  active &&
                    "border border-sky-200 bg-white !text-sky-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-white"
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
            aria-label="返回上一步"
            title="返回上一步"
            className="grid size-10 place-items-center rounded-full border border-sky-200/80 bg-white/72 text-sky-900 shadow-[0_10px_30px_rgba(86,153,205,0.12)] transition hover:bg-white"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <SiteSearch />
          <button
            type="button"
            aria-label="通知"
            className="grid size-10 place-items-center rounded-full border border-sky-200/80 bg-white/72 text-sky-900 transition hover:bg-white"
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

        <div className="ml-auto mr-2 flex items-center gap-2 sm:hidden">
          <button
            type="button"
            aria-label="返回上一步"
            title="返回上一步"
            className="grid size-10 place-items-center rounded-full border border-sky-200 bg-white/70 text-sky-950"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </button>
          <SiteSearch />
        </div>
        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          className="grid size-10 place-items-center rounded-full border border-sky-200 bg-white/70 text-sky-950 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-white/75 bg-white/90 p-3 text-sky-950 shadow-[0_18px_70px_rgba(72,142,195,0.22)] backdrop-blur-2xl lg:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm text-sky-900/72",
                    active && "bg-sky-50 !text-sky-950"
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
