import { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";
import { roomFor2 } from "../utils/imageurls";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Gradient } from "../utils/gradient.js";
interface Palette {
  DarkVibrant: string | null;
  Muted: string | null;
  DarkMuted: string | null;
  Vibrant: string | null;
}
function Canvas() {
  const [, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    const imgUrl = roomFor2;

    // Step 1: Extract palette from image
    Vibrant.from(imgUrl)
      .getPalette()
      .then((palette) => {
        const newPalette = {
          Muted: palette.Muted?.hex ?? "#000000",
          DarkMuted: palette.DarkMuted?.hex ?? "#111111",
          DarkVibrant: palette.DarkVibrant?.hex ?? "#ffffff",
          Vibrant: palette.Vibrant?.hex ?? "#aaaaaa",
        };

        // Step 2: Set it to state
        setPalette(newPalette);

        // Step 3: Set CSS Variables dynamically
        const canvas = document.getElementById("gradient-canvas");
        if (canvas) {
          canvas.style.setProperty(
            "--gradient-color-1",
            newPalette.DarkVibrant!
          );
          canvas.style.setProperty("--gradient-color-2", newPalette.Muted!);
          canvas.style.setProperty("--gradient-color-3", newPalette.DarkMuted!);
          canvas.style.setProperty("--gradient-color-4", newPalette.Vibrant!);
        }

        // Step 4: Initialize gradient AFTER setting colors
        const gradient = new Gradient();
        gradient.initGradient("#gradient-canvas");
      });
  }, []);
  return (
    <canvas
      id="gradient-canvas"
      data-transition-in
      className="w-screen h-screen fixed -z-10 top-0 left-0 pointer-events-none"
    />
  );
}

export default Canvas;
