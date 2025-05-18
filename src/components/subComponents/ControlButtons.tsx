import { useIsPlayingStore } from "../../utils/store";

function ControlButtons({
  handlePlayPause,
  isLoading,
}: {
  handlePlayPause: () => void;
  isLoading: boolean;
}) {
  const isPlaying = useIsPlayingStore((state) => state.isPlaying);
  return (
    <div className="flex w-3/5 mx-auto justify-around">
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
  );
}

export default ControlButtons;
