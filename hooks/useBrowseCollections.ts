import { useCallback, useEffect, useState } from 'react';
import { getBrowseCollections } from '@/lib/fetchTools';

export function useBrowseCollections() {
  const [collections, setCollections] = useState<any[] | null>(null);
  const [paginationState, setPaginationState] = useState({
    sortOpt: { field: 'title', direction: 'asc' },
    page: 0,
    limit: 12,
    totalPages: 1,
    total: 0,
    nextPageTokens: [null]
  });

  const { sortOpt, page, limit, totalPages, nextPageTokens, total } = paginationState;
  const currentToken = nextPageTokens[page];

  // Fetch collections when dependencies change
  useEffect(() => {
    const loadCollections = async () => {
      const response = await getBrowseCollections(sortOpt, limit, currentToken);
      
      setPaginationState((prevState) => {
        const newNextPageTokens = [...prevState.nextPageTokens];
        newNextPageTokens[page + 1] = response.nextToken;
        return {
          ...prevState,
          nextPageTokens: newNextPageTokens,
          totalPages: Math.ceil(response.total / limit),
          total: typeof response.total === 'number' ? response.total : parseInt(response.total)
        };
      });
      
      setCollections(response.items);
    };
    
    loadCollections();
  }, [limit, sortOpt, page, currentToken]);

  const handleResultsNumberDropdown = useCallback((_: any, result: { value: string }) => {
    setPaginationState((prevState) => ({
      ...prevState,
      limit: parseInt(result.value),
      nextPageTokens: [null],
      page: 0
    }));
  }, []);

  const handleSortOrderDropdown = useCallback((sortField: string, sortDirection: string) => {
    setPaginationState((prevState) => ({
      ...prevState,
      sortOpt: { field: sortField, direction: sortDirection },
      nextPageTokens: [null],
      page: 0
    }));
  }, []);

  const handlePrevPage = useCallback(() => {
    setPaginationState((prevState) => ({
      ...prevState,
      page: Math.max(prevState.page - 1, 0)
    }));
  }, []);

  const handleNextPage = useCallback(() => {
    setPaginationState((prevState) => ({
      ...prevState,
      page: Math.min(prevState.page + 1, prevState.totalPages - 1)
    }));
  }, []);

  return {
    collections,
    total,
    sortOpt,
    totalPages,
    page,
    limit,
    handleResultsNumberDropdown,
    handleSortOrderDropdown,
    handlePrevPage,
    handleNextPage
  };
}
