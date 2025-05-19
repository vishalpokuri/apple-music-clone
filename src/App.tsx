import { useEffect, useState } from "react";
import "./App.css";

import Canvas from "./components/Canvas.tsx";
import Lyrics from "./components/Lyrics.tsx";
import SongDesc from "./components/SongDesc.tsx";

import SearchBox from "./components/SearchBox.tsx";
import {
  usePopUpSearchBar,
  useSearchResultStore,
  useAccessTokenStore,
  useSongDetailStore,
} from "./utils/store.ts";
import IntroSection from "./components/IntroSection.tsx";
import TitleDesc from "./components/subComponents/TitleDesc.tsx";
import YouTubeAudioPlayerMobile from "./components/YoutubeAudioPlayerMobile.tsx";

function App() {
  const { visible, setVisible } = usePopUpSearchBar();
  const [help, setHelp] = useState(false);
  const imageurl = useSongDetailStore((state) => state.imageUrl);

  const setAccessToken = useAccessTokenStore((state) => state.setAccessToken);

  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );
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
  if (window.innerWidth < 640) {
    return (
      <div className="w-full h-full select-none">
        <Canvas />
        <div className="h-full flex flex-col mx-4 mb-6">
          <div className=" h-[10vh] w-full flex items-center  text-white sm:hidden">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="w-full flex flex-row items-center gap-2 ">
                <img
                  src={imageurl}
                  alt="roomFor2"
                  className="w-[50px] h-[50px]  object-cover rounded-md shadow-2xl"
                />
                <TitleDesc />
              </div>
              <div
                className="bg-black/60 rounded-lg p-3"
                onClick={() => {
                  setVisible();
                  console.log(visible);
                }}
              >
                <SearchIcon />
              </div>
            </div>
          </div>
          <Lyrics />
          <YouTubeAudioPlayerMobile />
          <SearchBox visible={visible} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen select-none">
      <Canvas />
      <div className="w-screen h-screen flex ">
        <SongDesc />
        <Lyrics />
      </div>
      <SearchBox visible={visible} />
      <IntroSection help={help} setHelp={setHelp} />
      <div
        className="bg-white/10 px-3 p-1 rounded-md border border-white/10 hover:bg-white/20 transition-all duration-100 absolute bottom-4 right-4 font-bold text-white/90 cursor-pointer"
        onClick={() => setHelp(!help)}
      >
        ?
      </div>
    </div>
  );
}

export default App;
function SearchIcon() {
  return (
    <svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2Z"
        fill="#fff"
      />
    </svg>
  );
}
