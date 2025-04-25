import { useState } from "react";
function MusicPlayer() {
  const [play, setPlay] = useState(true);
  return (
    <div className="text-white w-[100%] flex flex-col  mt-3">
      <div className="font-title opacity-90 text-sm/4">Room for 2</div>
      <div className="font-artist opacity-75 mb-2 text-sm/5">Benson Boone</div>

      {/* playbar */}
      <div className="w-[100%] h-[4px] bg-white rounded-full mb-1"></div>
      <div className="w-[100%] flex flex-row justify-between font-interface opacity-75 text-[12px] mb-1">
        <div>0:59</div>
        <div>-3:28</div>
      </div>

      {/* Animation of play button remaining */}
      <div className="flex w-[60%] mx-auto justify-around">
        <img src="/assets/backwardf.png" className="w-7 opacity-60" alt="" />
        <div onClick={() => setPlay((prev) => !prev)}>
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
