import {
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

  const { searchResult, setSearchResult } = useSearchResultStore();
  const setVisible = usePopUpSearchBar((state) => state.setVisible);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchRef = useRef(null) as any;

  async function search() {
    const artistParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    };

    const response = await fetch(
      "https://saavn.dev/api/search/songs?query=" + searchInput + "&limit=6",
      artistParameters
    );
    const data = await response.json();
    const metadata = data.data.results;
    console.log(metadata);

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
            className="fixed top-[30vh] left-1/2 transform -translate-x-1/2 w-[30vw] z-50 bg-zinc-900 rounded-t-2xl rounded-b-xl p-2"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <input
              ref={searchRef}
              type="text"
              className="outline-none w-full h-12 p-4 bg-[#27272a] rounded-xl text-white mb-2"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  search();
                }
              }}
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            {searchResult.length > 1 && (
              <div className="max-h-64 overflow-y-auto">
                {searchResult.map((item, index) => (
                  <MusicResultContainer
                    key={index}
                    title={item.name}
                    imgurl={item.image[item.image.length - 1].url}
                    artist={item.artists.primary[0].name}
                    downloadUrl={
                      item.downloadUrl[item.downloadUrl.length - 1].url
                    }
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
