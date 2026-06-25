import { NextResponse } from "next/server";
import { announcements } from "@/lib/data/announcements";
import { communityPosts } from "@/lib/data/community";
import { serverGallery } from "@/lib/data/server-gallery";
import { users } from "@/lib/data/users";

export async function GET(request: Request) {
  const role = request.headers.get("x-user-role");
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    data: {
      announcements: announcements.length,
      communityPosts: communityPosts.length,
      users: users.length,
      galleryItems: serverGallery.length
    }
  });
}
