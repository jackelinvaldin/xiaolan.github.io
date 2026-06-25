import type { CommunityPost, ProfilePost } from "./types";

export const categoryLabels: Record<CommunityPost["category"], string> = {
  chat: "闲聊区",
  suggestion: "服务器建议区",
  build: "建筑展示区",
  event: "活动讨论区",
  official: "官方回复区"
};

export const communityPosts: CommunityPost[] = [
  {
    id: "p-001",
    authorId: "u-aili",
    authorName: "爱莉",
    title: "周末共建活动征集小队",
    content: "想报名主城花园共建的小伙伴可以在这里留言。优先安排愿意做路径、灯光和小景观的人。",
    category: "event",
    visibility: "public",
    likes: 24,
    replies: 8,
    pinned: true,
    createdAt: "2026-06-25 20:10"
  },
  {
    id: "p-002",
    authorId: "u-xiaolan",
    authorName: "小蓝",
    title: "想给服务器首页加一个玩家故事位",
    content: "首页可以每周展示一张玩家截图和一句短故事，大家更容易记住服务器里的日常。",
    category: "suggestion",
    visibility: "public",
    likes: 31,
    replies: 13,
    createdAt: "2026-06-25 18:42"
  },
  {
    id: "p-003",
    authorId: "u-gravity",
    authorName: "The Gravity",
    title: "插件日志已整理",
    content: "今天的延迟峰值主要来自区块加载，维护窗口会处理缓存和视距设置。",
    category: "official",
    visibility: "public",
    likes: 18,
    replies: 4,
    createdAt: "2026-06-24 23:18"
  }
];

export const profilePosts: ProfilePost[] = [
  {
    id: "profile-001",
    authorId: "u-xiaolan",
    content: "把第一屏背景换成玩家阅读场景后，官网会更像一个可进入的服务器入口。",
    imageUrl: "/images/server/server-home-reading.jpg",
    visibility: "public",
    createdAt: "2026-06-25 21:00"
  },
  {
    id: "profile-002",
    authorId: "u-xiaolan",
    content: "星环之境的雨幕氛围已经很接近目标，需要继续调亮可读区域。",
    imageUrl: "/images/server/storm-ring-relic.jpg",
    visibility: "private",
    createdAt: "2026-06-25 21:20"
  }
];
