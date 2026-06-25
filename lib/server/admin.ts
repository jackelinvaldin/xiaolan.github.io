import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/server/password";

export function adminUsername() {
  return (process.env.ADMIN_USERNAME ?? "xiaolan_admin").trim().toLowerCase();
}

export function isReservedAdminUsername(username: string) {
  return username.trim().toLowerCase() === adminUsername();
}

export async function ensureAdminUser(usernameInput: string, password: string) {
  const username = usernameInput.trim().toLowerCase();
  if (!isReservedAdminUsername(username)) return null;

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || password !== expectedPassword) return null;

  const displayName = process.env.ADMIN_DISPLAY_NAME ?? "小蓝";
  const passwordHash = hashPassword(expectedPassword);

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        role: "ADMIN",
        disabled: false,
        displayName
      }
    });
  }

  return prisma.user.create({
    data: {
      username,
      displayName,
      passwordHash,
      role: "ADMIN",
      bio: "琢光绮梦管理员"
    }
  });
}
