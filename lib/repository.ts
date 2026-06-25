import { announcements } from "./data/announcements";
import { communityPosts, profilePosts } from "./data/community";
import { serverGallery } from "./data/server-gallery";
import { users } from "./data/users";
import { hasDatabase, prisma } from "./db/prisma";

export async function getAnnouncements() {
  if (!hasDatabase()) return announcements;

  return prisma.announcement.findMany({
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }]
  });
}

export async function getCommunityPosts() {
  if (!hasDatabase()) return communityPosts;

  const posts = await prisma.communityPost.findMany({
    where: { visibility: "PUBLIC" },
    include: { author: true },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }]
  });

  return posts.map((post) => ({
    id: post.id,
    authorId: post.authorId,
    authorName: post.author.displayName,
    title: post.title ?? undefined,
    content: post.content,
    category: post.category.toLowerCase(),
    visibility: post.visibility.toLowerCase(),
    likes: post.likes,
    replies: post.replies,
    pinned: post.pinned,
    createdAt: post.createdAt.toISOString()
  }));
}

export async function getGalleryItems() {
  if (!hasDatabase()) return serverGallery;

  const rows = await prisma.serverGalleryItem.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category.toLowerCase(),
    categoryName: item.category,
    description: item.description,
    imageUrl: item.imageUrl,
    featured: item.featured
  }));
}

export async function getProfilePosts() {
  return profilePosts;
}

export async function getUsers() {
  return users;
}
