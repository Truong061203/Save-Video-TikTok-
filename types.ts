export interface Platform {
  id: string;
  name: string;
  iconName: string; // Lucide icon name string
  accentColor: string; // Tailwind color class e.g., 'text-pink-500'
  regex: RegExp;
  placeholder: string;
  isImplemented: boolean;
}

export interface VideoStats {
  plays: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface DownloadOption {
  url: string;
  label: string;
  type: 'video_hd' | 'video_sd' | 'audio' | 'video_watermark';
  ext: string;
  size?: string;
}

export interface VideoData {
  id: string;
  platformId: string;
  title: string;
  coverUrl: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  stats: VideoStats;
  downloads: DownloadOption[];
  fetchedAt: number;
}

export interface ApiError {
  message: string;
  code?: string;
}