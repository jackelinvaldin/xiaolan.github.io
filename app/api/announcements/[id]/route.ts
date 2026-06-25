import { NextResponse } from "next/server";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getAnnouncementById } from "@/lib/repository";
import { toAnnouncement } from "@/lib/server/mappers";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!hasDatabase()) {
    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      return NextResponse.json({ error: "公告不存在" }, { status: 404 });
    }
    return NextResponse.json({ data: announcement });
  }

  const row = await prisma.announcement.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    }
  });

  if (!row) {
    return NextResponse.json({ error: "公告不存在" }, { status: 404 });
  }

  return NextResponse.json({ data: toAnnouncement(row) });
}
