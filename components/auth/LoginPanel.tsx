"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignIn } from "@phosphor-icons/react";
import { GlassPanel } from "@/components/layout/GlassPanel";
import type { UserRole } from "@/lib/data/types";

export function LoginPanel() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = (await response.json()) as { error?: string; user?: { role: UserRole } };
    setLoading(false);

    if (!response.ok || !data.user) {
      setError(data.error ?? "登录失败");
      return;
    }

    router.push(data.user.role === "admin" ? "/admin" : "/profile");
    router.refresh();
  }

  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <SignIn size={28} className="text-dream-blue" />
        <div>
          <h1 className="text-3xl font-black md:text-5xl">登录</h1>
          <p className="mt-2 text-sm text-sky-900/62">成员登录后可以留言和发布动态，管理员可以发布公告。</p>
        </div>
      </div>
      <form className="mt-8 grid gap-5" onSubmit={submit}>
        <label className="grid gap-2">
          <span className="field-label">用户名</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="glass-input h-12 rounded-2xl px-4"
          />
        </label>
        <label className="grid gap-2">
          <span className="field-label">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="glass-input h-12 rounded-2xl px-4"
          />
        </label>
        {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 rounded-full border border-sky-200/70 bg-white/76 px-6 font-bold text-sky-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_46px_rgba(82,145,198,0.14)] backdrop-blur-2xl transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "登录中..." : "登录"}
        </button>
        <p className="text-sm text-sky-900/62">
          没有账号？{" "}
          <Link href="/register" className="font-semibold text-dream-blue">
            注册普通成员
          </Link>
        </p>
      </form>
    </GlassPanel>
  );
}
