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
type CurrentTime = {
  currentTime: number;
  setCurrentTime: (value: number) => void;
  incrementTime: () => void;
  intervalId: NodeJS.Timeout | null | undefined;
  setIntervalId: (id: NodeJS.Timeout | null) => void;
  startInterval: () => void;
  resetInterval: () => void;
  pauseInterval: () => void;
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
};
type IsPlaying = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  toggleIsPlaying: () => void;
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
  imageUrl:
    "https://i.pinimg.com/736x/2d/95/84/2d9584336457c8744065598310a4a0a8.jpg",
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
}));
export const useIsPlayingStore = create<IsPlaying>((set) => ({
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),
  toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
export const useCurrentTimeStore = create<CurrentTime>((set, get) => ({
  currentTime: 0,
  intervalId: null,
  setCurrentTime: (value) => set({ currentTime: value }),
  incrementTime: () =>
    set((state) => ({ currentTime: state.currentTime + 400 })),
  setIntervalId: (id) => set({ intervalId: id }),
  startInterval: () => {
    // console.log("---Starting interval---");
    const { intervalId, incrementTime } = get();
    if (intervalId) return; // Don't start if already running

    const id = setInterval(() => {
      incrementTime();
    }, 400);
    // console.log("Interval ID", id);
    set({ intervalId: id });
  },
  pauseInterval: () => {
    const { intervalId } = get();
    // console.log("---Pausing interval---");
    // console.log("Interval ID", intervalId);

    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ intervalId: null });
  },
  resetInterval: () => {
    const { intervalId } = get();
    // console.log("---Resetting interval---");
    // console.log("Interval ID", intervalId);

    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ intervalId: null, currentTime: 0 });
  },
}));
