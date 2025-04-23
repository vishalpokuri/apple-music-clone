const lyrics = [
  "I'm a place to call your own",
  "You can stay forever through",
  "When you're barely holding on",
  "I'll be anything you want",
  "Open up my heart for you",
  "Baby, I got room for two",
];

function Lyrics() {
  return (
    <div className="w-[55vw] h-[100%] font-lyrics text-white text-4xl opacity-80">
      <LyricsComponent
        line={"When the world don't feel like home"}
        styles="mt-56"
      />
      {lyrics.map((l, index) => (
        <LyricsComponent key={index} line={l} styles={"opacity-50 text-3xl"} />
      ))}
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
