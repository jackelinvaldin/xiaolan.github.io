"use client";

import { useCallback, useEffect, useState } from "react";
import { ChartBar, ImageSquare, MegaphoneSimple, PaperPlaneTilt, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { canAccessAdmin, roleLabels } from "@/lib/auth";
import { announcementTypeLabels } from "@/lib/data/announcements";
import type { Announcement, AnnouncementType, CommunityPost, User } from "@/lib/data/types";

type Overview = {
  counts: {
    announcements: number;
    communityPosts: number;
    users: number;
    galleryItems: number;
  };
  announcements: Announcement[];
  posts: CommunityPost[];
  users: User[];
};

const emptyOverview: Overview = {
  counts: {
    announcements: 0,
    communityPosts: 0,
    users: 0,
    galleryItems: 0
  },
  announcements: [],
  posts: [],
  users: []
};

export function AdminDashboard() {
  const { role, displayName, ready } = useMockSession();
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<AnnouncementType>("important");
  const [pinned, setPinned] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      const data = (await response.json()) as { data?: Overview; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "后台数据读取失败");
      }
      setOverview(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "后台数据读取失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready && canAccessAdmin(role)) {
      void loadOverview();
    }
  }, [loadOverview, ready, role]);

  if (!ready) return <GlassPanel className="p-8">正在读取管理员权限...</GlassPanel>;

  if (!canAccessAdmin(role)) {
    return (
      <GlassPanel className="mx-auto max-w-3xl p-8">
        <ShieldCheck size={36} className="text-starlight-pink" />
        <h1 className="mt-5 text-4xl font-black">管理员后台</h1>
        <p className="mt-4 text-base leading-8 text-white/66">
          当前身份是{roleLabels[role]}。此页面仅管理员可见，请登录你配置的管理员账号。
        </p>
        <div className="mt-7">
          <ActionButton href="/login">去登录</ActionButton>
        </div>
      </GlassPanel>
    );
  }

  const modules = [
    { title: "公告管理", count: overview.counts.announcements, icon: MegaphoneSimple },
    { title: "社区管理", count: overview.counts.communityPosts, icon: ChartBar },
    { title: "用户管理", count: overview.counts.users, icon: UsersThree },
    { title: "图片管理", count: overview.counts.galleryItems, icon: ImageSquare }
  ];

  async function submitAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          type,
          pinned
        })
      });
      const data = (await response.json()) as { data?: Announcement; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "公告发布失败");
      }

      setNotice("公告已发布，所有访客刷新后都可以看到。");
      setTitle("");
      setSummary("");
      setContent("");
      setPinned(false);
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "公告发布失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <GlassPanel className="p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-dream-blue">管理员：{displayName}</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">后台管理</h1>
          </div>
          <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-bold text-[#07101f]">
            权限已验证
          </span>
        </div>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <GlassPanel key={module.title} className="p-5">
              <Icon size={26} className="text-starlight-pink" />
              <p className="mt-4 text-sm text-white/54">{module.title}</p>
              <p className="mt-2 text-4xl font-black">{loading ? "..." : module.count}</p>
            </GlassPanel>
          );
        })}
      </div>

      <GlassPanel className="p-6">
        <div className="flex items-center gap-3">
          <MegaphoneSimple size={26} className="text-dream-blue" />
          <h2 className="text-2xl font-bold">发布公告</h2>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={submitAnnouncement}>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/78">标题</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition focus:border-starlight-pink"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/78">类型</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as AnnouncementType)}
                className="h-12 rounded-2xl border border-white/14 bg-[#151b31] px-4 text-white outline-none transition focus:border-starlight-pink"
              >
                {Object.entries(announcementTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white/78">摘要</span>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition focus:border-starlight-pink"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-white/78">正文</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={6}
              className="rounded-2xl border border-white/14 bg-white/[0.08] px-4 py-3 text-white outline-none transition focus:border-starlight-pink"
            />
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-white/72">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
              className="size-4 accent-starlight-pink"
            />
            置顶公告
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-5 font-bold text-[#07101f] transition disabled:cursor-not-allowed disabled:opacity-60 md:w-fit"
          >
            <PaperPlaneTilt size={18} weight="fill" />
            {pending ? "发布中..." : "发布公告"}
          </button>
          {notice ? <p className="text-sm text-emerald-200">{notice}</p> : null}
          {error ? <p className="text-sm text-starlight-pink">{error}</p> : null}
        </form>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <ManagementTable
          title="公告管理"
          rows={overview.announcements.map((item) => [item.title, item.authorName, formatDate(item.publishedAt)])}
          headings={["标题", "发布人", "时间"]}
        />
        <ManagementTable
          title="社区管理"
          rows={overview.posts.map((item) => [item.title ?? "无标题", item.authorName, item.category])}
          headings={["帖子", "作者", "分区"]}
        />
        <ManagementTable
          title="用户管理"
          rows={overview.users.map((item) => [item.displayName, item.username, roleLabels[item.role]])}
          headings={["昵称", "账号", "身份"]}
        />
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function ManagementTable({
  title,
  headings,
  rows
}: {
  title: string;
  headings: string[];
  rows: string[][];
}) {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-white/[0.06] text-white/58">
            <tr>
              {headings.map((heading) => (
                <th key={heading} className="px-5 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-white/8 text-white/72">
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="px-5 py-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-t border-white/8 text-white/54">
                <td className="px-5 py-4" colSpan={headings.length}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
