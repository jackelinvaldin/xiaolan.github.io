"use client";

import { useMemo, useState } from "react";
import { ChatCircleText, Heart, PaperPlaneTilt, PushPinSimple } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { canCreatePost, roleLabels } from "@/lib/auth";
import { categoryLabels } from "@/lib/data/community";
import type { CommunityCategory, CommunityPost } from "@/lib/data/types";

export function CommunityFeed({ initialPosts }: { initialPosts: CommunityPost[] }) {
  const { role, displayName, ready } = useMockSession();
  const [posts, setPosts] = useState(initialPosts);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("chat");

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [posts]
  );

  function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreatePost(role) || !content.trim()) return;

    const post: CommunityPost = {
      id: `local-${Date.now()}`,
      authorId: "local",
      authorName: displayName,
      title: title.trim() || "新的社区留言",
      content: content.trim(),
      category,
      visibility: "public",
      likes: 0,
      replies: 0,
      createdAt: "刚刚"
    };

    setPosts((current) => [post, ...current]);
    setTitle("");
    setContent("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <GlassPanel className="p-6">
        <div className="flex items-center gap-3">
          <ChatCircleText size={26} className="text-dream-blue" />
          <div>
            <p className="text-sm text-white/52">当前身份</p>
            <p className="text-2xl font-black">{ready ? roleLabels[role] : "读取中"}</p>
          </div>
        </div>

        {canCreatePost(role) ? (
          <form className="mt-6 grid gap-4" onSubmit={submitPost}>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/78">标题</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition focus:border-starlight-pink"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/78">分区</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as CommunityCategory)}
                className="h-12 rounded-2xl border border-white/14 bg-[#151b31] px-4 text-white outline-none transition focus:border-starlight-pink"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/78">内容</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
                className="rounded-2xl border border-white/14 bg-white/[0.08] px-4 py-3 text-white outline-none transition focus:border-starlight-pink"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-5 font-bold text-[#07101f]"
            >
              <PaperPlaneTilt size={18} weight="fill" />
              发布留言
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-[24px] border border-white/12 bg-white/[0.06] p-5">
            <p className="text-sm leading-7 text-white/66">游客可以浏览公开留言，但不能发言、点赞或回复。</p>
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
            className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 transition hover:-translate-y-1 hover:border-dream-blue/42 hover:bg-white/[0.1]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/52">
                <span className="font-semibold text-white/78">{post.authorName}</span>
                <span>{categoryLabels[post.category]}</span>
                <span>{post.createdAt}</span>
              </div>
              {post.pinned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-starlight-pink px-3 py-1 text-xs font-bold text-[#07101f]">
                  <PushPinSimple size={13} weight="fill" />
                  置顶
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 text-2xl font-bold">{post.title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/66">{post.content}</p>
            <div className="mt-5 flex gap-3 text-sm text-white/58">
              <button
                type="button"
                disabled={!canCreatePost(role)}
                onClick={() =>
                  setPosts((current) =>
                    current.map((item) => (item.id === post.id ? { ...item, likes: item.likes + 1 } : item))
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Heart size={16} />
                {post.likes}
              </button>
              <span className="inline-flex items-center rounded-full border border-white/12 px-3 py-2">
                回复 {post.replies}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
