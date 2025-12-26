import { VideoData, ApiError, DownloadOption } from '../types';
import { TIKTOK_API_ENDPOINT, API_TIMEOUT } from '../constants';

/**
 * Utility to fetch with timeout to prevent hanging requests in production.
 */
const fetchWithTimeout = async (resource: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Fetches video data using a strategy pattern based on the platform.
 */
export const fetchVideoData = async (url: string, platformId: string): Promise<VideoData> => {
  switch (platformId) {
    case 'tiktok':
      return fetchTikTokData(url);
    case 'youtube':
    case 'instagram':
    case 'facebook':
      throw new Error(`The ${platformId} adapter is coming soon in v2.0.`);
    default:
      throw new Error('Unsupported platform selected.');
  }
};

/**
 * Adapter for TikTok API (using tikwm.com public API)
 */
const fetchTikTokData = async (url: string): Promise<VideoData> => {
  try {
    const apiUrl = `${TIKTOK_API_ENDPOINT}?url=${encodeURIComponent(url)}&hd=1`;
    
    const response = await fetchWithTimeout(apiUrl);
    
    if (!response.ok) {
        throw new Error(`External API Error: ${response.status}`);
    }

    const json = await response.json();

    if (json.code !== 0) {
      throw new Error(json.msg || 'Failed to fetch TikTok video. Ensure the link is valid and public.');
    }

    const data = json.data;

    // Logic to select the best quality video available
    const videoUrl = data?.hdplay || data?.play;
    const videoSize = data?.hd_size || data?.size;

    if (!videoUrl) {
        throw new Error("No video source found in the response.");
    }

    // Safety checks using optional chaining
    return {
      id: data?.id || 'unknown',
      platformId: 'tiktok',
      title: data?.title || 'No Title',
      coverUrl: data?.cover || 'https://picsum.photos/400/600',
      author: {
        id: data?.author?.id || 'unknown',
        name: data?.author?.nickname || 'Anonymous',
        avatarUrl: data?.author?.avatar || 'https://picsum.photos/100/100',
      },
      stats: {
        plays: data?.play_count || 0,
        likes: data?.digg_count || 0,
        comments: data?.comment_count || 0,
        shares: data?.share_count || 0,
      },
      downloads: [
        {
          url: videoUrl,
          label: 'Download Video (No Logo)',
          type: 'video_hd' as const,
          ext: 'mp4',
          size: videoSize ? `${(videoSize / 1024 / 1024).toFixed(1)} MB` : undefined,
        },
        {
          url: data?.music,
          label: 'Download MP3',
          type: 'audio' as const,
          ext: 'mp3',
        },
      ].filter((d) => !!d.url) as DownloadOption[],
      fetchedAt: Date.now(),
    };

  } catch (error: any) {
    console.error('API Error:', error);
    if (error.name === 'AbortError') {
        throw new Error('Request timed out. The external service is slow, please try again.');
    }
    throw new Error(error.message || 'Network error occurred while connecting to the API.');
  }
};