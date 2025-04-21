import "./App.css";
// @ts-ignore
import { Gradient } from "../src/utils/gradient.js";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

interface Palette {
  DarkVibrant: string | null;
  Muted: string | null;
  DarkMuted: string | null;
  Vibrant: string | null;
}

function App() {
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    const imgUrl =
      "data:image/jpeg;base64,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";

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
    <div className="w-screen h-screen">
      <canvas
        id="gradient-canvas"
        data-transition-in
        className="w-screen h-screen"
      />
    </div>
  );
}

export default App;
