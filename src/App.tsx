import { useEffect } from "react";
import "./App.css";

import Canvas from "./components/Canvas.tsx";
import Lyrics from "./components/Lyrics.tsx";
import SongDesc from "./components/SongDesc.tsx";

import SearchBox from "./components/SearchBox.tsx";
import { useAccessTokenStore, usePopUpSearchBar } from "./utils/store.ts";

function App() {
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const { visible, setVisible } = usePopUpSearchBar();
  //TODO: listen to ctrl+K for search bar popup
  // useEffect;

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${
        import.meta.env.VITE_CLIENT_ID
      }&client_secret=${import.meta.env.VITE_CLIENT_SECRET}`,
    };
    async function datacall() {
      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        authParameters
      );
      const data = await response.json();
      if (data) {
        setAccessToken(data.access_token);
      }
    }

    datacall();
  }, []);

  return (
    <div className="w-screen h-screen select-none">
      <Canvas />
      <div className="w-screen h-screen flex">
        <SongDesc />
        <Lyrics />
      </div>
      <SearchBox visible={false} />
    </div>
  );
}

export default App;
