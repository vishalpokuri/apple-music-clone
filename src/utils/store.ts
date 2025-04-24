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

type AccessToken = {
  accessToken: string;
  setAccessToken: (value: string) => void;
};

type SearchResults = {
  searchResult: any[];
  setSearchResult: (value: any[]) => void;
};

export const useSearchInputStore = create<SearchInput>((set) => ({
  searchInput: "",
  setSearchInput: (value) => set({ searchInput: value }),
}));

export const useAccessTokenStore = create<AccessToken>((set) => ({
  accessToken: "",
  setAccessToken: (value) => set({ accessToken: value }),
}));

export const useSearchResultStore = create<SearchResults>((set) => ({
  searchResult: [{}],
  setSearchResult: (value) => set({ searchResult: value }),
}));

export const usePopUpSearchBar = create<PopUpSearchBar>((set) => ({
  visible: false,
  setVisible: () => set((state) => ({ visible: !state.visible })),
}));
