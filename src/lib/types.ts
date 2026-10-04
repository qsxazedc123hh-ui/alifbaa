// Shared types for Alif Baa platform

export interface WhatsAppNumber {
  id: string;
  name: string;
  number: string;
  order: number;
  visible: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
  visible: boolean;
}

export interface CampusItem {
  id: string;
  key: string;
  label: string;
  iconKey: string | null;
  customUrl: string | null;
  sectionKey: string | null;
  order: number;
  visible: boolean;
  inBottomNav: boolean;
  bottomNavOrder: number;
}

export interface CampusBackground {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  type: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  duration: number | null;
  size: number;
  mimeType: string | null;
  section: string;
  featured: boolean;
  published: boolean;
  order: number;
  publishedAt: string;
}

export interface News {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  imageUrl: string | null;
  videoId: string | null;
  video?: Video | null;
  featured: boolean;
  published: boolean;
  order: number;
  publishedAt: string;
}

export interface AppLink {
  id: string;
  name: string;
  url: string;
  type: string;
  icon: string | null;
  order: number;
  visible: boolean;
}

export interface AppRelease {
  id: string;
  platform: string;
  version: string;
  versionCode: number;
  nameAr: string;
  apkUrl: string;
  fileSize: number;
  published: boolean;
  isLatest: boolean;
  releasedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
