import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getCommunityPosts } from "@/lib/repository";
import { getCurrentUser } from "@/lib/server/session";
import { toCommunityPost } from "@/lib/server/mappers";

const postSchema = z.object({
  title: z.string().max(80).optional(),
  content: z.string().min(1, "内容不能为空").max(1200, "内容最多 1200 字"),
  category: z.enum(["chat", "suggestion", "build", "event", "official"]).default("chat")
});

const categoryMap = {
  chat: "CHAT",
  suggestion: "SUGGESTION",
  build: "BUILD",
  event: "EVENT",
  official: "OFFICIAL"
} as const;

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ data: await getCommunityPosts() });
  }

  const posts = await prisma.communityPost.findMany({
    where: { visibility: "PUBLIC" },
    include: {
      author: { select: { displayName: true } },
      replyItems: {
        include: { author: { select: { displayName: true } } },
        orderBy: { createdAt: "asc" },
        take: 20
      },
      _count: { select: { replyItems: true } }
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 100
  });

  return NextResponse.json({ data: posts.map(toCommunityPost) });
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能发布留言" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录后再发布留言" }, { status: 401 });
  }

  const parsed = postSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "内容不正确" }, { status: 400 });
  }

  const post = await prisma.communityPost.create({
    data: {
      authorId: user.id,
      title: parsed.data.title?.trim() || "新的社区留言",
      content: parsed.data.content.trim(),
      category: categoryMap[parsed.data.category],
      visibility: "PUBLIC",
      likes: 0,
      replies: 0
    },
    include: {
      author: { select: { displayName: true } },
      replyItems: true,
      _count: { select: { replyItems: true } }
    }
  });

  return NextResponse.json({ data: toCommunityPost(post) }, { status: 201 });
}
