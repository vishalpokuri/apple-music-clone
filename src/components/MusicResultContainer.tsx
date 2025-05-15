import { useSongDetailStore, usePopUpSearchBar } from "../utils/store";
import { useState } from "react";

interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  duration: number;
}

function MusicResultContainer({
  imgurl,
  title,
  artist,
  downloadUrl,
  duration,
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
    const response = await fetch(import.meta.env.VITE_INVOKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spotifyURL: spotifyUrl }),
    });

    const data = await response.json();
    return data;
  };

  const lyricsFetch = async () => {
    try {
      const response = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(
          `${artist} ${title}`
        )}`
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

  return (
    <>
      <div
        className={`w-full flex flex-row h-16 my-2 px-2 items-center ${
          isLoading ? "opacity-60" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!isLoading) {
            play();
          }
        }}
      >
        <div className="h-12 w-12 flex items-center justify-center mr-3">
          <img
            src={imgurl}
            alt={`${title} album cover`}
            className="min-w-full h-full rounded-sm object-cover"
          />
        </div>
        <div className="flex flex-col justify-center h-full truncate">
          <p className="text-md font-title text-[#d8d8d8] truncate">{title}</p>
          <p className="text-xs font-artist text-[#ff4e6b] truncate">
            {artist}
          </p>
        </div>
        {isLoading && (
          <div className="ml-auto mr-2">
            <div className="h-5 w-5 border-2 border-t-transparent border-[#ff4e6b] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="w-[96%] h-[1px] bg-zinc-700 mx-auto"></div>
    </>
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
