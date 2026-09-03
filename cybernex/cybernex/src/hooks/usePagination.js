import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing pagination state
 *
 * @param {Array} items - Array of items to paginate
 * @param {number} initialPage - Initial page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {object} - Pagination state and helpers
 */
export const usePagination = (items = [], initialPage = 1, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / pageSize) || 1;
  }, [items.length, pageSize]);

  // Calculate total items
  const totalItems = useMemo(() => {
    return items.length;
  }, [items.length]);

  // Get items for current page
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  // Calculate start and end indices (1-based)
  const startIndex = useMemo(() => {
    return ((currentPage - 1) * pageSize) + 1;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(currentPage * pageSize, totalItems);
  }, [currentPage, pageSize, totalItems]);

  // Check if there are previous pages
  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  // Check if there are next pages
  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  // Go to page
  const goToPage = useCallback((page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  }, [totalPages]);

  // Go to next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  // Go to previous page
  const prevPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  // Go to first page
  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Go to last page
  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Set page size
  const setPageSize = useCallback((newPageSize) => {
    // Adjust current page if needed
    const newTotalPages = Math.ceil(items.length / newPageSize) || 1;
    const newPage = Math.min(currentPage, newTotalPages);
    setCurrentPage(newPage);
    pageSize = newPageSize;
  }, [items.length, currentPage]);

  // Reset to first page
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    // State
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    startIndex,
    endIndex,
    hasPreviousPage,
    hasNextPage,

    // Handlers
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setPageSize,
    reset,

    // Getters
    getCurrentPage: () => currentPage,
    getPageSize: () => pageSize,
    getTotalPages: () => totalPages,
    getTotalItems: () => totalItems,
    getPaginatedItems: () => paginatedItems,
  };
};

export default usePagination;