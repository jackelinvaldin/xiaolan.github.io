import { NextResponse } from "next/server";
import { z } from "zod";
import { hasDatabase, prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/server/password";
import { isReservedAdminUsername } from "@/lib/server/admin";
import { setSessionCookie } from "@/lib/server/session";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "用户名至少 3 个字符")
    .max(32, "用户名最多 32 个字符")
    .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
  displayName: z.string().min(1, "请输入昵称").max(24, "昵称最多 24 个字符"),
  password: z.string().min(8, "密码至少 8 位")
});

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "服务器尚未配置数据库，暂时不能注册" }, { status: 503 });
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 24) {
    return NextResponse.json({ error: "服务器尚未配置登录密钥 AUTH_SECRET" }, { status: 503 });
  }

  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "注册信息不正确" }, { status: 400 });
  }

  const username = parsed.data.username.trim().toLowerCase();
  if (isReservedAdminUsername(username)) {
    return NextResponse.json({ error: "该用户名不可注册" }, { status: 403 });
  }

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    return NextResponse.json({ error: "用户名已存在" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      username,
      displayName: parsed.data.displayName.trim(),
      passwordHash: hashPassword(parsed.data.password),
      role: "MEMBER"
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true
    }
  });

  await setSessionCookie({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: "member"
  });

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: "member"
    }
  });
}
