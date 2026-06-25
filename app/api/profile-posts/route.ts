import { NextResponse } from "next/server";
import { z } from "zod";
import { profilePosts } from "@/lib/data/community";
import { users } from "@/lib/data/users";
import { hasDatabase, prisma } from "@/lib/db/prisma";

const profilePostSchema = z.object({
  authorId: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  visibility: z.enum(["public", "private", "team"]).default("public")
});

const visibilityMap = {
  public: "PUBLIC",
  private: "PRIVATE",
  team: "TEAM"
} as const;

export async function GET() {
  return NextResponse.json({ data: profilePosts });
}

export async function POST(request: Request) {
  const payload = profilePostSchema.parse(await request.json());

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        data: {
          id: `mock-profile-${Date.now()}`,
          authorId: payload.authorId ?? users[0].id,
          content: payload.content,
          imageUrl: payload.imageUrl,
          visibility: payload.visibility,
          createdAt: "刚刚"
        }
      },
      { status: 201 }
    );
  }

  const post = await prisma.profilePost.create({
    data: {
      authorId: payload.authorId ?? users[0].id,
      content: payload.content,
      imageUrl: payload.imageUrl,
      visibility: visibilityMap[payload.visibility]
    }
  });

  return NextResponse.json({ data: post }, { status: 201 });
}
