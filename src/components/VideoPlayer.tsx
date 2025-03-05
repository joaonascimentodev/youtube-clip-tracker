
import React, { useEffect, useRef } from 'react';
import { createYoutubeEmbedUrl } from '@/utils/youtubeUtils';

// Define YouTube player API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, any>;
          events?: Record<string, (event: any) => void>;
        }
      ) => {
        getCurrentTime: () => number;
        playVideo: () => void;
        pauseVideo: () => void;
        seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string | null;
  onPlayerReady: (player: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onPlayerReady }) => {
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      // Clean up player on unmount
      if (playerRef.current) {
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoId || !playerContainerRef.current) return;

    // Destroy existing player if it exists
    if (playerRef.current) {
      playerRef.current = null;
      if (playerContainerRef.current) {
        playerContainerRef.current.innerHTML = '<div id="youtube-player"></div>';
      }
    }

    // Create new player
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        fs: 1,
      },
      events: {
        onReady: (event) => {
          onPlayerReady(event.target);
        },
      },
    });
  };

  if (!videoId) {
    return (
      <div className="youtube-player-wrapper bg-muted/40 flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">
          <p className="font-medium">Enter a YouTube URL to load a video</p>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-player-wrapper animate-fade-in">
      <div ref={playerContainerRef} className="w-full h-full">
        <div id="youtube-player"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
