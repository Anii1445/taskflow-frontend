import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      darkMode: true,
      sidebarOpen: true,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar:  () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebar:     (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'taskflow-ui',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);

export default useUIStore;
