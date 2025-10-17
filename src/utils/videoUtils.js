/**
 * Utility functions for handling video URLs from YouTube and Bunny services
 */

/**
 * Detects if a URL is a YouTube URL
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is a YouTube URL
 */
export const isYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'youtube.com' ||
           urlObj.hostname === 'www.youtube.com' ||
           urlObj.hostname === 'youtu.be';
  } catch {
    return false;
  }
};

/**
 * Detects if a URL is a Bunny.net URL
 * @param {string} url - The URL to check
 * @returns {boolean} True if the URL is a Bunny.net URL
 */
export const isBunnyUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('bunny.net') ||
           urlObj.hostname.includes('b-cdn.net');
  } catch {
    return false;
  }
};

/**
 * Extracts video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null if not found
 */
export const extractYouTubeVideoId = (url) => {
  if (!isYouTubeUrl(url)) return null;

  try {
    const urlObj = new URL(url);

    // Handle youtube.com URLs
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }

    // Handle youtu.be URLs
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Converts YouTube URL to embed format
 * @param {string} url - YouTube URL
 * @returns {string|null} Embed URL or null if invalid
 */
export const convertToYouTubeEmbed = (url) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Processes a video URL and returns appropriate embed URL
 * @param {string} url - Video URL (YouTube or Bunny)
 * @returns {object} Object containing embed URL and service type
 */
export const processVideoUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      embedUrl: null,
      service: null,
      error: 'Invalid URL provided'
    };
  }

  // Handle YouTube URLs
  if (isYouTubeUrl(url)) {
    const embedUrl = convertToYouTubeEmbed(url);
    if (embedUrl) {
      return {
        embedUrl,
        service: 'youtube',
        error: null
      };
    } else {
      return {
        embedUrl: null,
        service: null,
        error: 'Invalid YouTube URL format'
      };
    }
  }

  // Handle Bunny URLs (return as-is since they're already embeddable)
  if (isBunnyUrl(url)) {
    return {
      embedUrl: url,
      service: 'bunny',
      error: null
    };
  }

  // Unknown service
  return {
    embedUrl: null,
    service: null,
    error: 'Unsupported video service. Only YouTube and Bunny.net URLs are supported.'
  };
};

/**
 * Validates if a URL is a supported video service
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is from a supported service
 */
export const isSupportedVideoUrl = (url) => {
  return isYouTubeUrl(url) || isBunnyUrl(url);
};

/**
 * Gets the embed URL for a video URL with error handling
 * @param {string} url - Video URL
 * @param {object} options - Options for processing
 * @param {boolean} options.throwOnError - Whether to throw error instead of returning null
 * @returns {string|null} Embed URL or null if error and throwOnError is false
 */
export const getEmbedUrl = (url, options = {}) => {
  const { throwOnError = false } = options;

  const result = processVideoUrl(url);

  if (result.error) {
    if (throwOnError) {
      throw new Error(result.error);
    }
    return null;
  }

  return result.embedUrl;
};