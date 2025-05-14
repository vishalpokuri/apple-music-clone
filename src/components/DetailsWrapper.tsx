import React from "react";
import { useIsPlayingStore, useSongDetailStore } from "../utils/store";

function DetailsWrapper({
  children,
  handlePlayPause,
}: {
  children: React.ReactNode;
  handlePlayPause: () => void;
}) {
  const { artist, title } = useSongDetailStore();
  const isPlaying = useIsPlayingStore((state) => state.isPlaying);
  return (
    <>
      {/* Song details */}
      <div className="font-title opacity-90 text-sm/4">{title}</div>
      <div className="font-artist opacity-75 mb-2 text-sm/5">{artist}</div>
      {children}

      {/* Control buttons */}
      <div className="flex w-3/5 mx-auto justify-around">
        <img
          src="/assets/backwardf.png"
          className="w-7 opacity-60"
          alt="Previous"
        />
        <div className="cursor-pointer" onClick={handlePlayPause}>
          {isPlaying ? (
            <img src="/assets/pausef.png" className="w-7" alt="Pause" />
          ) : (
            <img src="/assets/playf.png" className="w-7" alt="Play" />
          )}
        </div>
        <img src="/assets/forwardf.png" className="w-7 opacity-60" alt="Next" />
      </div>
    </>
  );
}

export default DetailsWrapper;
