import {
  useAccessTokenStore,
  useSearchInputStore,
  useSearchResultStore,
} from "../utils/store";

import MusicResultContainer from "./MusicResultContainer";

interface SearchBoxProps {
  visible: boolean;
}

function SearchBox({ visible }: SearchBoxProps) {
  const { searchInput, setSearchInput } = useSearchInputStore();
  const { accessToken } = useAccessTokenStore();
  const { searchResult, setSearchResult } = useSearchResultStore();

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
        "&type=track&limit=5",
      artistParameters
    );
    const data = await response.json();
    const metadata = data.tracks.items;

    setSearchResult(metadata);
  }

  return (
    <div
      className={`fixed top-[30vh] left-1/2 transform -translate-x-1/2 w-[30vw] z-50 bg-zinc-900 rounded-t-2xl rounded-b-xl p-2 ${
        visible ? "block" : "hidden"
      }`}
    >
      <input
        type="text"
        className="outline-none w-full h-12 p-4 bg-[#27272a] rounded-xl text-white mb-2"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            search();
          }
        }}
        placeholder="Search "
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {searchResult.length > 1 && (
        <div className="max-h-64 overflow-y-auto">
          {searchResult.map((item, index) => (
            <MusicResultContainer
              key={index}
              title={item.album.name}
              imgurl={item.album.images[0].url}
              artist={item.artists[0]?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
