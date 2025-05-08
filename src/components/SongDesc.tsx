import MusicPlayer from "./MusicPlayer";
import { useSongDetailStore } from "../utils/store";

function SongDesc() {
  const imageurl = useSongDetailStore((state) => state.imageUrl);
  return (
    <div className="w-[45vw] h-full flex items-center justify-center">
      <div className="w-[50%] aspect-square">
        <img
          src={imageurl}
          alt="roomFor2"
          className="w-full h-full object-cover rounded-md shadow-2xl"
        />
        <MusicPlayer />
      </div>
    </div>
  );
}

export default SongDesc;
