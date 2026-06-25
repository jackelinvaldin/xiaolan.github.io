import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/repository";

export async function GET() {
  const data = await getAnnouncements();
  return NextResponse.json({ data });
}
