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
import {
  useSongDetailStore,
  useIsPlayingStore,
  useCurrentTimeStore,
  usePopUpSearchBar,
} from "../utils/store";
import ProgressBar from "./ProgressBar";

function YouTubeAudioPlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const { visible } = usePopUpSearchBar();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [lyricsReady, setLyricsReady] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const { isPlaying, setIsPlaying, toggleIsPlaying } = useIsPlayingStore();
  const [duration, setDuration] = useState(0);
  const { currentTime, setCurrentTime } = useCurrentTimeStore();
  const { startInterval, pauseInterval } = useCurrentTimeStore();
  const { title, artist, youtubeUrl, lyrics } = useSongDetailStore();

  const [videoId, setVideoId] = useState("");

  // Check if lyrics are loaded
  useEffect(() => {
    if (lyrics && lyrics.length > 0) {
      setLyricsReady(true);
    } else {
      setLyricsReady(false);
    }
  }, [lyrics]);

  // Combined ready state check
  useEffect(() => {
    if (playerReady && lyricsReady) {
      setIsLoading(false);
      if (playerRef.current) {
        // Short delay to ensure everything is truly ready
        setTimeout(() => {
          playerRef.current?.playVideo();
          setIsPlaying(true);
          startInterval();
        }, 500);
      }
    } else {
      setIsLoading(true);
    }
  }, [playerReady, lyricsReady, startInterval, setIsPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible && !isLoading && e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isLoading]);

  useEffect(() => {
    if (youtubeUrl && youtubeUrl.includes("v=")) {
      setVideoId(youtubeUrl.split("v=")[1]);
      // Reset player ready state when URL changes
      setPlayerReady(false);
    }
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
    if (window.YT && window.YT.Player && videoId) {
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
    if (!videoId) return;

    // Clean up any existing player
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player-container", {
      height: "200", // Hidden video
      width: "200",
      videoId: videoId,
      playerVars: {
        autoplay: 0, // Don't autoplay initially
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
    setPlayerReady(true); // Mark player as ready
    // Don't auto-play here - wait for both player and lyrics to be ready
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);

    // Update duration if it wasn't available before
    if (duration === 0) {
      setDuration(playerRef.current?.getDuration() || 0);
    }
  };

  // Custom handler for play/pause button
  const handlePlayPause = () => {
    if (!isReady || !playerRef.current || isLoading) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      pauseInterval();
    } else {
      playerRef.current.playVideo();
      startInterval();
    }
    toggleIsPlaying();
  };

  // Seek functionality for the progress bar
  const seek = (seconds: number) => {
    if (!isReady || !playerRef.current || isLoading) return;
    playerRef.current.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  // Update current time periodically when playing
  useEffect(() => {
    if (isPlaying && playerRef.current && !isLoading) {
      startInterval();
    } else {
      pauseInterval();
    }

    return () => {
      pauseInterval();
    };
  }, [isPlaying, startInterval, pauseInterval, toggleIsPlaying, isLoading]);

  // Render loading state or player UI
  if (isLoading) {
    return (
      <div className="text-white w-full flex flex-col items-center justify-center mt-3">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-2 bg-gray-700 rounded w-full mb-6"></div>
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="text-sm mt-3 text-gray-400">Loading music...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white w-full flex flex-col mt-3">
      {/* Hidden YouTube player */}
      <div id="youtube-player-container" className="hidden"></div>

      {/* Song details */}
      <div className="font-title opacity-90 text-sm/4">{title}</div>
      <div className="font-artist opacity-75 mb-2 text-sm/5">{artist}</div>

      {/* Progress bar */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime / 1000}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full opacity-100 cursor-pointer"
        disabled={isLoading}
      />
      <ProgressBar />

      {/* Control buttons */}
      <div className="flex w-3/5 mx-auto justify-around">
        <img
          src="/assets/backwardf.png"
          className="w-7 opacity-60"
          alt="Previous"
        />
        <div className="cursor-pointer" onClick={handlePlayPause}>
          {isPlaying ? (
            <img src="/assets/pausef.png" className="w-7" alt="Pause" />
          ) : (
            <img src="/assets/playf.png" className="w-7" alt="Play" />
          )}
        </div>
        <img src="/assets/forwardf.png" className="w-7 opacity-60" alt="Next" />
      </div>
    </div>
  );
}

export default YouTubeAudioPlayer;
