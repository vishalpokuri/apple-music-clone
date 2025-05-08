import React, { useEffect, useRef, useState } from "react";
import { useSongDetailStore } from "../utils/store";

interface LyricLine {
  time: number; // in seconds
  text: string;
}

function Lyrics({ isPlaying }: { isPlaying: boolean }) {
  const [currentTime, setCurrentTime] = useState(0);
  const { lyrics } = useSongDetailStore();
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIndex = lyrics.findIndex(
    (line: LyricLine, index: number) =>
      currentTime >= line.time &&
      (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
  );

  useEffect(() => {
    setInterval(() => {
      setCurrentTime((prev) => prev + 1);
    }, 1000);
  }, []);

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
    <div className="w-[55vw] h-[80vh] my-auto overflow-y-scroll relative font-lyrics text-white text-4xl opacity-80 scrollbar-hide pr-12">
      <div className="pb-56 relative">
        {lyrics.length > 0 ? (
          lyrics.map((line: LyricLine, index: number) => (
            <div
              key={index}
              ref={(el) => (lineRefs.current[index] = el)}
              className={`mb-7 transition-all duration-300 ${
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

      {/* Top and bottom fade overlays */}
      {/* <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent pointer-events-none" /> */}
    </div>
  );
}

export default Lyrics;

interface LyricLine {
  styles: string;
  line: string;
}

function LyricsComponent({ line, styles }: LyricLine) {
  return <div className={`mb-7 ${styles} `}>{line}</div>;
}
