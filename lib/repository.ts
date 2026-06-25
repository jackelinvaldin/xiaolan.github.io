import { announcements } from "./data/announcements";
import { communityPosts, profilePosts } from "./data/community";
import { galleryCategoryLabels, serverGallery } from "./data/server-gallery";
import { users } from "./data/users";
import { hasDatabase, prisma } from "./db/prisma";
import { toAnnouncement, toCommunityPost, toProfilePost, toUser } from "./server/mappers";

export async function getAnnouncements() {
  if (!hasDatabase()) return announcements;

  const rows = await prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }]
  });

  return rows.map(toAnnouncement);
}

export async function getAnnouncementById(id: string) {
  if (!hasDatabase()) {
    return announcements.find((announcement) => announcement.id === id || announcement.slug === id) ?? null;
  }

  const row = await prisma.announcement.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    }
  });

  return row ? toAnnouncement(row) : null;
}

export async function getCommunityPosts() {
  if (!hasDatabase()) return communityPosts;

  const posts = await prisma.communityPost.findMany({
    where: { visibility: "PUBLIC" },
    include: {
      author: true,
      replyItems: {
        include: { author: { select: { displayName: true } } },
        orderBy: { createdAt: "asc" },
        take: 20
      },
      _count: { select: { replyItems: true } }
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }]
  });

  return posts.map(toCommunityPost);
}

export async function getGalleryItems() {
  if (!hasDatabase()) return serverGallery;

  const rows = await prisma.serverGalleryItem.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return rows.map((item) => {
    const category = item.category.toLowerCase() as keyof typeof galleryCategoryLabels;
    return {
      id: item.id,
      title: item.title,
      category,
      categoryName: galleryCategoryLabels[category],
      description: item.description,
      imageUrl: item.imageUrl,
      featured: item.featured
    };
  });
}

export async function getProfilePosts(ownerId?: string, includePrivate = false) {
  if (!hasDatabase()) {
    return profilePosts.filter((post) => {
      const ownerMatch = ownerId ? post.authorId === ownerId : true;
      const visibilityMatch = includePrivate ? true : post.visibility === "public";
      return ownerMatch && visibilityMatch;
    });
  }

  const rows = await prisma.profilePost.findMany({
    where: {
      ...(ownerId ? { authorId: ownerId } : {}),
      ...(includePrivate ? {} : { visibility: "PUBLIC" })
    },
    orderBy: { createdAt: "desc" }
  });

  return rows.map(toProfilePost);
}

export async function getUsers() {
  if (!hasDatabase()) return users;

  const rows = await prisma.user.findMany({
    orderBy: { joinedAt: "desc" }
  });

  return rows.map(toUser);
}

export async function getUserByIdOrUsername(value: string) {
  if (!hasDatabase()) {
    return users.find((user) => user.id === value || user.username === value) ?? null;
  }

  const row = await prisma.user.findFirst({
    where: {
      OR: [{ id: value }, { username: value }]
    }
  });

  return row ? toUser(row) : null;
}
