import { NextResponse } from "next/server";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/server/session";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能点赞" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录后再点赞" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.communityPost.update({
    where: { id },
    data: { likes: { increment: 1 } },
    select: { likes: true }
  });

  return NextResponse.json({ likes: post.likes });
}
