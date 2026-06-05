import { create } from 'zustand';

export const useScrollStore = create((set) => ({
  progress: 0,        // 0 to 1 — overall scroll progress
  section: 0,         // current section index (0 = hero, 1 = projects, 2 = contact)
  mousePos: { x: 999, y: 999 }, // initialized out of bounds so swarm doesn't trigger until mouse moves
  setProgress: (p) => set({ progress: p }),
  setSection: (s) => set({ section: s }),
  setMousePos: (pos) => set({ mousePos: pos }),
}));
