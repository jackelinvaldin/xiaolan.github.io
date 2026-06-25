import { announcements } from "./announcements";
import { communityPosts } from "./community";
import { serverGallery } from "./server-gallery";
import { teamMembers } from "./team";
import { users } from "./users";

export const siteName = "琢光绮梦";
export const siteNameEn = "ZHUO GUANG QI MENG";

export const serverStatus = {
  state: "在线中",
  latency: "42 ms",
  version: "1.20.1",
  players: "18 / 64",
  event: "活动进行中"
};

export const mockDb = {
  announcements,
  communityPosts,
  serverGallery,
  teamMembers,
  users
};
