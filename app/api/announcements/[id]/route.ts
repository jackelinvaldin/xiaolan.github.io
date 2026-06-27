import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getAnnouncementById } from "@/lib/repository";
import { toAnnouncement } from "@/lib/server/mappers";
import { getCurrentUser } from "@/lib/server/session";
import { createSlug } from "@/lib/server/slug";

const updateSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(80, "标题最多 80 字").optional(),
  summary: z.string().min(1, "摘要不能为空").max(200, "摘要最多 200 字").optional(),
  content: z.string().min(1, "正文不能为空").max(4000, "正文最多 4000 字").optional(),
  type: z.enum(["maintenance", "event", "update", "rule", "recruit", "important"]).optional(),
  pinned: z.boolean().optional()
});

const typeMap = {
  maintenance: "MAINTENANCE",
  event: "EVENT",
  update: "UPDATE",
  rule: "RULE",
  recruit: "RECRUIT",
  important: "IMPORTANT"
} as const;

async function uniqueSlug(title: string, currentId: string) {
  const base = createSlug(title);
  let slug = base;
  let index = 2;

  while (true) {
    const existing = await prisma.announcement.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${index}`;
    index += 1;
  }
}

async function requireAdminResponse() {
  const user = await getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ error: "请先登录管理员账号" }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { response: NextResponse.json({ error: "只有管理员可以管理公告" }, { status: 403 }) };
  }
  return { user };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const fallback = await getAnnouncementById(id);
  if (!hasDatabase()) {
    if (!fallback) {
      return NextResponse.json({ error: "公告不存在或已被删除" }, { status: 404 });
    }
    return NextResponse.json({ data: fallback });
  }

  try {
    const row = await prisma.announcement.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (row) {
      return NextResponse.json({ data: toAnnouncement(row) });
    }
  } catch {
    // Fall through to mock/static fallback below.
  }

  if (!fallback) {
    return NextResponse.json({ error: "公告不存在或已被删除" }, { status: 404 });
  }

  return NextResponse.json({ data: fallback });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能编辑公告" }, { status: 503 });
  }

  const admin = await requireAdminResponse();
  if ("response" in admin) return admin.response;

  const { id } = await params;
  const row = await prisma.announcement.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    }
  });
  if (!row) {
    return NextResponse.json({ error: "公告不存在" }, { status: 404 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "公告内容不正确" }, { status: 400 });
  }

  const data = parsed.data;
  const updated = await prisma.announcement.update({
    where: { id: row.id },
    data: {
      ...(data.title !== undefined
        ? {
            title: data.title.trim(),
            slug: await uniqueSlug(data.title, row.id)
          }
        : {}),
      ...(data.summary !== undefined ? { summary: data.summary.trim() } : {}),
      ...(data.content !== undefined ? { content: data.content.trim() } : {}),
      ...(data.type !== undefined ? { type: typeMap[data.type] } : {}),
      ...(data.pinned !== undefined ? { pinned: data.pinned } : {})
    }
  });

  return NextResponse.json({ data: toAnnouncement(updated) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能删除公告" }, { status: 503 });
  }

  const admin = await requireAdminResponse();
  if ("response" in admin) return admin.response;

  const { id } = await params;
  const row = await prisma.announcement.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    select: { id: true }
  });
  if (!row) {
    return NextResponse.json({ error: "公告不存在" }, { status: 404 });
  }

  await prisma.announcement.delete({ where: { id: row.id } });
  return NextResponse.json({ ok: true });
}
