import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { toCommunityPost } from "@/lib/server/mappers";
import { getCurrentUser } from "@/lib/server/session";

const updateSchema = z.object({
  title: z.string().max(80, "标题最多 80 字").optional(),
  content: z.string().min(1, "内容不能为空").max(1200, "内容最多 1200 字").optional(),
  category: z.enum(["chat", "suggestion", "build", "event", "official"]).optional(),
  visibility: z.enum(["public", "private", "team"]).optional(),
  pinned: z.boolean().optional()
});

const categoryMap = {
  chat: "CHAT",
  suggestion: "SUGGESTION",
  build: "BUILD",
  event: "EVENT",
  official: "OFFICIAL"
} as const;

const visibilityMap = {
  public: "PUBLIC",
  private: "PRIVATE",
  team: "TEAM"
} as const;

async function requireAdminResponse() {
  const user = await getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ error: "请先登录管理员账号" }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { response: NextResponse.json({ error: "只有管理员可以管理留言" }, { status: 403 }) };
  }
  return { user };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能编辑留言" }, { status: 503 });
  }

  const admin = await requireAdminResponse();
  if ("response" in admin) return admin.response;

  const { id } = await params;
  const existing = await prisma.communityPost.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "留言不存在" }, { status: 404 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "留言内容不正确" }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.communityPost.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() || "社区留言" } : {}),
      ...(data.content !== undefined ? { content: data.content.trim() } : {}),
      ...(data.category !== undefined ? { category: categoryMap[data.category] } : {}),
      ...(data.visibility !== undefined ? { visibility: visibilityMap[data.visibility] } : {}),
      ...(data.pinned !== undefined ? { pinned: data.pinned } : {})
    },
    include: {
      author: { select: { displayName: true } },
      replyItems: {
        include: { author: { select: { displayName: true } } },
        orderBy: { createdAt: "asc" },
        take: 20
      },
      _count: { select: { replyItems: true } }
    }
  });

  return NextResponse.json({ data: toCommunityPost(updated) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能删除留言" }, { status: 503 });
  }

  const admin = await requireAdminResponse();
  if ("response" in admin) return admin.response;

  const { id } = await params;
  const existing = await prisma.communityPost.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    return NextResponse.json({ error: "留言不存在" }, { status: 404 });
  }

  await prisma.communityPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
