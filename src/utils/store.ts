/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PopUpSearchBar = {
  visible: boolean;
  setVisible: () => void;
};

type SearchInput = {
  searchInput: string;
  setSearchInput: (value: string) => void;
};

type SearchResults = {
  searchResult: any[];
  setSearchResult: (value: any[]) => void;
};

type AccessToken = {
  accessToken: string;
  setAccessToken: (value: string) => void;
};

type CurrentTime = {
  currentTime: number;
  setCurrentTime: (value: number) => void;
};

type SongDetails = {
  imageUrl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  youtubeUrl: string;
  duration: number;
  lyrics: any[];
  setImageUrl: (value: string) => void;
  setTitle: (value: string) => void;
  setArtist: (value: string) => void;
  setDownloadUrl: (value: string) => void;
  setYoutubeUrl: (value: string) => void;
  setDuration: (value: number) => void;
  setLyrics: (value: any[]) => void;
  videoId: string;
  setVideoId: (value: string) => void;
};

type IsPlaying = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  toggleIsPlaying: () => void;
};

// 🔍 Search Input
export const useSearchInputStore = create<SearchInput>()(
  devtools(
    (set) => ({
      searchInput: "",
      setSearchInput: (value) => set({ searchInput: value }),
    }),
    { name: "SearchInputStore" }
  )
);

// 🔍 Search Result
export const useSearchResultStore = create<SearchResults>()(
  devtools(
    (set) => ({
      searchResult: [{}],
      setSearchResult: (value) => set({ searchResult: value }),
    }),
    { name: "SearchResultStore" }
  )
);

// 📱 Search Popup
export const usePopUpSearchBar = create<PopUpSearchBar>()(
  devtools(
    (set) => ({
      visible: false,
      setVisible: () => set((state) => ({ visible: !state.visible })),
    }),
    { name: "PopUpSearchBarStore" }
  )
);

// 🔐 Access Token
export const useAccessTokenStore = create<AccessToken>()(
  devtools(
    (set) => ({
      accessToken: "",
      setAccessToken: (value) => set({ accessToken: value }),
    }),
    { name: "AccessTokenStore" }
  )
);

// 🎵 Song Details
export const useSongDetailStore = create<SongDetails>()(
  devtools(
    (set) => ({
      imageUrl: "/assets/placeholderImage.jpg",
      setImageUrl: (value) => set({ imageUrl: value }),
      title: "Song Title",
      setTitle: (value) => set({ title: value }),
      artist: "Artist Name",
      setArtist: (value) => set({ artist: value }),
      downloadUrl: "",
      setDownloadUrl: (value) => set({ downloadUrl: value }),
      youtubeUrl: "",
      setYoutubeUrl: (value) => set({ youtubeUrl: value }),
      duration: 0,
      setDuration: (value) => set({ duration: value }),
      lyrics: [],
      setLyrics: (value) => set({ lyrics: value }),
      videoId: "",
      setVideoId: (value) => set({ videoId: value }),
    }),
    { name: "SongDetailStore" }
  )
);

// ▶️ Is Playing
export const useIsPlayingStore = create<IsPlaying>()(
  devtools(
    (set) => ({
      isPlaying: false,
      setIsPlaying: (value) => set({ isPlaying: value }),
      toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    }),
    { name: "IsPlayingStore" }
  )
);

// ⏱️ Current Time
export const useCurrentTimeStore = create<CurrentTime>()(
  //Im using ms not seconds
  devtools(
    (set) => ({
      currentTime: 0,
      setCurrentTime: (value) => set({ currentTime: value }),
    }),
    { name: "CurrentTimeStore" }
  )
);
