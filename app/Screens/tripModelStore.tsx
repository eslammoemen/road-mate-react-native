import { create } from 'zustand';

export const useTripStore = create((set) => ({
  trip: null,
  setTrpid: (tripid: any) => set({ tripid }),
}));