// YouTube IFrame API type definitions
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace YT {
  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  interface Player {
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    destroy(): void;
  }
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          height: string;
          width: string;
          videoId: string;
          playerVars: {
            autoplay: number;
            controls: number;
            disablekb: number;
            fs: number;
            iv_load_policy: number;
            modestbranding: number;
            rel: number;
          };
          events: {
            onReady: (event: YT.PlayerEvent) => void;
            onStateChange: (event: YT.OnStateChangeEvent) => void;
          };
        }
      ) => YT.Player;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

import { useState, useEffect, useRef } from "react";
import { useSongDetailStore } from "../utils/store";
function YouTubeAudioPlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoId, setVideoId] = useState("");

  const { youtubeUrl } = useSongDetailStore();
  useEffect(() => {
    setVideoId(youtubeUrl.split("v=")[1]);
  }, [youtubeUrl]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Create script tag if YouTube API isn't loaded yet
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;

    // If API was already loaded before this component mounted
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }

    return () => {
      // Clean up
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Initialize YouTube player
  const initializePlayer = () => {
    playerRef.current = new window.YT.Player("youtube-player-container", {
      height: "200", // Hidden video
      width: "200",
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  // Player event handlers
  const onPlayerReady = (event: YT.PlayerEvent) => {
    setIsReady(true);
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);

    // Update duration if it wasn't available before
    if (duration === 0) {
      setDuration(playerRef.current?.getDuration() || 0);
    }
  };

  // Control functions
  const playPause = () => {
    if (!isReady) return;

    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (seconds: number) => {
    if (!isReady) return;
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  // Update current time periodically when playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const time = playerRef.current?.getCurrentTime() || 0;
        setCurrentTime(time);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="audio-player">
      {/* Hidden YouTube player */}
      <div id="youtube-player-container" className="hidden"></div>

      {/* Custom audio controls */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={playPause}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="absolute w-full opacity-0 cursor-pointer"
            style={{ margin: 0, height: "8px", top: "-8px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default YouTubeAudioPlayer;
