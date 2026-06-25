import type { Announcement } from "./types";

export const announcementTypeLabels: Record<Announcement["type"], string> = {
  maintenance: "服务器维护",
  event: "活动公告",
  update: "版本更新",
  rule: "社区规则",
  recruit: "招募公告",
  important: "重要通知"
};

export const announcements: Announcement[] = [
  {
    id: "a-001",
    slug: "summer-build-night",
    title: "夏夜共建活动开放报名",
    summary: "本周末开放主城东侧花园共建，欢迎提交建筑草图和材料清单。",
    content:
      "本周末我们会开放主城东侧花园共建区。参与者可以提前准备建筑草图，活动当天由爱莉协助分组，小蓝会根据区域规划给出建造边界。作品会进入服务器风景相册。",
    type: "event",
    authorName: "爱莉",
    pinned: true,
    publishedAt: "2026-06-25"
  },
  {
    id: "a-002",
    slug: "server-maintenance-window",
    title: "服务器维护窗口通知",
    summary: "The Gravity 将进行区块缓存清理和插件版本核对，预计维护 40 分钟。",
    content:
      "为保证服务器稳定运行，The Gravity 将在今晚进行区块缓存清理、插件版本核对和备份校验。维护期间玩家无法进入服务器，请提前保存背包和当前位置。",
    type: "maintenance",
    authorName: "The Gravity",
    publishedAt: "2026-06-24"
  },
  {
    id: "a-003",
    slug: "future-ring-map-preview",
    title: "星环之境地图预览上线",
    summary: "未来遗构区域开放预览，雨幕、悬浮平台和星环建筑已进入测试。",
    content:
      "星环之境是独木桥正在制作的未来遗构地图。当前版本包含雨幕平台、空中环形结构、探索路线和临时坐标档案，适合小队探索和截图巡礼。",
    type: "update",
    authorName: "独木桥",
    publishedAt: "2026-06-23"
  }
];
