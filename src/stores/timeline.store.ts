import { create } from "zustand";
import { ActivityDTO } from "../schemas/timeline.schema";

interface TimelineState {
  filterType: string;
  selectedCustomerId: string | null;
  isCreateActivityModalOpen: boolean;
  setFilterType: (filterType: string) => void;
  setSelectedCustomerId: (id: string | null) => void;
  setCreateActivityModalOpen: (open: boolean) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  filterType: "all",
  selectedCustomerId: null,
  isCreateActivityModalOpen: false,
  setFilterType: (filterType) => set({ filterType }),
  setSelectedCustomerId: (selectedCustomerId) => set({ selectedCustomerId }),
  setCreateActivityModalOpen: (isCreateActivityModalOpen) =>
    set({ isCreateActivityModalOpen }),
}));
