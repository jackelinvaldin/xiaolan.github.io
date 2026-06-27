"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, MagnifyingGlass, MapTrifold, UsersThree, X } from "@phosphor-icons/react";
import { announcements } from "@/lib/data/announcements";
import { communityPosts } from "@/lib/data/community";
import { serverGallery } from "@/lib/data/server-gallery";
import { teamMembers } from "@/lib/data/team";
import { cn } from "@/lib/utils";

const pageItems = [
  { title: "首页", description: "琢光绮梦官网入口", href: "/", type: "页面" },
  { title: "团队介绍", description: "开发者与成员名单", href: "/team", type: "页面" },
  { title: "服务器专区", description: "服务器沉浸式展示", href: "/server", type: "页面" },
  { title: "社区发言区", description: "玩家留言、点赞和回复", href: "/community", type: "页面" },
  { title: "公告列表", description: "维护、活动和更新通知", href: "/announcements", type: "页面" },
  { title: "个人空间", description: "成员动态和收藏入口", href: "/profile", type: "页面" }
];

const searchItems = [
  ...pageItems,
  ...announcements.map((item) => ({
    title: item.title,
    description: item.summary,
    href: `/announcements/${item.slug}`,
    type: "公告"
  })),
  ...communityPosts.map((item) => ({
    title: item.title ?? "社区留言",
    description: item.content,
    href: "/community",
    type: "社区"
  })),
  ...serverGallery.map((item) => ({
    title: item.title,
    description: item.description,
    href: "/server/gallery",
    type: "服务器展示"
  })),
  ...teamMembers.map((item) => ({
    title: item.displayName,
    description: `${item.role}，${item.description}`,
    href: "/team",
    type: "成员"
  }))
];

const icons = {
  页面: FileText,
  公告: FileText,
  社区: MagnifyingGlass,
  服务器展示: MapTrifold,
  成员: UsersThree
};

export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return searchItems.slice(0, 8);
    return searchItems
      .filter((item) => `${item.title} ${item.description} ${item.type}`.toLowerCase().includes(keyword))
      .slice(0, 10);
  }, [query]);

  return (
    <>
      <button
        type="button"
        aria-label="搜索"
        className={cn(
          "grid size-10 place-items-center rounded-full border border-sky-200/80 bg-white/72 text-sky-900 shadow-[0_10px_30px_rgba(86,153,205,0.14)] backdrop-blur-xl transition hover:bg-white",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlass size={18} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-sky-950/18 px-4 py-24 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-white/80 bg-white/92 text-sky-950 shadow-[0_30px_90px_rgba(60,130,185,0.26)]">
            <div className="flex items-center gap-3 border-b border-sky-100 p-4">
              <MagnifyingGlass size={22} className="text-sky-600" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索公告、社区、服务器、团队"
                className="h-11 flex-1 bg-transparent text-base outline-none placeholder:text-sky-900/38"
              />
              <button
                type="button"
                aria-label="关闭搜索"
                className="grid size-10 place-items-center rounded-full bg-sky-50 text-sky-900 transition hover:bg-sky-100"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {results.length ? (
                <div className="grid gap-2">
                  {results.map((item) => {
                    const Icon = icons[item.type as keyof typeof icons] ?? FileText;
                    return (
                      <Link
                        key={`${item.type}-${item.href}-${item.title}`}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group grid grid-cols-[44px_1fr] gap-3 rounded-[20px] p-3 transition hover:bg-sky-50"
                      >
                        <span className="grid size-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d9f1ff,#ffe4f3)] text-sky-800">
                          <Icon size={20} weight="fill" />
                        </span>
                        <span>
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sky-950">{item.title}</span>
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
                              {item.type}
                            </span>
                          </span>
                          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-sky-900/62">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="grid place-items-center rounded-[22px] bg-sky-50 px-6 py-12 text-center">
                  <p className="text-lg font-bold text-sky-950">没有找到相关内容</p>
                  <p className="mt-2 text-sm text-sky-900/58">换个关键词试试，例如公告、星环、成员或地图。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
