import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getProfilePosts } from "@/lib/repository";
import { getCurrentUser } from "@/lib/server/session";
import { toProfilePost } from "@/lib/server/mappers";

const profilePostSchema = z.object({
  content: z.string().min(1, "内容不能为空").max(1200, "内容最多 1200 字"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.enum(["public", "private", "team"]).default("public")
});

const visibilityMap = {
  public: "PUBLIC",
  private: "PRIVATE",
  team: "TEAM"
} as const;

export async function GET(request: Request) {
  if (!hasDatabase()) {
    const url = new URL(request.url);
    const ownerId = url.searchParams.get("userId") ?? undefined;
    return NextResponse.json({ data: await getProfilePosts(ownerId, false) });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录后再查看个人动态" }, { status: 401 });
  }

  const url = new URL(request.url);
  const ownerId = url.searchParams.get("userId") ?? user.id;
  const mine = ownerId === user.id;

  try {
    const rows = await prisma.profilePost.findMany({
      where: {
        authorId: ownerId,
        ...(mine ? {} : { visibility: "PUBLIC" })
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return NextResponse.json({ data: rows.map(toProfilePost) });
  } catch {
    return NextResponse.json({ data: await getProfilePosts(ownerId, mine) });
  }
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能发布动态" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录后再发布动态" }, { status: 401 });
  }

  const parsed = profilePostSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "动态内容不正确" }, { status: 400 });
  }

  const row = await prisma.profilePost.create({
    data: {
      authorId: user.id,
      content: parsed.data.content.trim(),
      imageUrl: parsed.data.imageUrl || null,
      visibility: visibilityMap[parsed.data.visibility]
    }
  });

  return NextResponse.json({ data: toProfilePost(row) }, { status: 201 });
}
