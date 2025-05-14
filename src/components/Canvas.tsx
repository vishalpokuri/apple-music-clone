import { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Gradient } from "../utils/gradient.js";
import { useSongDetailStore } from "../utils/store.js";

interface Palette {
  DarkVibrant: string | null;
  Muted: string | null;
  DarkMuted: string | null;
  Vibrant: string | null;
}

function Canvas() {
  const [palette, setPalette] = useState<Palette>({
    DarkMuted: "#6c5a3b",
    DarkVibrant: "#84641c",
    Muted: "#b18b4c",
    Vibrant: "#bc8c44",
  });
  const imageUrl = useSongDetailStore((state) => state.imageUrl);
  const [key, setKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setIsTransitioning(true);
      Vibrant.from(imageUrl)
        .getPalette()
        .then((newPalette) => {
          setPalette({
            Muted: newPalette.Muted?.hex ?? "#111111",
            DarkMuted: newPalette.DarkMuted?.hex ?? "#222222",
            DarkVibrant: newPalette.DarkVibrant?.hex ?? "#000000",
            Vibrant: newPalette.Vibrant?.hex ?? "#333333",
          });

          setKey((prev) => prev + 1);

          setTimeout(() => setIsTransitioning(false), 100);
        })
        .catch((error) => {
          console.error("Error extracting palette:", error);
          setIsTransitioning(false);
        });
    }
  }, [imageUrl]);

  useEffect(() => {
    const canvas = document.getElementById("gradient-canvas");
    if (canvas) {
      // Set CSS variables
      canvas.style.setProperty(
        "--gradient-color-1",
        palette.DarkVibrant || "#000000"
      );
      canvas.style.setProperty(
        "--gradient-color-2",
        palette.Muted || "#111111"
      );

      canvas.style.setProperty(
        "--gradient-color-3",
        palette.DarkMuted || "#222222"
      );
      canvas.style.setProperty(
        "--gradient-color-4",
        palette.Vibrant || "#333333"
      );

      const gradient = new Gradient();
      gradient.initGradient("#gradient-canvas");

      return () => {
        canvas.remove();
      };
    }
  }, [key, palette]);

  return (
    <div
      className="fixed inset-0 -z-10 transition-opacity duration-300"
      style={{
        opacity: isTransitioning ? 0 : 1,
        background: `linear-gradient(45deg, 
          ${palette.DarkVibrant || "#000000"}, 
          ${palette.Muted || "#111111"}, 
          ${palette.DarkMuted || "#222222"}, 
          ${palette.Vibrant || "#333333"})`,
      }}
    >
      <canvas
        key={key}
        id="gradient-canvas"
        data-transition-in
        className="w-screen h-screen pointer-events-none"
      />
    </div>
  );
}

export default Canvas;
