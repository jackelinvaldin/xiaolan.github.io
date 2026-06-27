import { NextResponse } from "next/server";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/server/session";
import { toAnnouncement, toCommunityPost, toUser } from "@/lib/server/mappers";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，后台暂不可用" }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录管理员账号" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "只有管理员可以访问后台" }, { status: 403 });
  }

  const [announcementCount, communityPostCount, userCount, galleryItemCount, announcements, posts, users] =
    await Promise.all([
      prisma.announcement.count(),
      prisma.communityPost.count(),
      prisma.user.count(),
      prisma.serverGalleryItem.count(),
      prisma.announcement.findMany({ orderBy: { publishedAt: "desc" }, take: 100 }),
      prisma.communityPost.findMany({
        include: {
          author: { select: { displayName: true } },
          _count: { select: { replyItems: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 100
      }),
      prisma.user.findMany({ orderBy: { joinedAt: "desc" }, take: 100 })
    ]);

  return NextResponse.json({
    data: {
      counts: {
        announcements: announcementCount,
        communityPosts: communityPostCount,
        users: userCount,
        galleryItems: galleryItemCount
      },
      announcements: announcements.map(toAnnouncement),
      posts: posts.map(toCommunityPost),
      users: users.map(toUser)
    }
  });
}
