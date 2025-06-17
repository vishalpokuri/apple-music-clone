import { useSongDetailStore, usePopUpSearchBar } from "../utils/store";
import { useState } from "react";

interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  duration: number;
  index?: number;
}

function MusicResultContainer({
  imgurl,
  title,
  artist,
  downloadUrl,
  duration,
  index = 0,
}: MusicResult) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    setImageUrl,
    setArtist,
    setDownloadUrl,
    setDuration,
    setTitle,
    setLyrics,
    setYoutubeUrl,
  } = useSongDetailStore();

  const setVisible = usePopUpSearchBar((state) => state.setVisible);

  const play = async () => {
    setIsLoading(true);

    try {
      // 1. Set all the details of the song
      setImageUrl(imgurl);
      setArtist(artist);
      setTitle(title);
      setDuration(duration);
      setDownloadUrl(downloadUrl);

      console.time("Youtube fetch");
      // 2. Make both API calls in parallel for better performance
      const [youtubeData, lyrics] = await Promise.all([
        fetchYoutubeUrl(downloadUrl),
        lyricsFetch(),
      ]);
      console.timeEnd("Youtube fetch");

      // 3. Set the data
      setYoutubeUrl(youtubeData.youtubeURL);

      // 4. Process and set the lyrics
      if (lyrics && lyrics.syncedLyrics) {
        setLyrics(parseLyrics(lyrics.syncedLyrics));
      } else {
        // Set a placeholder if no lyrics found
        setLyrics([{ time: 0, text: "No lyrics available" }]);
      }
    } catch (error) {
      console.error("Error loading music data:", error);
      // Set reasonable defaults in case of failure
      setLyrics([{ time: 0, text: "Error loading lyrics" }]);
    } finally {
      setIsLoading(false);
      setVisible(); // Close the search popup
    }
  };

  const fetchYoutubeUrl = async (spotifyUrl: string) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_INVOKE_URL
      }api/song/convert?spotifyURL=${spotifyUrl}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  };

  const lyricsFetch = async () => {
    try {
      const response = await fetch(
        `https://lrclib.net/api/search?q=${`${artist} ${title}`}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const lyrics = filterLyrics(data, duration)[0];
        return lyrics;
      }
      return null;
    } catch (e) {
      console.error("Lyrics fetch error:", e);
      return null;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`group relative w-full flex items-center p-3 rounded-2xl 
                  transition-all duration-300 ease-out
                  hover:bg-gradient-to-r hover:from-zinc-800/50 hover:to-zinc-700/30
                  hover:shadow-lg hover:shadow-black/20
                  ${isLoading ? "opacity-60 cursor-wait" : "cursor-pointer"}
                  border border-transparent hover:border-zinc-600/30`}
      onClick={() => {
        if (!isLoading) {
          play();
        }
      }}
    >
      {/* Album Art with enhanced styling */}
      <div className="relative h-14 w-14 flex-shrink-0 mr-4">
        <img
          src={imgurl}
          alt={`${title} album cover`}
          className="w-full h-full rounded-xl object-cover 
                     shadow-lg group-hover:shadow-xl transition-all duration-300
                     group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-album.jpg";
          }}
        />
        {/* Play overlay on hover */}
        <div
          className="absolute inset-0 bg-black/40 rounded-xl opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300
                        flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M8 5V19L19 12L8 5Z" fill="#000" />
            </svg>
          </div>
        </div>
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0 mr-3">
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="font-title text-white text-base font-medium truncate 
                         group-hover:text-pink-100 transition-colors duration-200"
          >
            {title}
          </h3>
          {index === 0 && (
            <span
              className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-red-500 
                           text-white text-xs font-semibold rounded-full"
            >
              TOP
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <p
            className="font-artist text-zinc-400 truncate 
                        group-hover:text-pink-300 transition-colors duration-200"
          >
            {artist}
          </p>
          <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
          <span className="text-zinc-500 text-xs font-mono">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Loading State / Action Button */}
      <div className="flex-shrink-0 flex items-center">
        {isLoading ? (
          <div className="relative">
            <div
              className="h-8 w-8 border-2 border-pink-500/30 border-t-pink-500 
                           rounded-full animate-spin"
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="p-2 bg-gradient-to-r from-pink-500/20 to-red-500/20 
                             hover:from-pink-500/30 hover:to-red-500/30
                             rounded-xl transition-all duration-200 hover:scale-110"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="#ff4e6b" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Subtle border effect */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r 
                      from-transparent via-zinc-700/50 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>
  );
}

export default MusicResultContainer;

function filterLyrics(
  lyricsArray: { duration: number; syncedLyrics: string }[],
  songDuration: number
) {
  /*
  //create a function to get filter lyrics based on the parameters 
  1. Duration
  2. Song title + artist name
  3. Synced
  */

  const filtered = lyricsArray.filter(
    (item: { duration: number; syncedLyrics: string }) => {
      const matchesDuration = item.duration - songDuration <= 2 ? true : false;
      const syncedavailable = item.syncedLyrics != null ? true : false;
      return matchesDuration && syncedavailable;
    }
  );

  return filtered.length > 0 ? filtered : [lyricsArray[0]]; // Return first item if no matches
}

function parseLyrics(rawLyrics: string) {
  if (!rawLyrics) return [{ time: 0, text: "No lyrics available" }];

  const lines = rawLyrics.trim().split("\n");
  const parsed = [];

  parsed.push({ time: 0, text: ". . ." });

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2}\.\d{2})\]\s*(.+)$/);
    if (match) {
      const [, min, sec, text] = match;
      const time = parseInt(min) * 60 + parseFloat(sec);
      parsed.push({ time, text });
    }
  }

  return parsed.length > 1
    ? parsed
    : [{ time: 0, text: "No synced lyrics available" }];
}
