import { NextResponse } from "next/server";
import { z } from "zod";
import { communityPosts } from "@/lib/data/community";
import { users } from "@/lib/data/users";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { getCommunityPosts } from "@/lib/repository";

const postSchema = z.object({
  authorId: z.string().optional(),
  title: z.string().optional(),
  content: z.string().min(1),
  category: z.enum(["chat", "suggestion", "build", "event", "official"]).default("chat")
});

const categoryMap = {
  chat: "CHAT",
  suggestion: "SUGGESTION",
  build: "BUILD",
  event: "EVENT",
  official: "OFFICIAL"
} as const;

export async function GET() {
  const data = await getCommunityPosts();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const payload = postSchema.parse(await request.json());

  if (!hasDatabase()) {
    const post = {
      id: `mock-${Date.now()}`,
      authorId: payload.authorId ?? users[0].id,
      authorName: users.find((user) => user.id === payload.authorId)?.displayName ?? "预览成员",
      title: payload.title,
      content: payload.content,
      category: payload.category,
      visibility: "public",
      likes: 0,
      replies: 0,
      createdAt: "刚刚"
    };
    return NextResponse.json({ data: [post, ...communityPosts] }, { status: 201 });
  }

  const authorId = payload.authorId ?? users[0].id;
  const post = await prisma.communityPost.create({
    data: {
      authorId,
      title: payload.title,
      content: payload.content,
      category: categoryMap[payload.category],
      visibility: "PUBLIC"
    },
    include: {
      author: true
    }
  });

  return NextResponse.json(
    {
      data: {
        id: post.id,
        authorId: post.authorId,
        authorName: post.author.displayName,
        title: post.title,
        content: post.content,
        category: post.category.toLowerCase(),
        visibility: post.visibility.toLowerCase(),
        likes: post.likes,
        replies: post.replies,
        pinned: post.pinned,
        createdAt: post.createdAt.toISOString()
      }
    },
    { status: 201 }
  );
}
