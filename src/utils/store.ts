/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

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

type SongDetails = {
  imageUrl: string;
  title: string;
  artist: string;
  downloadUrl: string;
  duration: number;

  setImageUrl: (value: string) => void;
  setTitle: (value: string) => void;
  setArtist: (value: string) => void;
  setDownloadUrl: (value: string) => void;
  setDuration: (value: number) => void;
};
export const useSearchInputStore = create<SearchInput>((set) => ({
  searchInput: "",
  setSearchInput: (value) => set({ searchInput: value }),
}));

export const useSearchResultStore = create<SearchResults>((set) => ({
  searchResult: [{}],
  setSearchResult: (value) => set({ searchResult: value }),
}));

export const usePopUpSearchBar = create<PopUpSearchBar>((set) => ({
  visible: false,
  setVisible: () => set((state) => ({ visible: !state.visible })),
}));
export const useAccessTokenStore = create<AccessToken>((set) => ({
  accessToken: "",
  setAccessToken: (value) => set({ accessToken: value }),
}));
export const useSongDetailStore = create<SongDetails>((set) => ({
  imageUrl: "",
  setImageUrl: (value) => set({ imageUrl: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  artist: "",
  setArtist: (value) => set({ artist: value }),
  downloadUrl: "",
  setDownloadUrl: (value) => set({ downloadUrl: value }),
  duration: 0,
  setDuration: (value) => set({ duration: value }),
}));
