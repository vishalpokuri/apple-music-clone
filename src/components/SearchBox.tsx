import {
  useAccessTokenStore,
  usePopUpSearchBar,
  useSearchInputStore,
  useSearchResultStore,
} from "../utils/store";
import { AnimatePresence, motion } from "motion/react";
import MusicResultContainer from "./MusicResultContainer";
import { useEffect, useRef, useState } from "react";

interface SearchBoxProps {
  visible: boolean;
}

function SearchBox({ visible }: SearchBoxProps) {
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { accessToken } = useAccessTokenStore();

  const { searchResult, setSearchResult } = useSearchResultStore();
  const setVisible = usePopUpSearchBar((state) => state.setVisible);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchRef = useRef(null) as any;

  async function search() {
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
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
      const metadata = data.tracks.items || [];

      setSearchResult(metadata);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResult([]);
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    searchRef.current?.focus();
    if (visible) {
      setHasSearched(false);
      setIsSearching(false);
    }
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
            className="fixed top-[8vh] sm:top-[25vh] left-1/2 transform -translate-x-1/2 
             sm:w-[35vw] w-[95vw] max-w-2xl
             z-50 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-xl 
             border border-zinc-700/50 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 p-6 border-b border-zinc-600/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-tr from-zinc-800/70 to-zinc-700/80 rounded-xl">
                  <img
                    src="/assets/headphoneIcon.png"
                    alt=""
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-title">
                    Search Music
                  </h2>
                  {/* <p className="text-sm text-zinc-400">
                    Find your favorite songs and artists
                  </p> */}
                </div>
              </div>

              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  className="w-full h-12 px-4 pr-12 bg-zinc-800/70 border border-zinc-600/50 
                           rounded-2xl text-white placeholder-zinc-400 font-title text-base
                           focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 
                           focus:outline-none transition-all duration-200
                           backdrop-blur-sm"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      search();
                    }
                  }}
                  placeholder="Search for songs, artists, or albums..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 
                           bg-gradient-to-r from-pink-500 to-red-500 
                           hover:from-pink-600 hover:to-red-600
                           p-2.5 rounded-xl transition-all duration-200 
                           hover:scale-105 active:scale-95 cursor-pointer
                           shadow-lg hover:shadow-pink-500/25"
                  onClick={search}
                >
                  <SearchIcon />
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="px-6 pb-6">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-zinc-700 border-t-pink-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-zinc-400 font-title mb-2">Searching...</p>
                  <p className="text-sm text-zinc-500">
                    Finding the perfect tracks for you
                  </p>
                </div>
              ) : searchResult.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-4 mt-4">
                    <h3 className="text-base font-semibold text-white font-title">
                      Search Results
                    </h3>
                    <span className="text-sm text-zinc-400">
                      {searchResult.length}{" "}
                      {searchResult.length === 1 ? "song" : "songs"}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-1">
                    {searchResult.map((item, index) => (
                      <MusicResultContainer
                        key={`${item.id || index}-${index}`}
                        title={item.name || "Unknown Title"}
                        imgurl={
                          item.album?.images?.[0]?.url ||
                          "/placeholder-album.jpg"
                        }
                        artist={item.artists?.[0]?.name || "Unknown Artist"}
                        downloadUrl={item.external_urls?.spotify || ""}
                        duration={Math.floor((item.duration_ms || 0) / 1000)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ) : hasSearched ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                        fill="#71717a"
                      />
                    </svg>
                  </div>
                  <p className="text-zinc-400 font-title mb-2">
                    No results found
                  </p>
                  <p className="text-sm text-zinc-500">
                    Try searching for something else
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon />
                  </div>
                  <p className="text-zinc-400 font-title mb-2">
                    Start typing to search
                  </p>
                  <p className="text-sm text-zinc-500">
                    Discover millions of songs
                  </p>
                </div>
              )}
            </div>
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
