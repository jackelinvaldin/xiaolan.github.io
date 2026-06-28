"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookmarkSimple, Eye, LockSimple, PaperPlaneTilt, ShieldCheck, UserCircle } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { MobileLazyImage } from "@/components/media/MobileLazyImage";
import { canAccessAdmin, canAccessProfile, roleLabels } from "@/lib/auth";
import type { ProfilePost, Visibility } from "@/lib/data/types";

export function ProfileSpace({ initialPosts }: { initialPosts: ProfilePost[] }) {
  const router = useRouter();
  const { role, displayName, logout, ready } = useMockSession();
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [adminNotice, setAdminNotice] = useState("");

  useEffect(() => {
    if (!ready || !canAccessProfile(role)) return;

    let active = true;
    setLoadingPosts(true);
    setError("");
    fetch("/api/profile-posts", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { data?: ProfilePost[]; error?: string };
        if (!response.ok || !data.data) {
          throw new Error(data.error ?? "动态读取失败");
        }
        if (active) setPosts(data.data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "动态读取失败");
      })
      .finally(() => {
        if (active) setLoadingPosts(false);
      });

    return () => {
      active = false;
    };
  }, [ready, role]);

  if (!ready) {
    return <GlassPanel className="p-8">正在读取个人空间状态...</GlassPanel>;
  }

  if (!canAccessProfile(role)) {
    return (
      <GlassPanel className="mx-auto max-w-3xl p-8">
        <UserCircle size={36} className="text-dream-blue" />
        <h1 className="mt-5 text-4xl font-black">请先登录</h1>
        <p className="mt-4 text-base leading-8 text-sky-900/68">
          登录后可以进入个人空间，发布动态、收藏内容并管理自己的主页。
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ActionButton href="/login">去登录</ActionButton>
          <ActionButton href="/register" variant="ghost">
            注册成员
          </ActionButton>
        </div>
      </GlassPanel>
    );
  }

  async function submitPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/profile-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), visibility })
      });
      const data = (await response.json()) as { data?: ProfilePost; error?: string };
      if (!response.ok || !data.data) {
        throw new Error(data.error ?? "动态发布失败");
      }
      setPosts((current) => [data.data!, ...current]);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "动态发布失败");
    } finally {
      setPending(false);
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

  function openAdmin() {
    if (canAccessAdmin(role)) {
      router.push("/admin");
      return;
    }
    setAdminNotice("当前账号无管理员权限，无法进入管理后台。");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-6">
        <GlassPanel className="overflow-hidden">
          <div className="relative h-44 sm:h-52">
            <Image
              src="/images/server/group-red-lantern.jpg"
              alt="个人空间封面"
              fill
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/88 to-transparent" />
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="grid size-24 shrink-0 place-items-center rounded-[28px] border border-white/80 bg-[linear-gradient(135deg,#82c7ff,#ff9fe6)] text-[#07101f] shadow-[0_18px_44px_rgba(82,145,198,0.2)]">
                <UserCircle size={52} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-4xl font-black">{displayName}</h1>
                <p className="mt-2 text-sm text-dream-blue">{roleLabels[role]}</p>
                <p className="mt-4 text-sm leading-7 text-sky-900/64">
                  这里会收纳个人动态、收藏内容、服务器记录和建筑作品。
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={openAdmin}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-sky-200/70 bg-white/72 px-4 text-sm font-semibold text-sky-950 shadow-[0_12px_28px_rgba(82,145,198,0.12)] transition hover:bg-white active:scale-[0.985]"
                  >
                    <ShieldCheck size={17} />
                    管理员管理
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full border border-sky-200/70 bg-white/64 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-white"
                  >
                    退出登录
                  </button>
                </div>
                {adminNotice ? (
                  <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {adminNotice}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <div className="flex items-center gap-3">
            <BookmarkSimple size={24} className="text-starlight-pink" />
            <h2 className="text-2xl font-bold">我的收藏</h2>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-sky-900/66">
            <span className="rounded-2xl border border-sky-200/60 bg-white/64 p-4">星环之境地图档案</span>
            <span className="rounded-2xl border border-sky-200/60 bg-white/64 p-4">夏夜共建活动公告</span>
            <span className="rounded-2xl border border-sky-200/60 bg-white/64 p-4">雪境原野巡礼路线</span>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-5">
        <GlassPanel className="p-6">
          <h2 className="text-2xl font-bold">发布动态</h2>
          <form className="mt-5 grid gap-4" onSubmit={submitPost}>
            <label className="grid gap-2">
              <span className="field-label">动态内容</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={4}
                className="glass-input rounded-2xl px-4 py-3"
              />
            </label>
            <label className="grid gap-2">
              <span className="field-label">可见性</span>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as Visibility)}
                className="glass-input glass-select h-12 rounded-2xl px-4"
              >
                <option value="public">公开</option>
                <option value="private">私密</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-5 font-bold text-[#07101f] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PaperPlaneTilt size={18} weight="fill" />
              {pending ? "发布中..." : "发布动态"}
            </button>
            {error ? <p className="text-sm text-starlight-pink">{error}</p> : null}
          </form>
        </GlassPanel>

        {loadingPosts ? <GlassPanel className="p-6 text-sky-900/64">正在读取动态...</GlassPanel> : null}

        {posts.map((post) => (
          <article key={post.id} className="surface-card hover-flip-card rounded-[28px] p-5">
            <div className="flex items-center justify-between gap-3 text-sm text-sky-900/54">
              <span>{formatDate(post.createdAt)}</span>
              <span className="glass-chip inline-flex items-center gap-2 rounded-full px-3 py-1">
                {post.visibility === "public" ? <Eye size={15} /> : <LockSimple size={15} />}
                {post.visibility === "public" ? "公开" : "私密"}
              </span>
            </div>
            <p className="mt-4 text-base leading-8 text-sky-900/72">{post.content}</p>
            {post.imageUrl ? (
              <div className="relative mt-5 aspect-video overflow-hidden rounded-[22px]">
                <MobileLazyImage
                  src={post.imageUrl}
                  alt="动态配图"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
