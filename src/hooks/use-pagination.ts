import { useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination({
  initialPage = 1,
  pageSize = 10,
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginate = <T>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number): number => {
    return Math.ceil(totalItems / pageSize);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = (totalItems: number) => {
    const totalPages = getTotalPages(totalItems);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    pageSize,
    paginate,
    getTotalPages,
    goToPage,
    nextPage,
    prevPage,
  };
}
