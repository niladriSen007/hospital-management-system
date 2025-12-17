import { create } from 'zustand';
import { devtools } from "zustand/middleware";

// State types
interface UserState {
  currentUser: {
    id: string;
    name: string;
    email: string;
    roles: string[]
  } | null;
  isLoggedIn: boolean;
}

// Action types
interface Actions {
  updateUser: (user: { id: string; name: string; email: string, roles: string[] }) => void;
  deleteUser: () => void;
}

// useUserStore
export const useUserStore = create<UserState & Actions>()(devtools((set, get) => ({
  // States
  currentUser: null,
  isLoggedIn: false,

  // Actions
  updateUser: (user: { id: string; name: string; email: string, roles: string[] }) => set(() => ({ currentUser: user, isLoggedIn: true })),
  deleteUser: () => set(() => ({ currentUser: null, isLoggedIn: false })),
})));