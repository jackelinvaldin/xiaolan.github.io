"use client";

import { useCallback, useEffect, useState } from "react";
import type { UserRole } from "@/lib/data/types";

type SessionState = {
  id?: string;
  username?: string;
  role: UserRole;
  displayName: string;
  ready: boolean;
};

const guestSession: SessionState = {
  role: "guest",
  displayName: "游客",
  ready: false
};

export function useMockSession() {
  const [session, setSession] = useState<SessionState>(guestSession);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as {
        user?: {
          id: string;
          username: string;
          displayName: string;
          role: UserRole;
        } | null;
      };

      if (data.user) {
        setSession({
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          displayName: data.user.displayName,
          ready: true
        });
      } else {
        setSession({ role: "guest", displayName: "游客", ready: true });
      }
    } catch {
      setSession({ role: "guest", displayName: "游客", ready: true });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession({ role: "guest", displayName: "游客", ready: true });
  }

  return { ...session, refresh, logout };
}
