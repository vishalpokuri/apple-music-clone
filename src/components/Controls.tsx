import { useEffect } from "react";
import { useIsPlayingStore } from "../utils/store";
function Controls({
  handlePlayPause,
  isLoading,
}: {
  handlePlayPause: () => void;
  isLoading: boolean;
}) {
  const isPlaying = useIsPlayingStore((state) => state.isPlaying);
  useEffect(() => {
    console.log("isPlaying", isPlaying);
    console.log("isLoading", isLoading);
  }, [isPlaying, isLoading]);
  return (
    <div>
      {/* Control buttons */}
      <div className="flex flex-wrap w-full sm:w-4/5 md:w-3/5 mx-auto justify-center gap-4">
        <img
          src="/assets/backwardf.png"
          className="w-7 opacity-60"
          alt="Previous"
        />
        <div className="cursor-pointer" onClick={handlePlayPause}>
          {isLoading ? (
            <div className="w-7 h-7 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <>
              {isPlaying ? (
                <img src="/assets/pausef.png" className="w-7" alt="Pause" />
              ) : (
                <img src="/assets/playf.png" className="w-7" alt="Play" />
              )}
            </>
          )}
        </div>
        <img src="/assets/forwardf.png" className="w-7 opacity-60" alt="Next" />
      </div>
    </div>
  );
}

export default Controls;
