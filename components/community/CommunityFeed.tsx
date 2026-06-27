"use client";

import { useMemo, useState } from "react";
import { ChatCircleText, Heart, PaperPlaneTilt, PushPinSimple } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { canCreatePost, roleLabels } from "@/lib/auth";
import { categoryLabels } from "@/lib/data/community";
import type { CommunityCategory, CommunityPost, CommunityReply } from "@/lib/data/types";

export function CommunityFeed({ initialPosts }: { initialPosts: CommunityPost[] }) {
  const { role, ready } = useMockSession();
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("chat");
  const [pending, setPending] = useState(false);
  const [replyPending, setReplyPending] = useState<Record<string, boolean>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [posts]
  );

  async function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreatePost(role) || !content.trim()) return;

    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category
        })
      });
      const data = (await response.json()) as { data?: CommunityPost; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "发布失败");
      }

      setPosts((current) => [data.data!, ...current]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败");
    } finally {
      setPending(false);
    }
  }

  async function likePost(id: string) {
    if (!canCreatePost(role)) return;
    setError("");
    try {
      const response = await fetch(`/api/community/${id}/like`, { method: "POST" });
      const data = (await response.json()) as { likes?: number; error?: string };
      if (!response.ok || typeof data.likes !== "number") {
        throw new Error(data.error ?? "点赞失败");
      }
      setPosts((current) => current.map((item) => (item.id === id ? { ...item, likes: data.likes! } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "点赞失败");
    }
  }

  async function submitReply(event: React.FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    const content = replyDrafts[postId]?.trim();
    if (!canCreatePost(role) || !content) return;

    setReplyPending((current) => ({ ...current, [postId]: true }));
    setError("");
    try {
      const response = await fetch(`/api/community/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = (await response.json()) as {
        data?: CommunityReply;
        replies?: number;
        error?: string;
      };
      if (!response.ok || !data.data || typeof data.replies !== "number") {
        throw new Error(data.error ?? "回复失败");
      }

      setPosts((current) =>
        current.map((item) =>
          item.id === postId
            ? {
                ...item,
                replies: data.replies!,
                replyItems: [...(item.replyItems ?? []), data.data!]
              }
            : item
        )
      );
      setReplyDrafts((current) => ({ ...current, [postId]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "回复失败");
    } finally {
      setReplyPending((current) => ({ ...current, [postId]: false }));
    }
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

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3">
          <ChatCircleText size={26} className="text-dream-blue" />
          <div>
            <p className="text-sm text-sky-900/58">当前身份</p>
            <p className="text-2xl font-black">{ready ? roleLabels[role] : "读取中"}</p>
          </div>
        </div>

        {canCreatePost(role) ? (
          <form className="mt-6 grid gap-4" onSubmit={submitPost}>
            <label className="grid gap-2">
              <span className="field-label">标题</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="glass-input h-12 rounded-2xl px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="field-label">分区</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as CommunityCategory)}
                className="glass-input glass-select h-12 rounded-2xl px-4"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="field-label">内容</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                className="glass-input rounded-2xl px-4 py-3"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-5 font-bold text-[#07101f] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PaperPlaneTilt size={18} weight="fill" />
              {pending ? "发布中..." : "发布留言"}
            </button>
            {error ? <p className="text-sm text-starlight-pink">{error}</p> : null}
          </form>
        ) : (
          <div className="mt-6 rounded-[24px] border border-sky-200/60 bg-white/64 p-5">
            <p className="text-sm leading-7 text-sky-900/68">游客可以浏览公开留言，但不能发言、点赞或回复。</p>
            <div className="mt-5">
              <ActionButton href="/login">登录后发言</ActionButton>
            </div>
          </div>
        )}
      </GlassPanel>

      <div className="grid gap-4">
        {sortedPosts.map((post) => (
          <article
            key={post.id}
            className="surface-card hover-flip-card rounded-[28px] p-5 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-sky-900/58">
                <span className="font-semibold text-sky-950">{post.authorName}</span>
                <span>{categoryLabels[post.category]}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {post.pinned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-starlight-pink px-3 py-1 text-xs font-bold text-[#07101f]">
                  <PushPinSimple size={13} weight="fill" />
                  置顶
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 text-2xl font-bold">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-sky-900/68">{post.content}</p>
            <div className="mt-5 flex gap-3 text-sm text-sky-900/62">
              <button
                type="button"
                disabled={!canCreatePost(role)}
                onClick={() => void likePost(post.id)}
                className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Heart size={16} />
                {post.likes}
              </button>
              <span className="glass-chip inline-flex items-center rounded-full px-3 py-2">
                回复 {post.replies}
              </span>
            </div>
            {post.replyItems?.length ? (
              <div className="mt-5 grid gap-3 rounded-[22px] border border-sky-200/55 bg-white/58 p-4">
                {post.replyItems.map((reply) => (
                  <div key={reply.id} className="border-b border-sky-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-sky-900/50">
                      <span className="font-semibold text-sky-950/82">{reply.authorName}</span>
                      <span>{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-sky-900/70">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {canCreatePost(role) ? (
              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(event) => void submitReply(event, post.id)}>
                <input
                  value={replyDrafts[post.id] ?? ""}
                  onChange={(event) =>
                    setReplyDrafts((current) => ({ ...current, [post.id]: event.target.value }))
                  }
                  placeholder="写一条回复"
                  className="glass-input min-h-11 flex-1 rounded-full px-4 text-sm"
                />
                <button
                  type="submit"
                  disabled={replyPending[post.id] || !replyDrafts[post.id]?.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-sky-200/70 bg-white/72 px-4 text-sm font-semibold text-sky-950 shadow-[0_10px_24px_rgba(82,145,198,0.12)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PaperPlaneTilt size={16} weight="fill" />
                  {replyPending[post.id] ? "回复中" : "回复"}
                </button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
