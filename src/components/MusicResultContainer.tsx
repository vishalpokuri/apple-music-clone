interface MusicResult {
  imgurl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  duration: number;
}
import { useSongDetailStore } from "../utils/store";
function MusicResultContainer({
  imgurl,
  title,
  artist,
  downloadUrl,
  duration,
}: MusicResult) {
  const { setImageUrl, setArtist, setDownloadUrl, setDuration, setTitle } =
    useSongDetailStore();

  const play = () => {
    //3 calls
    //1. Set all the details of the song
    setImageUrl(imgurl);
    setArtist(artist);
    setTitle(title);
    setDownloadUrl(downloadUrl);
    setDuration(duration);
    //2. backend call to get the song

    //3. lyrics call to get the lyrics
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
