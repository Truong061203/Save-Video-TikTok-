import { Platform } from './types';

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds timeout
export const TIKTOK_API_ENDPOINT = 'https://www.tikwm.com/api/';

export const PLATFORMS: Platform[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    iconName: 'Music2',
    accentColor: 'text-cyan-400',
    regex: /tiktok\.com/,
    placeholder: 'Paste TikTok link (e.g., https://vt.tiktok.com/...)',
    isImplemented: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    iconName: 'Youtube',
    accentColor: 'text-red-500',
    regex: /(youtube\.com|youtu\.be)/,
    placeholder: 'Paste YouTube link...',
    isImplemented: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    iconName: 'Instagram',
    accentColor: 'text-fuchsia-500',
    regex: /instagram\.com/,
    placeholder: 'Paste Instagram reel link...',
    isImplemented: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    iconName: 'Facebook',
    accentColor: 'text-blue-500',
    regex: /facebook\.com/,
    placeholder: 'Paste Facebook video link...',
    isImplemented: false,
  },
];

export const MOCK_DELAY = 1500; // Simulated latency for non-implemented platforms