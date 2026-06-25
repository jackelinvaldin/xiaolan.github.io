import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { adminUsername, ensureAdminUser } from "@/lib/server/admin";
import { verifyPassword } from "@/lib/server/password";
import { setSessionCookie } from "@/lib/server/session";
import type { UserRole } from "@/lib/data/types";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能登录" }, { status: 503 });
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 24) {
    return NextResponse.json({ error: "服务器尚未配置登录密钥 AUTH_SECRET" }, { status: 503 });
  }

  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  const username = parsed.data.username.trim().toLowerCase();
  const reservedAdmin = adminUsername();
  const adminUser = username === reservedAdmin ? await ensureAdminUser(username, parsed.data.password) : null;
  const user = adminUser ?? (username === reservedAdmin ? null : await prisma.user.findUnique({ where: { username } }));

  if (!user || user.disabled || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: "用户名或密码不正确" }, { status: 401 });
  }
  if (user.role === "ADMIN" && user.username !== reservedAdmin) {
    return NextResponse.json({ error: "该账号没有管理员登录权限" }, { status: 403 });
  }

  const role = user.role.toLowerCase() as UserRole;
  await setSessionCookie({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role
  });

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role
    }
  });
}
