
/**
 * Extracts the YouTube video ID from various YouTube URL formats
 */
export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Try to match various YouTube URL patterns
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Formats time in seconds to a readable format (MM:SS or HH:MM:SS)
 */
export function formatTime(timeInSeconds: number): string {
  if (isNaN(timeInSeconds)) return '00:00';
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  // Format with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  if (hours > 0) {
    const formattedHours = String(hours).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Creates a valid YouTube embed URL from a video ID
 */
export function createYoutubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
}

/**
 * Validates if a string is a valid YouTube URL
 */
export function isValidYoutubeUrl(url: string): boolean {
  return !!extractYoutubeVideoId(url);
}
