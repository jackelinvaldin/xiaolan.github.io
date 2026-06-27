import { announcements } from "./data/announcements";
import { communityPosts, profilePosts } from "./data/community";
import { galleryCategoryLabels, serverGallery } from "./data/server-gallery";
import { users } from "./data/users";
import { hasDatabase, prisma } from "./db/prisma";
import { toAnnouncement, toCommunityPost, toProfilePost, toUser } from "./server/mappers";
import type { Announcement, CommunityPost, ProfilePost, ServerGalleryItem, User } from "./data/types";

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!hasDatabase()) return announcements;

  try {
    const rows = await prisma.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }]
    });

    return rows.length ? rows.map(toAnnouncement) : announcements;
  } catch {
    return announcements;
  }
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const fallback = announcements.find((announcement) => announcement.id === id || announcement.slug === id) ?? null;
  if (!hasDatabase()) {
    return fallback;
  }

  try {
    const row = await prisma.announcement.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    return row ? toAnnouncement(row) : fallback;
  } catch {
    return fallback;
  }
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  if (!hasDatabase()) return communityPosts;

  try {
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

    return posts.length ? posts.map(toCommunityPost) : communityPosts;
  } catch {
    return communityPosts;
  }
}

export async function getGalleryItems(): Promise<ServerGalleryItem[]> {
  if (!hasDatabase()) return serverGallery;

  try {
    const rows = await prisma.serverGalleryItem.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
    });

    if (!rows.length) return serverGallery;
    return rows.map((item: {
      id: string;
      title: string;
      category: string;
      description: string;
      imageUrl: string;
      featured: boolean;
    }) => {
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
  } catch {
    return serverGallery;
  }
}

export async function getProfilePosts(ownerId?: string, includePrivate = false): Promise<ProfilePost[]> {
  if (!hasDatabase()) {
    return profilePosts.filter((post) => {
      const ownerMatch = ownerId ? post.authorId === ownerId : true;
      const visibilityMatch = includePrivate ? true : post.visibility === "public";
      return ownerMatch && visibilityMatch;
    });
  }

  try {
    const rows = await prisma.profilePost.findMany({
      where: {
        ...(ownerId ? { authorId: ownerId } : {}),
        ...(includePrivate ? {} : { visibility: "PUBLIC" })
      },
      orderBy: { createdAt: "desc" }
    });

    return rows.map(toProfilePost);
  } catch {
    return profilePosts.filter((post) => {
      const ownerMatch = ownerId ? post.authorId === ownerId : true;
      const visibilityMatch = includePrivate ? true : post.visibility === "public";
      return ownerMatch && visibilityMatch;
    });
  }
}

export async function getUsers(): Promise<User[]> {
  if (!hasDatabase()) return users;

  try {
    const rows = await prisma.user.findMany({
      orderBy: { joinedAt: "desc" }
    });

    return rows.length ? rows.map(toUser) : users;
  } catch {
    return users;
  }
}

export async function getUserByIdOrUsername(value: string): Promise<User | null> {
  if (!hasDatabase()) {
    return users.find((user) => user.id === value || user.username === value) ?? null;
  }

  try {
    const row = await prisma.user.findFirst({
      where: {
        OR: [{ id: value }, { username: value }]
      }
    });

    return row ? toUser(row) : users.find((user) => user.id === value || user.username === value) ?? null;
  } catch {
    return users.find((user) => user.id === value || user.username === value) ?? null;
  }
}
