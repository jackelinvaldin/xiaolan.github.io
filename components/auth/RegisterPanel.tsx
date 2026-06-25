"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "@phosphor-icons/react";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { useMockSession } from "@/components/auth/useMockSession";

export function RegisterPanel() {
  const router = useRouter();
  const { setRole } = useMockSession();
  const [name, setName] = useState("新玩家");

  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <UserPlus size={28} className="text-dream-blue" />
        <div>
          <h1 className="text-3xl font-black md:text-5xl">注册成员</h1>
          <p className="mt-2 text-sm text-white/62">MVP 先创建本地预览身份，真实注册接口可在后续接入。</p>
        </div>
      </div>
      <form
        className="mt-8 grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          setRole("member", name || "新玩家");
          router.push("/profile");
        }}
      >
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-white/78">显示昵称</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 rounded-2xl border border-white/14 bg-white/[0.08] px-4 text-white outline-none transition placeholder:text-white/40 focus:border-starlight-pink"
          />
        </label>
        <button
          type="submit"
          className="min-h-12 rounded-full bg-[linear-gradient(135deg,#ff9fe6,#a78bfa_52%,#82c7ff)] px-6 font-bold text-[#07101f]"
        >
          创建预览账号
        </button>
      </form>
    </GlassPanel>
  );
}
