import { useState } from "react";
import { User } from "../types/user.type";
import { useUserStore } from "../stores/user.store";

export const useSort = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: string;
  }>({ key: null, direction: "ascending" });
  const { users, sortedData, setSortedData, filteredData } = useUserStore();

  // Fungsi untuk mengurutkan data berdasarkan key(kolom tabel) yang di klik
  const sortTable = (key: keyof User) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const initialArray =
      filteredData.length !== 0 ? [...filteredData] : [...users];

    const sortedArray = initialArray.sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortedData(sortedArray);
    setSortConfig({ key, direction });
  };

  return { sortTable, sortedData, sortConfig };
};
