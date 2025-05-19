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
    loadVideoById(videoId: string): unknown;
    playVideo(): void;
    pauseVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    destroy(): void;
    setVolume(volume: number): void;
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
import VolumeController from "./VolumeController";
import ControlButtons from "./subComponents/ControlButtons";
function YouTubeAudioPlayerMobile() {
  const playerRef = useRef<YT.Player | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  const { visible } = usePopUpSearchBar();

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [lyricsReady, setLyricsReady] = useState(false);

  const { isPlaying, setIsPlaying } = useIsPlayingStore();
  const { currentTime, setCurrentTime } = useCurrentTimeStore();
  const [duration, setDuration] = useState(0);
  const { youtubeUrl, lyrics } = useSongDetailStore();

  const { videoId, setVideoId } = useSongDetailStore();

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
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isLoading, visible]);

  useEffect(() => {
    if (youtubeUrl && youtubeUrl.includes("v=")) {
      setVideoId(youtubeUrl.split("v=")[1]);
    }
  }, [youtubeUrl, setVideoId]);

  // Load YouTube IFrame API
  useEffect(() => {
    // Create script tag if YouTube API isn't loaded yet
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];

      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player && !initializedRef.current) {
      initializePlayer();
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (!initializedRef.current) {
        initializePlayer();
      }
    };
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current && playerReady && videoId) {
      playerRef.current.loadVideoById(videoId);
      playerRef.current.playVideo();
    }
  }, [videoId, playerReady]);

  // Initialize YouTube player
  const initializePlayer = () => {
    if (!videoId || initializedRef.current) return;

    initializedRef.current = true;

    // Clean up any existing player
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("youtube-player-container", {
      height: "200", // Hidden video
      width: "200",
      videoId,
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

  // Combined ready state check
  useEffect(() => {
    if (playerReady && lyricsReady) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [playerReady, lyricsReady]);

  // Player event handlers
  const onPlayerReady = (event: YT.PlayerEvent) => {
    event.target.setVolume(50); // optional: set default volume
    event.target.playVideo();
    setDuration(event.target.getDuration());

    setPlayerReady(true); // Mark player as ready
    // Don't auto-play here - wait for both player and lyrics to be ready
  };

  // useEffect(() => {
  //   console.log("Global isPlaying", isPlaying);
  // }, [isPlaying]);

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
    setCurrentTime(seconds * 1000);
  };

  return (
    <div className="text-white max-w-[90vw] flex flex-col mt-3 sm:hidden overflow-hidden">
      {/* Hidden YouTube player */}
      <div id="youtube-player-container" className="hidden"></div>

      {/* Progress bar */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime / 1000}
        onChange={(e) => {
          seek(Number(e.target.value));
        }}
        className="w-full opacity-100 cursor-pointer range-slider mt-1 mb-2 select-none"
        disabled={isLoading}
      />

      <ProgressBar />
      <ControlButtons handlePlayPause={handlePlayPause} isLoading={isLoading} />
      <VolumeController playerRef={playerRef} />
    </div>
  );
}

export default YouTubeAudioPlayerMobile;
