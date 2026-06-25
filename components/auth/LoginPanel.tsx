"use client";

import { useRouter } from "next/navigation";
import { SignIn, ShieldCheck, UserCircle } from "@phosphor-icons/react";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { useMockSession } from "@/components/auth/useMockSession";

const options = [
  {
    role: "member" as const,
    name: "爱莉",
    title: "普通成员",
    text: "可以发言、点赞、回复，并进入个人空间发布动态。",
    icon: UserCircle
  },
  {
    role: "admin" as const,
    name: "小蓝",
    title: "管理员",
    text: "可以预览公告、社区、用户和服务器图片管理界面。",
    icon: ShieldCheck
  }
];

export function LoginPanel() {
  const router = useRouter();
  const { setRole } = useMockSession();

  return (
    <GlassPanel className="mx-auto max-w-3xl p-6 md:p-8">
      <div className="flex items-center gap-3">
        <SignIn size={28} className="text-dream-blue" />
        <div>
          <h1 className="text-3xl font-black md:text-5xl">登录预览</h1>
          <p className="mt-2 text-sm text-white/62">MVP 使用 mock 登录状态，方便先调 UI 和权限流。</p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.role}
              type="button"
              className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 text-left transition hover:-translate-y-1 hover:border-starlight-pink/42 hover:bg-white/[0.1]"
              onClick={() => {
                setRole(option.role, option.name);
                router.push(option.role === "admin" ? "/admin" : "/profile");
              }}
            >
              <Icon size={30} className="text-starlight-pink" />
              <h2 className="mt-4 text-2xl font-bold">{option.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/64">{option.text}</p>
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
}
