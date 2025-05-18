import { useSongDetailStore } from "../utils/store";
import TitleDesc from "./subComponents/TitleDesc";
import YouTubeAudioPlayer from "./YoutubeAudioPlayer";

function SongDesc() {
  const imageurl = useSongDetailStore((state) => state.imageUrl);
  return (
    <div className="sm:w-[45vw] sm:h-full sm:flex sm:items-center sm:justify-center sm:text-white hidden">
      <div className="w-[50%] aspect-square">
        <img
          src={imageurl}
          alt="roomFor2"
          className="w-full h-full object-cover rounded-md shadow-2xl mb-3"
        />
        <TitleDesc />
        <YouTubeAudioPlayer />
      </div>
    </div>
  );
}

export default SongDesc;
