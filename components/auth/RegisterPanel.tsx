"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "@phosphor-icons/react";
import { GlassPanel } from "@/components/layout/GlassPanel";

export function RegisterPanel() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, displayName, password })
    });
    const data = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "注册失败");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <UserPlus size={28} className="text-dream-blue" />
        <div>
          <h1 className="text-3xl font-black md:text-5xl">注册成员</h1>
          <p className="mt-2 text-sm text-white/62">注册账号会成为普通成员。管理员账号不开放注册。</p>
        </div>
      </div>
      <form className="mt-8 grid gap-5" onSubmit={submit}>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/78">用户名</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition placeholder:text-white/40 focus:border-starlight-pink"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/78">显示昵称</span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition placeholder:text-white/40 focus:border-starlight-pink"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/78">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition placeholder:text-white/40 focus:border-starlight-pink"
          />
        </label>
        {error ? <p className="rounded-2xl border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 rounded-full border border-white/20 bg-white/18 px-6 font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_18px_46px_rgba(255,159,230,0.18)] backdrop-blur-2xl transition hover:bg-white/24 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "注册中..." : "注册普通成员"}
        </button>
        <p className="text-sm text-white/62">
          已有账号？{" "}
          <Link href="/login" className="font-semibold text-dream-blue">
            去登录
          </Link>
        </p>
      </form>
    </GlassPanel>
  );
}
