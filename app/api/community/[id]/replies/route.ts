import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/server/session";
import { toCommunityReply } from "@/lib/server/mappers";

const replySchema = z.object({
  content: z.string().min(1, "回复不能为空").max(800, "回复最多 800 字")
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ data: [] });
  }

  const { id } = await params;
  const rows = await prisma.communityReply.findMany({
    where: { postId: id },
    include: { author: { select: { displayName: true } } },
    orderBy: { createdAt: "asc" },
    take: 100
  });

  return NextResponse.json({ data: rows.map(toCommunityReply) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能回复" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录后再回复" }, { status: 401 });
  }

  const parsed = replySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "回复内容不正确" }, { status: 400 });
  }

  const { id } = await params;
  const postExists = await prisma.communityPost.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!postExists) {
    return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
  }

  const [reply, post] = await prisma.$transaction([
    prisma.communityReply.create({
      data: {
        postId: id,
        authorId: user.id,
        content: parsed.data.content.trim()
      },
      include: { author: { select: { displayName: true } } }
    }),
    prisma.communityPost.update({
      where: { id },
      data: { replies: { increment: 1 } },
      select: { replies: true }
    })
  ]);

  return NextResponse.json({ data: toCommunityReply(reply), replies: post.replies }, { status: 201 });
}
