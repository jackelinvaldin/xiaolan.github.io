import type { TeamMember } from "./types";

export const teamMembers: TeamMember[] = [
  {
    id: "xiaolan",
    formalName: "蓝水梦尘",
    displayName: "小蓝",
    role: "服务器策划",
    accent: "#82C7FF",
    avatarUrl: "/images/ui/nahida-avatar.png",
    description: "负责服务器整体方向、玩法构思和网站内容规划。纳西妲天下第一可爱。"
  },
  {
    id: "gravity",
    formalName: "The Gravity",
    displayName: "The Gravity",
    role: "服务器维护",
    accent: "#A78BFA",
    description: "负责服务器运行维护、技术支持、问题排查与稳定性保障。"
  },
  {
    id: "aili",
    formalName: "爱莉",
    displayName: "爱莉",
    role: "活动协助",
    accent: "#FF9FE6",
    description: "负责服务器活动协助、社区氛围维护、玩家互动和活动公告辅助。"
  },
  {
    id: "bridge",
    formalName: "独木桥",
    displayName: "独木桥",
    role: "地图创作",
    accent: "#4ADE80",
    description: "负责地图设计、建筑场景、世界区域与视觉内容创作。"
  }
];

export const teamIntro =
  "琢光绮梦是由小蓝、爱莉、The Gravity、独木桥等成员组成的 Minecraft 服务器创作团队。我们围绕服务器策划、运行维护、活动协助与地图创作展开协作，希望在方块世界里创造一个有温度、有风景、有故事的社区空间。";
