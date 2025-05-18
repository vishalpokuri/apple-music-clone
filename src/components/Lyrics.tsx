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
  const setIsPlaying = useIsPlayingStore((state) => state.setIsPlaying);
  const { currentTime } = useCurrentTimeStore();
  const { lyrics } = useSongDetailStore();

  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentIndex = lyrics.findIndex(
    (line: LyricLine, index: number) =>
      currentTime / 1000 >= line.time &&
      (index === lyrics.length - 1 ||
        currentTime / 1000 < lyrics[index + 1].time)
  );

  useEffect(() => {
    setIsPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentIndex !== -1 && lineRefs.current[currentIndex]) {
      lineRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-[90vw] sm:w-[55vw] h-[70vh] sm:h-[80vh] sm:my-auto overflow-y-scroll relative font-lyrics text-white sm:text-4xl opacity-80 scrollbar-hidden sm:pr-12">
      <div className="sm:pb-56 relative">
        {lyrics.length > 0 ? (
          lyrics.map((line: LyricLine, index: number) => (
            <div
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className={`mb-7 transition-all duration-350 ease-in-out ${
                index === currentIndex
                  ? "text-white sm:text-4xl text-2xl relative"
                  : "text-xl sm:text-3xl opacity-30"
              }`}
            >
              {line.text}
            </div>
          ))
        ) : (
          <div className="sm:text-3xl text-2xl opacity-40">
            Choose a song with the search bar
          </div>
        )}
      </div>
    </div>
  );
}

export default Lyrics;
