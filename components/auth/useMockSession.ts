"use client";

import { useSyncExternalStore } from "react";
import type { UserRole } from "@/lib/data/types";

const roleKey = "zq_role";
const nameKey = "zq_display_name";
const sessionEvent = "zq_session_changed";

type SessionSnapshot = {
  role: UserRole;
  displayName: string;
};

const fallbackSession: SessionSnapshot = {
  role: "guest",
  displayName: "游客"
};

let cachedSession = fallbackSession;

function normalizeRole(role: string | null): UserRole {
  return role === "member" || role === "admin" ? role : "guest";
}

function defaultName(role: UserRole) {
  if (role === "admin") return "小蓝";
  if (role === "member") return "爱莉";
  return "游客";
}

function getSnapshot(): SessionSnapshot {
  if (typeof window === "undefined") return fallbackSession;
  const role = normalizeRole(window.localStorage.getItem(roleKey));
  const displayName = window.localStorage.getItem(nameKey) ?? defaultName(role);

  if (cachedSession.role === role && cachedSession.displayName === displayName) {
    return cachedSession;
  }

  cachedSession = { role, displayName };
  return cachedSession;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(sessionEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(sessionEvent, callback);
  };
}

export function useMockSession() {
  const session = useSyncExternalStore(subscribe, getSnapshot, () => fallbackSession);

  function setRole(nextRole: UserRole, nextName?: string) {
    const name = nextName ?? defaultName(nextRole);
    window.localStorage.setItem(roleKey, nextRole);
    window.localStorage.setItem(nameKey, name);
    window.dispatchEvent(new Event(sessionEvent));
  }

  function logout() {
    setRole("guest", "游客");
  }

  return { role: session.role, displayName: session.displayName, ready: true, setRole, logout };
}
