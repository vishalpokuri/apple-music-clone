import { useEffect } from "react";
import "./App.css";

import Canvas from "./components/Canvas.tsx";
import Lyrics from "./components/Lyrics.tsx";
import SongDesc from "./components/SongDesc.tsx";

import SearchBox from "./components/SearchBox.tsx";
import {
  useAccessTokenStore,
  usePopUpSearchBar,
  useSearchResultStore,
} from "./utils/store.ts";

function App() {
  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);
  const { visible, setVisible } = usePopUpSearchBar();
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        //set the search results to null if already opened
        if (visible) {
          setSearchResult([{}]);
        }
        setVisible();
      }
      if (visible && e.key == "Escape") {
        setVisible();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen select-none">
      <Canvas />
      <div className="w-screen h-screen flex">
        <SongDesc />
        <Lyrics />
      </div>
      <SearchBox visible={visible} />
    </div>
  );
}

export default App;
