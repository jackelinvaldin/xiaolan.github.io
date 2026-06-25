import type { Announcement, CommunityPost, CommunityReply, ProfilePost, User } from "@/lib/data/types";

export function toRole(role: string) {
  return role.toLowerCase() as User["role"];
}

export function toCategory(category: string) {
  return category.toLowerCase() as CommunityPost["category"];
}

export function toVisibility(visibility: string) {
  return visibility.toLowerCase() as CommunityPost["visibility"];
}

export function toAnnouncementType(type: string) {
  return type.toLowerCase() as Announcement["type"];
}

export function toUser(user: {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: string;
  bio: string | null;
  joinedAt: Date;
}): User {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? undefined,
    role: toRole(user.role),
    bio: user.bio ?? undefined,
    joinedAt: user.joinedAt.toISOString()
  };
}

export function toCommunityPost(post: {
  id: string;
  authorId: string;
  title: string | null;
  content: string;
  category: string;
  visibility: string;
  likes: number;
  replies: number;
  pinned: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
  author?: { displayName: string } | null;
  replyItems?: Array<{
    id: string;
    postId: string;
    authorId: string;
    content: string;
    createdAt: Date;
    author?: { displayName: string } | null;
  }>;
  _count?: { replyItems?: number };
}): CommunityPost {
  return {
    id: post.id,
    authorId: post.authorId,
    authorName: post.author?.displayName ?? "成员",
    title: post.title ?? undefined,
    content: post.content,
    category: toCategory(post.category),
    visibility: toVisibility(post.visibility),
    likes: post.likes,
    replies: post._count?.replyItems ?? post.replyItems?.length ?? post.replies,
    replyItems: post.replyItems?.map(toCommunityReply),
    pinned: post.pinned,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString()
  };
}

export function toCommunityReply(reply: {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  author?: { displayName: string } | null;
}): CommunityReply {
  return {
    id: reply.id,
    postId: reply.postId,
    authorId: reply.authorId,
    authorName: reply.author?.displayName ?? "成员",
    content: reply.content,
    createdAt: reply.createdAt.toISOString()
  };
}

export function toAnnouncement(announcement: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: string;
  authorName: string;
  pinned: boolean;
  publishedAt: Date;
}): Announcement {
  return {
    id: announcement.id,
    slug: announcement.slug,
    title: announcement.title,
    summary: announcement.summary,
    content: announcement.content,
    type: toAnnouncementType(announcement.type),
    authorName: announcement.authorName,
    pinned: announcement.pinned,
    publishedAt: announcement.publishedAt.toISOString()
  };
}

export function toProfilePost(post: {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  visibility: string;
  createdAt: Date;
}): ProfilePost {
  return {
    id: post.id,
    authorId: post.authorId,
    content: post.content,
    imageUrl: post.imageUrl ?? undefined,
    visibility: toVisibility(post.visibility),
    createdAt: post.createdAt.toISOString()
  };
}
