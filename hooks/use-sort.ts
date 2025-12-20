import { useState } from "react";

type SortDirection = "asc" | "desc" | null;

export function useSort(
  defaultKey?: string,
  defaultDirection: SortDirection = null
) {
  const [sortKey, setSortKey] = useState<string | null>(defaultKey || null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultDirection);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortData = <T extends Record<string, any>>(data: T[]): T[] => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  return {
    sortKey,
    sortDirection,
    toggleSort,
    sortData,
  };
}
