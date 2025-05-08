import { useSongDetailStore } from "../utils/store";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
function MusicPlayer() {
  const [play, setPlay] = useState(true);
  const { title, artist } = useSongDetailStore();
  return (
    <div className="text-white w-[100%] flex flex-col  mt-3">
      <div className="font-title opacity-90 text-sm/4">{title}</div>
      <div className="font-artist opacity-75 mb-2 text-sm/5">{artist}</div>

      {/* playbar */}
      <div className="w-[100%] h-[4px] bg-white rounded-full mb-1"></div>
      <ProgressBar />
      {/* Animation of play button remaining */}
      <div className="flex w-[60%] mx-auto justify-around">
        <img src="/assets/backwardf.png" className="w-7 opacity-60" alt="" />
        <div
          className="cursor-pointer"
          onClick={() => setPlay((prev) => !prev)}
        >
          {play == true ? (
            <img
              src="/assets/playf.png"
              className="w-7"
              alt="Icon not present"
            />
          ) : (
            <img src="/assets/pausef.png" className="w-7" alt="" />
          )}
        </div>
        <img src="/assets/forwardf.png" className="w-7 opacity-60" alt="" />
      </div>
    </div>
  );
}

export default MusicPlayer;
