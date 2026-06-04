"use client";

import { create } from "zustand";
import type { Farm } from "@/types/farmledger";

type FarmStore = {
  selectedFarmId?: string;
  farms: Farm[];
  setSelectedFarmId: (farmId?: string) => void;
  setFarms: (farms: Farm[]) => void;
};

export const useFarmStore = create<FarmStore>((set) => ({
  farms: [],
  setSelectedFarmId: (selectedFarmId) => set({ selectedFarmId }),
  setFarms: (farms) => set({ farms })
}));
