"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChartBar,
  Eye,
  EyeSlash,
  ImageSquare,
  MagnifyingGlass,
  MegaphoneSimple,
  NotePencil,
  PaperPlaneTilt,
  ShieldCheck,
  Trash,
  UsersThree
} from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { canAccessAdmin, roleLabels } from "@/lib/auth";
import { announcements as mockAnnouncements, announcementTypeLabels } from "@/lib/data/announcements";
import { categoryLabels, communityPosts as mockPosts } from "@/lib/data/community";
import { serverGallery } from "@/lib/data/server-gallery";
import type { Announcement, AnnouncementType, CommunityPost, User } from "@/lib/data/types";
import { users as mockUsers } from "@/lib/data/users";

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

type Mode = "database" | "demo";

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

const demoOverview: Overview = {
  counts: {
    announcements: mockAnnouncements.length,
    communityPosts: mockPosts.length,
    users: mockUsers.length,
    galleryItems: serverGallery.length
  },
  announcements: mockAnnouncements,
  posts: mockPosts,
  users: mockUsers
};

export function AdminDashboard() {
  const { role, displayName, ready } = useMockSession();
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [mode, setMode] = useState<Mode>("database");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<AnnouncementType>("important");
  const [pinned, setPinned] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announcementQuery, setAnnouncementQuery] = useState("");
  const [postQuery, setPostQuery] = useState("");
  const [activePostId, setActivePostId] = useState<string | null>(null);

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
      setMode("database");
    } catch (err) {
      setOverview(demoOverview);
      setMode("demo");
      setError(err instanceof Error ? `${err.message}，已切换为当前页面演示数据。` : "已切换为当前页面演示数据。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready && canAccessAdmin(role)) {
      void loadOverview();
    }
  }, [loadOverview, ready, role]);

  const filteredAnnouncements = useMemo(() => {
    const keyword = announcementQuery.trim().toLowerCase();
    if (!keyword) return overview.announcements;
    return overview.announcements.filter((item) =>
      `${item.title} ${item.summary} ${announcementTypeLabels[item.type]}`.toLowerCase().includes(keyword)
    );
  }, [announcementQuery, overview.announcements]);

  const filteredPosts = useMemo(() => {
    const keyword = postQuery.trim().toLowerCase();
    if (!keyword) return overview.posts;
    return overview.posts.filter((item) =>
      `${item.title ?? ""} ${item.content} ${item.authorName} ${categoryLabels[item.category]} ${item.visibility}`
        .toLowerCase()
        .includes(keyword)
    );
  }, [overview.posts, postQuery]);

  if (!ready) return <GlassPanel className="p-8">正在读取管理员权限...</GlassPanel>;

  if (!canAccessAdmin(role)) {
    return (
      <GlassPanel className="mx-auto max-w-3xl p-8">
        <ShieldCheck size={36} className="text-starlight-pink" />
        <h1 className="mt-5 text-4xl font-black text-sky-950">管理员后台</h1>
        <p className="mt-4 text-base leading-8 text-sky-900/68">
          当前身份是{roleLabels[role]}。此页面仅管理员可见，请登录你配置的管理员账号。
        </p>
        <div className="mt-7">
          <ActionButton href="/login">去登录</ActionButton>
        </div>
      </GlassPanel>
    );
  }

  const modules = [
    { title: "公告管理", count: overview.counts.announcements, icon: MegaphoneSimple, href: "#announcements" },
    { title: "社区留言管理", count: overview.counts.communityPosts, icon: ChartBar, href: "#posts" },
    { title: "用户 / 成员", count: overview.counts.users, icon: UsersThree, href: "#users" },
    { title: "服务器展示", count: overview.counts.galleryItems, icon: ImageSquare, href: "#server-content" }
  ];

  function resetAnnouncementForm() {
    setTitle("");
    setSummary("");
    setContent("");
    setType("important");
    setPinned(false);
    setEditingAnnouncement(null);
  }

  function startEditAnnouncement(item: Announcement) {
    setEditingAnnouncement(item);
    setTitle(item.title);
    setSummary(item.summary);
    setContent(item.content);
    setType(item.type);
    setPinned(Boolean(item.pinned));
    setNotice("");
    setError("");
  }

  async function submitAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setNotice("");

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      type,
      pinned
    };

    try {
      if (mode === "demo") {
        const localAnnouncement: Announcement = {
          id: editingAnnouncement?.id ?? `demo-${Date.now()}`,
          slug: editingAnnouncement?.slug ?? `demo-${Date.now()}`,
          authorName: displayName,
          publishedAt: editingAnnouncement?.publishedAt ?? new Date().toISOString(),
          ...payload
        };
        setOverview((current) => {
          const announcements = editingAnnouncement
            ? current.announcements.map((item) => (item.id === editingAnnouncement.id ? localAnnouncement : item))
            : [localAnnouncement, ...current.announcements];
          return {
            ...current,
            announcements,
            counts: { ...current.counts, announcements: announcements.length }
          };
        });
        setNotice(editingAnnouncement ? "演示模式：公告已更新。" : "演示模式：公告已新增。");
        resetAnnouncementForm();
        return;
      }

      const endpoint = editingAnnouncement ? `/api/announcements/${editingAnnouncement.id}` : "/api/announcements";
      const response = await fetch(endpoint, {
        method: editingAnnouncement ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as { data?: Announcement; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "公告保存失败");
      }

      setNotice(editingAnnouncement ? "公告已更新。" : "公告已发布，所有访客刷新后都可以看到。");
      resetAnnouncementForm();
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "公告保存失败");
    } finally {
      setPending(false);
    }
  }

  async function deleteAnnouncement(item: Announcement) {
    setPending(true);
    setError("");
    setNotice("");
    try {
      if (mode === "demo") {
        setOverview((current) => {
          const announcements = current.announcements.filter((entry) => entry.id !== item.id);
          return {
            ...current,
            announcements,
            counts: { ...current.counts, announcements: announcements.length }
          };
        });
        setNotice("演示模式：公告已删除。");
        return;
      }

      const response = await fetch(`/api/announcements/${item.id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "删除公告失败");
      }
      setNotice("公告已删除。");
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除公告失败");
    } finally {
      setPending(false);
    }
  }

  async function togglePostVisibility(item: CommunityPost) {
    const nextVisibility = item.visibility === "public" ? "private" : "public";
    setActivePostId(item.id);
    setError("");
    setNotice("");
    try {
      if (mode === "demo") {
        setOverview((current) => ({
          ...current,
          posts: current.posts.map((post) => (post.id === item.id ? { ...post, visibility: nextVisibility } : post))
        }));
        setNotice(nextVisibility === "public" ? "演示模式：留言已显示。" : "演示模式：留言已隐藏。");
        return;
      }

      const response = await fetch(`/api/community/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: nextVisibility })
      });
      const data = (await response.json()) as { data?: CommunityPost; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "留言状态更新失败");
      }
      setNotice(nextVisibility === "public" ? "留言已显示。" : "留言已隐藏。");
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "留言状态更新失败");
    } finally {
      setActivePostId(null);
    }
  }

  async function deletePost(item: CommunityPost) {
    setActivePostId(item.id);
    setError("");
    setNotice("");
    try {
      if (mode === "demo") {
        setOverview((current) => {
          const posts = current.posts.filter((post) => post.id !== item.id);
          return {
            ...current,
            posts,
            counts: { ...current.counts, communityPosts: posts.length }
          };
        });
        setNotice("演示模式：留言已删除。");
        return;
      }

      const response = await fetch(`/api/community/${item.id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "删除留言失败");
      }
      setNotice("留言已删除。");
      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除留言失败");
    } finally {
      setActivePostId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <GlassPanel className="p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-700">管理员：{displayName}</p>
            <h1 className="mt-2 text-4xl font-black text-sky-950 md:text-6xl">后台管理</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-900/66">
              用于维护公告、社区留言、成员信息和服务器展示入口。界面保持实用，不改动当前数据库结构。
            </p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">
            {mode === "demo" ? "演示模式" : "数据库已连接"}
          </span>
        </div>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <a
              key={module.title}
              href={module.href}
              className="glass-panel hover-flip-card rounded-[28px] p-5"
            >
              <Icon size={26} className="text-starlight-pink" />
              <p className="mt-4 text-sm font-semibold text-sky-900/62">{module.title}</p>
              <p className="mt-2 text-4xl font-black text-sky-950">{loading ? "..." : module.count}</p>
            </a>
          );
        })}
      </div>

      {(notice || error) && (
        <div className="grid gap-3">
          {notice ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}
        </div>
      )}

      <GlassPanel id="announcements" className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <MegaphoneSimple size={26} className="text-dream-blue" />
              <h2 className="text-2xl font-bold text-sky-950">
                {editingAnnouncement ? "编辑公告" : "新增公告"}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-sky-900/64">
              公告会显示在公告页和首页最新公告区域，置顶公告会优先排序。
            </p>
          </div>
          {editingAnnouncement ? (
            <button
              type="button"
              className="rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-white"
              onClick={resetAnnouncementForm}
            >
              取消编辑
            </button>
          ) : null}
        </div>

        <form className="mt-5 grid gap-4" onSubmit={submitAnnouncement}>
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <label className="grid gap-2">
              <span className="field-label">标题</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="glass-input h-12 rounded-2xl px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="field-label">类型</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as AnnouncementType)}
                className="glass-input glass-select h-12 rounded-2xl px-4"
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
            <span className="field-label">摘要</span>
            <input
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              required
              className="glass-input h-12 rounded-2xl px-4"
            />
          </label>
          <label className="grid gap-2">
            <span className="field-label">正文</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={6}
              className="glass-input rounded-2xl px-4 py-3"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-3 rounded-full border border-sky-200/70 bg-white/64 px-4 py-2 text-sm font-semibold text-sky-900">
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-5 font-bold text-[#07101f] shadow-[0_14px_32px_rgba(255,159,230,0.22)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PaperPlaneTilt size={18} weight="fill" />
              {pending ? "保存中..." : editingAnnouncement ? "保存修改" : "发布公告"}
            </button>
          </div>
        </form>
      </GlassPanel>

      <GlassPanel className="overflow-hidden">
        <PanelHeader
          title="公告管理"
          description="支持按标题、摘要或类型查询，点击标题可预览详情。"
          query={announcementQuery}
          onQueryChange={setAnnouncementQuery}
          placeholder="搜索公告标题或类型"
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-y border-sky-100 bg-sky-50/74 text-sky-900/62">
              <tr>
                <th className="px-5 py-3 font-semibold">标题</th>
                <th className="px-5 py-3 font-semibold">类型</th>
                <th className="px-5 py-3 font-semibold">发布人</th>
                <th className="px-5 py-3 font-semibold">时间</th>
                <th className="px-5 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.length ? (
                filteredAnnouncements.map((item) => (
                  <tr key={item.id} className="border-t border-sky-100/80 text-sky-900/72">
                    <td className="px-5 py-4">
                      <Link href={`/announcements/${item.slug || item.id}`} className="font-bold text-sky-950 hover:text-sky-700">
                        {item.title}
                      </Link>
                      <p className="mt-1 line-clamp-1 text-xs text-sky-900/54">{item.summary}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="glass-chip rounded-full px-3 py-1 text-xs font-semibold">
                        {announcementTypeLabels[item.type]}
                      </span>
                    </td>
                    <td className="px-5 py-4">{item.authorName}</td>
                    <td className="px-5 py-4">{formatDate(item.publishedAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="admin-icon-button"
                          aria-label="编辑公告"
                          onClick={() => startEditAnnouncement(item)}
                        >
                          <NotePencil size={17} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button danger"
                          aria-label="删除公告"
                          disabled={pending}
                          onClick={() => void deleteAnnouncement(item)}
                        >
                          <Trash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={5} text="没有找到公告" />
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <GlassPanel id="posts" className="overflow-hidden">
        <PanelHeader
          title="社区留言管理"
          description="可以按关键词查询留言，隐藏后的留言不会出现在公开社区列表。"
          query={postQuery}
          onQueryChange={setPostQuery}
          placeholder="搜索留言、作者或分区"
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-y border-sky-100 bg-sky-50/74 text-sky-900/62">
              <tr>
                <th className="px-5 py-3 font-semibold">留言</th>
                <th className="px-5 py-3 font-semibold">作者</th>
                <th className="px-5 py-3 font-semibold">分区</th>
                <th className="px-5 py-3 font-semibold">状态</th>
                <th className="px-5 py-3 text-right font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length ? (
                filteredPosts.map((item) => (
                  <tr key={item.id} className="border-t border-sky-100/80 text-sky-900/72">
                    <td className="px-5 py-4">
                      <p className="font-bold text-sky-950">{item.title ?? "社区留言"}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-sky-900/56">{item.content}</p>
                    </td>
                    <td className="px-5 py-4">{item.authorName}</td>
                    <td className="px-5 py-4">{categoryLabels[item.category]}</td>
                    <td className="px-5 py-4">
                      <span className="glass-chip rounded-full px-3 py-1 text-xs font-semibold">
                        {item.visibility === "public" ? "显示中" : "已隐藏"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="admin-icon-button"
                          aria-label={item.visibility === "public" ? "隐藏留言" : "显示留言"}
                          disabled={activePostId === item.id}
                          onClick={() => void togglePostVisibility(item)}
                        >
                          {item.visibility === "public" ? <EyeSlash size={17} /> : <Eye size={17} />}
                        </button>
                        <button
                          type="button"
                          className="admin-icon-button danger"
                          aria-label="删除留言"
                          disabled={activePostId === item.id}
                          onClick={() => void deletePost(item)}
                        >
                          <Trash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyRow colSpan={5} text="没有找到留言" />
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel id="users" className="overflow-hidden">
          <div className="border-b border-sky-100 p-5">
            <h2 className="text-2xl font-bold text-sky-950">用户 / 成员信息</h2>
            <p className="mt-2 text-sm text-sky-900/62">展示当前注册用户和成员身份，后续可继续接入禁用或角色调整。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-sky-100 bg-sky-50/74 text-sky-900/62">
                <tr>
                  <th className="px-5 py-3 font-semibold">昵称</th>
                  <th className="px-5 py-3 font-semibold">账号</th>
                  <th className="px-5 py-3 font-semibold">身份</th>
                </tr>
              </thead>
              <tbody>
                {overview.users.length ? (
                  overview.users.map((item) => (
                    <tr key={item.id} className="border-t border-sky-100/80 text-sky-900/72">
                      <td className="px-5 py-4 font-bold text-sky-950">{item.displayName}</td>
                      <td className="px-5 py-4">{item.username}</td>
                      <td className="px-5 py-4">{roleLabels[item.role]}</td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={3} text="暂无用户" />
                )}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        <GlassPanel id="server-content" className="p-6">
          <ImageSquare size={28} className="text-starlight-pink" />
          <h2 className="mt-4 text-2xl font-bold text-sky-950">服务器展示内容入口</h2>
          <p className="mt-3 text-sm leading-7 text-sky-900/66">
            当前相册与地图内容沿用现有数据，不调整数据库结构。可以从这里进入对应页面检查展示效果。
          </p>
          <div className="mt-6 grid gap-3">
            <Link
              href="/server/gallery"
              className="rounded-2xl border border-sky-200/70 bg-white/70 p-4 font-semibold text-sky-950 transition hover:bg-white"
            >
              服务器相册：{overview.counts.galleryItems} 项
            </Link>
            <Link
              href="/server/maps"
              className="rounded-2xl border border-sky-200/70 bg-white/70 p-4 font-semibold text-sky-950 transition hover:bg-white"
            >
              地图档案入口
            </Link>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function PanelHeader({
  title,
  description,
  query,
  onQueryChange,
  placeholder
}: {
  title: string;
  description: string;
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="grid gap-4 border-b border-sky-100 p-5 lg:grid-cols-[1fr_320px] lg:items-center">
      <div>
        <h2 className="text-2xl font-bold text-sky-950">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-sky-900/62">{description}</p>
      </div>
      <label className="relative">
        <MagnifyingGlass size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-700/70" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="glass-input h-12 w-full rounded-full pl-11 pr-4 text-sm"
        />
      </label>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr className="border-t border-sky-100/80 text-sky-900/54">
      <td className="px-5 py-6 text-center" colSpan={colSpan}>
        {text}
      </td>
    </tr>
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
