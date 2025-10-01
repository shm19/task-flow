import { create } from "zustand";


interface Filter {
  priority: string;
  storyPoint: number;
  titleSearch: string;
}

interface FilterStore {
  filter: Filter;
  setFilter: (filter: Partial<Filter>) => void;
  resetFilter: () => void;
}

const useFilterStore = create<FilterStore>((set) => ({
  filter:{
    priority: "All",
    storyPoint: 0,
    titleSearch: "",
  },
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
  resetFilter: () => set({ filter: { priority: "All", storyPoint: 0, titleSearch: "" } }),
}));

export default useFilterStore;