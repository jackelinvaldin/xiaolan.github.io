import type { User } from "./types";

const now = new Date().toISOString();

export const users: User[] = [
  {
    id: "u-xiaolan",
    username: "xiaolan",
    displayName: "蓝水梦尘",
    role: "admin",
    avatarUrl: "/images/server/server-home-reading.jpg",
    bio: "服务器策划，喜欢把一束光变成一张地图。",
    joinedAt: now
  },
  {
    id: "u-gravity",
    username: "gravity",
    displayName: "The Gravity",
    role: "admin",
    avatarUrl: "/images/server/storm-ring-relic.jpg",
    bio: "维护服务器稳定运行，记录每一次排障和优化。",
    joinedAt: now
  },
  {
    id: "u-aili",
    username: "aili",
    displayName: "爱莉",
    role: "member",
    avatarUrl: "/images/server/cherry-castle-event.jpg",
    bio: "活动协助和玩家互动，负责把热闹带到现场。",
    joinedAt: now
  }
];
