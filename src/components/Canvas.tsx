import { useState, useEffect, useRef } from "react";
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
  const [, setPalette] = useState<Palette | null>({
    DarkMuted: "#6c5a3b",
    DarkVibrant: "#84641c",
    Muted: "#b18b4c",
    Vibrant: "#bc8c44",
  });
  const imageUrl = useSongDetailStore((state) => state.imageUrl);
  const gradientRef = useRef(null);

  useEffect(() => {
    // Initialize the gradient only once when component mounts
    if (!gradientRef.current) {
      gradientRef.current = new Gradient();
      // Don't call initGradient yet - wait for colors to be set
    }

    // Extract palette from image
    if (imageUrl) {
      Vibrant.from(imageUrl)
        .getPalette()
        .then((palette) => {
          const newPalette = {
            Muted: palette.Muted?.hex ?? "#000000",
            DarkMuted: palette.DarkMuted?.hex ?? "#111111",
            DarkVibrant: palette.DarkVibrant?.hex ?? "#ffffff",
            Vibrant: palette.Vibrant?.hex ?? "#aaaaaa",
          };

          // Set palette to state
          setPalette(newPalette);
          console.log(newPalette);

          // Set CSS Variables dynamically
          const canvas = document.getElementById("gradient-canvas");
          if (canvas) {
            canvas.style.setProperty(
              "--gradient-color-1",
              newPalette.DarkVibrant!
            );
            canvas.style.setProperty("--gradient-color-2", newPalette.Muted!);
            canvas.style.setProperty(
              "--gradient-color-3",
              newPalette.DarkMuted!
            );
            canvas.style.setProperty("--gradient-color-4", newPalette.Vibrant!);
          }

          // For the first time, initialize the gradient
          // For subsequent times, reinitialize the gradient colors
          if (gradientRef.current) {
            if (gradientRef.current.initialized) {
              // If the gradient is already initialized, just reinitialize the colors
              gradientRef.current.initGradientColors();
              console.log("If ran");
            } else {
              // First time initialization
              gradientRef.current.initGradient("#gradient-canvas");
              gradientRef.current.initialized = true;
              console.log("Else ran");
            }
          }
        })
        .catch((error) => {
          console.error("Error extracting palette:", error);
        });
    }

    // Cleanup function
    return () => {
      // No need for specific cleanup as we're reusing the same gradient instance
    };
  }, [imageUrl]);

  return (
    <canvas
      id="gradient-canvas"
      data-transition-in
      className="w-screen h-screen fixed -z-10 top-0 left-0 pointer-events-none"
    />
  );
}

export default Canvas;
