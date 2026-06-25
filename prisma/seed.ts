import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { announcements } from "../lib/data/announcements";
import { communityPosts, profilePosts } from "../lib/data/community";
import { serverGallery } from "../lib/data/server-gallery";
import { users } from "../lib/data/users";
import { hashPassword } from "../lib/server/password";

const prisma = new PrismaClient();

const categoryMap = {
  chat: "CHAT",
  suggestion: "SUGGESTION",
  build: "BUILD",
  event: "EVENT",
  official: "OFFICIAL"
} as const;

const visibilityMap = {
  public: "PUBLIC",
  private: "PRIVATE",
  team: "TEAM"
} as const;

const announcementTypeMap = {
  maintenance: "MAINTENANCE",
  event: "EVENT",
  update: "UPDATE",
  rule: "RULE",
  recruit: "RECRUIT",
  important: "IMPORTANT"
} as const;

const galleryCategoryMap = {
  group: "GROUP",
  event: "EVENT",
  building: "BUILDING",
  nature: "NATURE",
  future: "FUTURE",
  survival: "SURVIVAL"
} as const;

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {
        role: "MEMBER",
        disabled: false
      },
      create: {
        id: user.id,
        username: user.username,
        passwordHash: hashPassword(randomUUID()),
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: "MEMBER",
        bio: user.bio,
        joinedAt: new Date(user.joinedAt)
      }
    });
  }

  for (const announcement of announcements) {
    await prisma.announcement.upsert({
      where: { slug: announcement.slug },
      update: {},
      create: {
        id: announcement.id,
        slug: announcement.slug,
        title: announcement.title,
        summary: announcement.summary,
        content: announcement.content,
        type: announcementTypeMap[announcement.type],
        authorName: announcement.authorName,
        pinned: announcement.pinned ?? false,
        publishedAt: new Date(announcement.publishedAt)
      }
    });
  }

  for (const post of communityPosts) {
    await prisma.communityPost.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        authorId: post.authorId,
        title: post.title,
        content: post.content,
        category: categoryMap[post.category],
        visibility: visibilityMap[post.visibility],
        likes: post.likes,
        replies: post.replies,
        pinned: post.pinned ?? false,
        createdAt: new Date(post.createdAt)
      }
    });
  }

  for (const post of profilePosts) {
    await prisma.profilePost.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        imageUrl: post.imageUrl,
        visibility: visibilityMap[post.visibility],
        createdAt: new Date(post.createdAt)
      }
    });
  }

  for (const [sortOrder, item] of serverGallery.entries()) {
    await prisma.serverGalleryItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        category: galleryCategoryMap[item.category],
        description: item.description,
        imageUrl: item.imageUrl,
        featured: item.featured ?? false,
        sortOrder
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
