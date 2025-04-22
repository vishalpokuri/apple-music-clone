import "./App.css";

import Canvas from "./components/Canvas.tsx";
import Lyrics from "./components/Lyrics.tsx";
import SongDesc from "./components/SongDesc.tsx";

function App() {
  return (
    <div className="w-screen h-screen">
      <Canvas />
      <div className="w-screen h-screen flex">
        <SongDesc />
        <Lyrics />
      </div>
    </div>
  );
}

export default App;
