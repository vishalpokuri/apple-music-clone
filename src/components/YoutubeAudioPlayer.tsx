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
import DetailsWrapper from "./DetailsWrapper";

function YouTubeAudioPlayer() {
  const playerRef = useRef<YT.Player | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const { visible } = usePopUpSearchBar();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [lyricsReady, setLyricsReady] = useState(false);

  const { isPlaying, setIsPlaying } = useIsPlayingStore();
  const [duration, setDuration] = useState(0);
  const { currentTime, setCurrentTime } = useCurrentTimeStore();
  const { youtubeUrl, lyrics } = useSongDetailStore();

  const [videoId, setVideoId] = useState("");

  // Check if lyrics are loaded
  useEffect(() => {
    if (lyrics && lyrics.length > 0) {
      setLyricsReady(true);
    } else {
      setLyricsReady(false);
    }
  }, [lyrics]);

  // Custom handler for play/pause button
  const handlePlayPause = () => {
    console.log(isPlaying);
    if (!playerReady || !playerRef.current || isLoading) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible && !isLoading && e.code === "Space") {
        console.log("Space pressed");
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

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
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Combined ready state check
  useEffect(() => {
    if (playerReady && lyricsReady) {
      setIsLoading(false);
      if (playerRef.current) {
        // just attempt to play
        setTimeout(() => {
          playerRef.current?.playVideo(); // let onStateChange handle the rest
        }, 500);
      }
    } else {
      setIsLoading(true);
    }
  }, [playerReady, lyricsReady]);

  // Player event handlers
  const onPlayerReady = (event: YT.PlayerEvent) => {
    setDuration(event.target.getDuration());
    setPlayerReady(true); // Mark player as ready
    // Don't auto-play here - wait for both player and lyrics to be ready
  };

  useEffect(() => {
    console.log("Global isPlaying", isPlaying);
  }, [isPlaying]);

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    const isNowPlaying = event.data === window.YT.PlayerState.PLAYING;
    setIsPlaying(isNowPlaying);

    if (isNowPlaying) {
      pollRef.current = setInterval(() => {
        const current = playerRef.current?.getCurrentTime();
        if (current !== undefined) {
          setCurrentTime(current * 1000); // Convert to ms
        }
      }, 250);
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
    if (duration === 0) {
      setDuration(playerRef.current?.getDuration() || 0);
    }
  };

  // Seek functionality for the progress bar
  const seek = (seconds: number) => {
    if (!playerReady || !playerRef.current || isLoading) return;
    playerRef.current.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  return (
    <div className="text-white w-full flex flex-col mt-3">
      {/* Hidden YouTube player */}
      <div id="youtube-player-container" className="hidden"></div>

      <DetailsWrapper handlePlayPause={handlePlayPause}>
        {/* Progress bar */}
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime / 1000}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full opacity-100 cursor-pointer range-slider mb-2"
          disabled={isLoading}
        />
        <ProgressBar />
      </DetailsWrapper>
    </div>
  );
}

export default YouTubeAudioPlayer;
