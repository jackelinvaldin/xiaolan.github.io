export type UserRole = "guest" | "member" | "admin";

export type TeamMember = {
  id: string;
  formalName: string;
  displayName: string;
  role: string;
  description: string;
  accent: string;
  avatarUrl?: string;
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  bio?: string;
  joinedAt: string;
};

export type CommunityCategory = "chat" | "suggestion" | "build" | "event" | "official";
export type Visibility = "public" | "private" | "team";

export type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  title?: string;
  content: string;
  category: CommunityCategory;
  visibility: Visibility;
  likes: number;
  replies: number;
  pinned?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type AnnouncementType = "maintenance" | "event" | "update" | "rule" | "recruit" | "important";

export type Announcement = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  type: AnnouncementType;
  authorName: string;
  pinned?: boolean;
  publishedAt: string;
};

export type ServerGalleryCategory =
  | "group"
  | "event"
  | "building"
  | "nature"
  | "future"
  | "survival";

export type ServerGalleryItem = {
  id: string;
  title: string;
  category: ServerGalleryCategory;
  categoryName: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
};

export type ProfilePost = {
  id: string;
  authorId: string;
  content: string;
  imageUrl?: string;
  visibility: Visibility;
  createdAt: string;
};
