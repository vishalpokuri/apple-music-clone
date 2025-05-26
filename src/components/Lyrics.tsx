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

  const mobile = window.innerWidth < 640 ? "center" : "center";

  useEffect(() => {
    if (currentIndex !== -1 && lineRefs.current[currentIndex]) {
      lineRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: mobile,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="w-[90vw] sm:w-[55vw] h-[68vh] sm:h-[80vh] sm:my-auto overflow-y-scroll relative font-lyrics text-white sm:text-4xl opacity-80 scrollbar-hidden sm:pr-12">
      <div className="sm:pb-56 relative">
        {lyrics.length > 0 ? (
          lyrics.map((line: LyricLine, index: number) => (
            <div
              key={index}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className={`mb-3 sm:mb-7 transition-all duration-350 ease-in-out ${
                index === currentIndex
                  ? "text-white sm:text-4xl text-3xl relative"
                  : "text-2xl sm:text-3xl opacity-30"
              }`}
              style={{ whiteSpace: "pre-line" }}
            >
              {window.innerWidth < 1024
                ? window.innerWidth < 640
                  ? wrapText(line.text, 22)
                  : line.text
                : wrapText(line.text, 45)}
            </div>
          ))
        ) : (
          <>
            <div className="sm:text-3xl text-3xl opacity-40 mb-2">
              Choose a song with the search bar
            </div>
            <div className="hidden lg:text-3xl lg:block text-3xl opacity-40 ">
              Ctrl + K
            </div>
            {/*             
            <div>
              <div className="sm:text-3xl text-3xl opacity-40 mb-2">
                Maintenance till May27th 2.00am IST: Your favourite player will
                be back shortly
              </div>
              <div className="hidden lg:text-3xl lg:block text-3xl opacity-40 ">
                Ctrl + K
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

export default Lyrics;

function wrapText(text: string, limit: number): string {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= limit) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join("\n");
}
