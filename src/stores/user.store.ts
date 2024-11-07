import { User } from "../types/user.type";
import { create } from "zustand";

type UserState = {
  users: User[];
  sortedData: User[];
  filteredData: User[];
  setUsers: (users: User[]) => void;
  setSortedData: (sortedData: User[]) => void;
  setFilteredData: (filteredData: User[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  sortedData: [],
  filteredData: [],
  setUsers: (users) => set({ users }),
  setSortedData: (sortedData) => set({ sortedData }),
  setFilteredData: (filteredData) => set({ filteredData }),
}));
