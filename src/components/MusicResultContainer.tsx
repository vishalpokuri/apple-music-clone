interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  duration: number;
}

import { ROOT_URL } from "../utils/imageurls";
import { useSongDetailStore } from "../utils/store";
function MusicResultContainer({
  imgurl,
  title,
  artist,
  downloadUrl,
  duration,
}: MusicResult) {
  const {
    setImageUrl,
    setArtist,
    setDownloadUrl,
    setDuration,
    setTitle,
    setLyrics,
    setYoutubeUrl,
  } = useSongDetailStore();

  const play = async () => {
    //3 calls
    //1. Set all the details of the song

    setImageUrl(imgurl);
    setArtist(artist);
    setTitle(title);
    setDuration(duration);
    setDownloadUrl(downloadUrl);

    //2. backend call to get the youtubeUrl
    const youtubeUrl = await fetch(
      `${ROOT_URL}api/song/convert?spotifyURL=${downloadUrl}`
    );
    const data = await youtubeUrl.json();
    setYoutubeUrl(data.youtubeURL);
    //3. lyrics call to get the lyrics
    const lyrics = await lyricsFetch();
    setLyrics(parseLyrics(lyrics.syncedLyrics));
  };

  const lyricsFetch = async () => {
    const response = await fetch(
      `https://lrclib.net/api/search?q=${artist} ${title}`
    );
    const data = await response.json();
    try {
      const lyrics = filterLyrics(data, duration)[0];
      return lyrics;
    } catch (e) {
      return e;
    }
  };

  return (
    <>
      <div
        className="w-full flex flex-row h-16 my-2 px-2 items-center cursor-pointer"
        onClick={play}
      >
        <div className="h-12 w-12 flex items-center justify-center mr-3">
          <img
            src={imgurl}
            alt={`${title} album cover`}
            className="min-w-full h-full rounded-sm object-cover"
          />
        </div>
        <div className="flex flex-col justify-center truncate">
          <p className="text-md font-lyrics text-[#d8d8d8] truncate">{title}</p>
          <p className="text-sm  font-interface text-[#ff4e6b] truncate">
            {artist}
          </p>
        </div>
      </div>
      <div className="w-[90%] h-[1px] bg-zinc-700 mx-auto"></div>
    </>
  );
}

export default MusicResultContainer;

function filterLyrics(lyricsArray: any, songDuration: number) {
  /*
  //create a function to get filter lyrics based on the parameters 
  1. Duration
  2. Song title + artist name
  3. Synced
  */

  return lyricsArray.filter(
    (item: { duration: number; syncedLyrics: string }) => {
      const matchesDuration = item.duration - songDuration <= 2 ? true : false;
      const syncedavailable = item.syncedLyrics != null ? true : false;
      return matchesDuration && syncedavailable;
    }
  );
}

function parseLyrics(rawLyrics: string) {
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
  return parsed;
}
