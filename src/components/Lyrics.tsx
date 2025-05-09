import { useEffect, useRef } from "react";
import {
  useCurrentTimeStore,
  useIsPlayingStore,
  useSongDetailStore,
} from "../utils/store";

interface LyricLine {
  time: number; // in seconds
  text: string;
}

function Lyrics() {
  const { isPlaying, setIsPlaying } = useIsPlayingStore();
  const { currentTime, startInterval, resetInterval, pauseInterval } =
    useCurrentTimeStore();
  const { lyrics, duration } = useSongDetailStore();
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = lyrics.findIndex(
    (line: LyricLine, index: number) =>
      currentTime / 1000 >= line.time &&
      (index === lyrics.length - 1 ||
        currentTime / 1000 < lyrics[index + 1].time)
  );
  useEffect(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startInterval();
    } else {
      pauseInterval();
    }

    if (currentTime / 1000 > duration) {
      console.log("Song ended");
      console.log(currentTime, duration);
      pauseInterval();
    }
  }, [isPlaying]);

  useEffect(() => {
    // console.log("Song lyrics changed");
    resetInterval(); // reset timer for new song
    if (lyrics.length > 2) {
      // console.log("Set playing to true (start)");
      setIsPlaying(true);
    }
  }, [lyrics]);

  const getDuration = (index: number): number => {
    if (index === lyrics.length - 1) return 2;
    return Math.max(lyrics[index + 1].time - lyrics[index].time, 1);
  };

  useEffect(() => {
    if (currentIndex !== -1 && lineRefs.current[currentIndex]) {
      lineRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-[55vw] h-[80vh] my-auto overflow-y-scroll relative font-lyrics text-white text-4xl opacity-80 scrollbar-hidden pr-12">
      <div className="pb-56 relative">
        {lyrics.length > 0 ? (
          lyrics.map((line: LyricLine, index: number) => (
            <div
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className={`mb-7 transition-all duration-350 ease-in-out ${
                index === currentIndex
                  ? "text-white text-4xl relative animate-gradient-flow"
                  : "text-3xl opacity-30"
              }`}
              style={
                index === currentIndex
                  ? {
                      animationDuration: `${getDuration(index)}s`,
                      animationPlayState: isPlaying ? "running" : "paused",
                    }
                  : {}
              }
            >
              {line.text}
            </div>
          ))
        ) : (
          <div className="text-3xl opacity-40">
            Your lyrics will appear here
          </div>
        )}
      </div>
    </div>
  );
}

export default Lyrics;
