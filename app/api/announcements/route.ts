import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getAnnouncements } from "@/lib/repository";
import { createSlug } from "@/lib/server/slug";
import { getCurrentUser } from "@/lib/server/session";
import { toAnnouncement } from "@/lib/server/mappers";

const announcementSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(80, "标题最多 80 字"),
  summary: z.string().min(1, "摘要不能为空").max(200, "摘要最多 200 字"),
  content: z.string().min(1, "正文不能为空").max(4000, "正文最多 4000 字"),
  type: z.enum(["maintenance", "event", "update", "rule", "recruit", "important"]).default("important"),
  pinned: z.boolean().default(false)
});

const typeMap = {
  maintenance: "MAINTENANCE",
  event: "EVENT",
  update: "UPDATE",
  rule: "RULE",
  recruit: "RECRUIT",
  important: "IMPORTANT"
} as const;

async function uniqueSlug(title: string) {
  const base = createSlug(title);
  let slug = base;
  let index = 2;
  while (await prisma.announcement.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${index}`;
    index += 1;
  }
  return slug;
}

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ data: await getAnnouncements() });
  }

  try {
    const rows = await prisma.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
      take: 100
    });

    return NextResponse.json({ data: rows.length ? rows.map(toAnnouncement) : await getAnnouncements() });
  } catch {
    return NextResponse.json({ data: await getAnnouncements() });
  }
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能发布公告" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录管理员账号" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "只有管理员可以发布公告" }, { status: 403 });
  }

  const parsed = announcementSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "公告内容不正确" }, { status: 400 });
  }

  const row = await prisma.announcement.create({
    data: {
      title: parsed.data.title.trim(),
      slug: await uniqueSlug(parsed.data.title),
      summary: parsed.data.summary.trim(),
      content: parsed.data.content.trim(),
      type: typeMap[parsed.data.type],
      pinned: parsed.data.pinned,
      authorId: user.id,
      authorName: user.displayName
    }
  });

  return NextResponse.json({ data: toAnnouncement(row) }, { status: 201 });
}
