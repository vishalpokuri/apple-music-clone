import { roomFor2 } from "../utils/imageurls";
import MusicPlayer from "./MusicPlayer";

function SongDesc() {
  return (
    <div className="w-[45vw] h-full flex items-center justify-center">
      <div className="w-[50%] aspect-square">
        <img
          src={roomFor2}
          alt="roomFor2"
          className="w-full h-full object-cover rounded-md shadow-2xl"
        />
        <MusicPlayer />
      </div>
    </div>
  );
}

export default SongDesc;
