import type { UserRole } from "./data/types";

export const roleLabels: Record<UserRole, string> = {
  guest: "游客",
  member: "普通成员",
  admin: "管理员"
};

export function canCreatePost(role: UserRole) {
  return role === "member" || role === "admin";
}

export function canAccessProfile(role: UserRole) {
  return role === "member" || role === "admin";
}

export function canAccessAdmin(role: UserRole) {
  return role === "admin";
}
