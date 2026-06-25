"use client";

import { ChartBar, ImageSquare, MegaphoneSimple, ShieldCheck, UsersThree } from "@phosphor-icons/react";
import { ActionButton } from "@/components/ActionButton";
import { useMockSession } from "@/components/auth/useMockSession";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { canAccessAdmin, roleLabels } from "@/lib/auth";
import { announcements } from "@/lib/data/announcements";
import { communityPosts } from "@/lib/data/community";
import { serverGallery } from "@/lib/data/server-gallery";
import { users } from "@/lib/data/users";

const modules = [
  { title: "公告管理", count: announcements.length, icon: MegaphoneSimple },
  { title: "社区管理", count: communityPosts.length, icon: ChartBar },
  { title: "用户管理", count: users.length, icon: UsersThree },
  { title: "图片管理", count: serverGallery.length, icon: ImageSquare }
];

export function AdminDashboard() {
  const { role, displayName, ready } = useMockSession();

  if (!ready) return <GlassPanel className="p-8">正在读取管理员权限...</GlassPanel>;

  if (!canAccessAdmin(role)) {
    return (
      <GlassPanel className="mx-auto max-w-3xl p-8">
        <ShieldCheck size={36} className="text-starlight-pink" />
        <h1 className="mt-5 text-4xl font-black">管理员后台</h1>
        <p className="mt-4 text-base leading-8 text-white/66">
          当前身份是{roleLabels[role]}。此页面仅管理员可见，请切换到管理员预览身份。
        </p>
        <div className="mt-7">
          <ActionButton href="/login">切换身份</ActionButton>
        </div>
      </GlassPanel>
    );
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
              <p className="mt-2 text-4xl font-black">{module.count}</p>
            </GlassPanel>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ManagementTable
          title="公告管理"
          rows={announcements.map((item) => [item.title, item.authorName, item.publishedAt])}
          headings={["标题", "发布人", "时间"]}
        />
        <ManagementTable
          title="社区管理"
          rows={communityPosts.map((item) => [item.title ?? "无标题", item.authorName, item.category])}
          headings={["帖子", "作者", "分区"]}
        />
        <ManagementTable
          title="用户管理"
          rows={users.map((item) => [item.displayName, item.username, roleLabels[item.role]])}
          headings={["昵称", "账号", "身份"]}
        />
        <ManagementTable
          title="图片管理"
          rows={serverGallery.slice(0, 6).map((item) => [item.title, item.categoryName, item.featured ? "推荐" : "普通"])}
          headings={["图片", "分类", "状态"]}
        />
      </div>
    </div>
  );
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
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-white/8 text-white/72">
                {row.map((cell) => (
                  <td key={cell} className="px-5 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
