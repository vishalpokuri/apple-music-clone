import {
  useAccessTokenStore,
  usePopUpSearchBar,
  useSearchInputStore,
  useSearchResultStore,
} from "../utils/store";
import { AnimatePresence, motion } from "motion/react";
import MusicResultContainer from "./MusicResultContainer";
import { useEffect, useRef } from "react";

interface SearchBoxProps {
  visible: boolean;
}

function SearchBox({ visible }: SearchBoxProps) {
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { accessToken } = useAccessTokenStore();

  const { searchResult, setSearchResult } = useSearchResultStore();
  const setVisible = usePopUpSearchBar((state) => state.setVisible);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchRef = useRef(null) as any;

  async function search() {
    const artistParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const response = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        searchInput +
        "&type=track&limit=7",
      artistParameters
    );
    const data = await response.json();
    const metadata = data.tracks.items;

    setSearchResult(metadata);
  }

  useEffect(() => {
    searchRef.current?.focus();
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay Blur Background */}
          <motion.div
            className="fixed top-0 left-0 z-30 w-full h-full backdrop-blur-sm bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={setVisible}
          />

          {/* Search Modal Box */}
          <motion.div
            className="fixed top-[30vh] left-1/2 transform -translate-x-1/2 
             sm:w-[30vw] w-[90vw] 
             z-50 bg-zinc-900 rounded-t-2xl rounded-b-xl p-2"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-row items-center justify-between gap-1">
              <input
                ref={searchRef}
                type="text"
                className="outline-none w-full h-10 text-sm p-4 bg-[#27272a] rounded-xl text-white font-title"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    search();
                  }
                }}
                placeholder="What do you want to listen to?"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="bg-[#ff4e6b] px-3 p-1 cursor-pointer h-10 rounded-xl text-white text-sm"
                onClick={search}
              >
                <SearchIcon />
              </button>
            </div>

            {searchResult.length > 1 && (
              <div className="max-h-64 overflow-y-auto">
                {searchResult.map((item, index) => (
                  <MusicResultContainer
                    key={index}
                    title={item.name}
                    imgurl={item.album.images[0].url}
                    artist={item.artists[0]?.name}
                    downloadUrl={item.external_urls.spotify}
                    duration={Math.floor(item.duration_ms / 1000)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchBox;

function SearchIcon() {
  return (
    <svg
      width="20px"
      height="20px"
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
