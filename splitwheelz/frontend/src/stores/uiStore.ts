import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  notificationDrawerOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setNotificationDrawerOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  notificationDrawerOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
