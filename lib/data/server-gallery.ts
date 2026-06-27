import type { ServerGalleryItem } from "./types";

export const galleryCategoryLabels: Record<ServerGalleryItem["category"], string> = {
  group: "玩家合照",
  event: "活动现场",
  building: "主城建筑",
  nature: "自然风景",
  future: "未来地图",
  survival: "生存发展"
};

export const serverGallery: ServerGalleryItem[] = [
  {
    id: "g-home",
    title: "服务器首页背景",
    category: "group",
    categoryName: "玩家日常",
    description: "阳光、草地和并肩阅读的玩家，适合作为服务器入口的第一印象。",
    imageUrl: "/images/server/server-home-reading.jpg",
    featured: true
  },
  {
    id: "g-ring-rain",
    title: "极夜幻光",
    category: "nature",
    categoryName: "风景巡礼",
    description: "极光与月影铺在水面上，适合承接第二屏的探索氛围。",
    imageUrl: "/images/server/future-ring-rain.jpg",
    featured: true
  },
  {
    id: "g-storm",
    title: "雨幕遗构",
    category: "future",
    categoryName: "地图档案",
    description: "以服务器首页素材作为星环之境的清晰背景，保留玩家日常与地图入口的连续感。",
    imageUrl: "/images/server/server-home-reading.jpg",
    featured: true
  },
  {
    id: "g-main",
    title: "晨光主城合影",
    category: "group",
    categoryName: "玩家合照",
    description: "服务器成员在主城入口集合，适合作为团队氛围展示。",
    imageUrl: "/images/server/group-main-gate.jpg"
  },
  {
    id: "g-cherry",
    title: "樱庭庆典",
    category: "event",
    categoryName: "活动现场",
    description: "暖色天空下的活动现场，适合公告和活动页封面。",
    imageUrl: "/images/server/cherry-castle-event.jpg"
  },
  {
    id: "g-lantern",
    title: "玩家合照",
    category: "group",
    categoryName: "社区玩家",
    description: "红灯笼与主城门楼前的合影，记录服务器共同参与的时刻。",
    imageUrl: "/images/server/group-red-lantern.jpg"
  },
  {
    id: "g-party",
    title: "粉阶小队",
    category: "group",
    categoryName: "玩家日常",
    description: "粉色台阶上的小队合影，适合日常记录卡片。",
    imageUrl: "/images/server/pink-stairs-small-party.jpg"
  },
  {
    id: "g-snow",
    title: "雪境原野",
    category: "nature",
    categoryName: "自然风景",
    description: "低饱和雪境和远处建筑，适合风景巡礼。",
    imageUrl: "/images/server/snow-wilderness.jpg"
  },
  {
    id: "g-aurora",
    title: "极夜幻光",
    category: "nature",
    categoryName: "夜景极光",
    description: "紫色极光压低在树影上方，适合夜景专题。",
    imageUrl: "/images/server/purple-aurora-night.jpg"
  },
  {
    id: "g-sci-fi",
    title: "星环遗构",
    category: "future",
    categoryName: "未来建筑",
    description: "巨型环状建筑悬在雾中，适合地图档案页。",
    imageUrl: "/images/server/sci-fi-ring-view.jpg"
  },
  {
    id: "g-survival",
    title: "日暮家园",
    category: "survival",
    categoryName: "生存发展",
    description: "日暮下的基地和飞船影子，适合生存发展专题。",
    imageUrl: "/images/server/sunset-survival-base.jpg"
  },
  {
    id: "g-tree",
    title: "金树落日",
    category: "building",
    categoryName: "主城建筑",
    description: "金色天空与红叶树，是服务器里很适合停留的风景点。",
    imageUrl: "/images/server/golden-tree-sunset.jpg"
  }
];

export const serverScenes = [
  {
    id: "home",
    number: "01",
    label: "服务器首页",
    title: "服务器首页",
    subtitle: "在方块世界里相遇、建造与记录每一天",
    imageUrl: "/images/server/server-home-reading.jpg",
    primaryAction: "进入服务器",
    secondaryAction: "浏览地图"
  },
  {
    id: "aurora",
    number: "02",
    label: "极夜巡礼",
    title: "极夜幻光",
    subtitle: "沿着水面与星光前行，收集服务器最安静的夜景。",
    imageUrl: "/images/server/future-ring-rain.jpg",
    primaryAction: "查看风景",
    secondaryAction: "打开相册"
  },
  {
    id: "relic",
    number: "03",
    label: "未来遗构",
    title: "星环之境",
    subtitle: "穿越云雾与雨幕，探索被遗忘的未来文明。",
    imageUrl: "/images/server/server-home-reading.jpg",
    primaryAction: "进入地图",
    secondaryAction: "坐标档案"
  }
];
