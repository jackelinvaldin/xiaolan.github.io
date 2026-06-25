import { NextResponse } from "next/server";
import { getGalleryItems } from "@/lib/repository";

export async function GET() {
  const data = await getGalleryItems();
  return NextResponse.json({ data });
}
