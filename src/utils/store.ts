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

type ImageUrl = {
  imageUrl: string;
  setImageUrl: (value: string) => void;
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
export const useImageUrlStore = create<ImageUrl>((set) => ({
  imageUrl: "https://i.scdn.co/image/ab67616d00001e02b22e21de789378f223e1795f",
  setImageUrl: (value) => set({ imageUrl: value }),
}));
