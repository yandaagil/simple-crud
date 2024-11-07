import { useState } from "react";
import { User } from "../types/user.type";
import { useUserStore } from "../stores/user.store";

const FILTER_ITEM = ["Tampilkan Semua", "Aktif", "Tidak Aktif"];

export const useFilter = ({ users }: { users: User[] }) => {
  const [filterState, setFilterState] = useState<string>(FILTER_ITEM[0]);
  const { filteredData, setFilteredData, setSortedData } = useUserStore();

  // Handle filter berdasarkan status user(filterState)
  const handleFilter = (filter: string) => {
    setFilterState(filter);

    const filteredArray = users.filter((user) => {
      if (filter === "Aktif") return user.status;
      if (filter === "Tidak Aktif") return !user.status;
      if (filter === "Tampilkan Semua") return user;
      return false;
    });

    setFilteredData(filteredArray);
    setSortedData(filteredArray);
  };

  return { filterState, handleFilter, filteredData };
};
