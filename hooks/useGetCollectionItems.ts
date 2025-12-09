import { useCallback, useEffect, useState } from "react";
import { getCollectionItems } from "@/lib/fetchTools";

export const useGetCollectionItems = (id: string) => {
  const [items, setItems] = useState<any[] | null>(null);
  const [paginationState, setPaginationState] = useState({
    sortOpt: { field: "title", direction: "asc" },
    page: 0,
    limit: 10,
    totalPages: 1,
    total: 0,
    nextPageTokens: [null as string | null]
  });

  const { sortOpt, page, limit, totalPages, nextPageTokens, total } =
    paginationState;
  const currentToken = nextPageTokens[page];

  // Loads collection items based on collection id,
  // sort order, limit, and page
  useEffect(() => {
    const loadItems = async (collectionID: string) => {
      const offset = page * limit;
      const response = await getCollectionItems(
        collectionID,
        limit,
        offset
      );
      setPaginationState((prevState) => {
        return {
          ...prevState,
          totalPages: Math.ceil(response.total / limit),
          total: typeof response.total === 'number' ? response.total : parseInt(response.total)
        };
      });
      setItems(response.items);
    };
    loadItems(id);
  }, [id, limit, sortOpt, page]);

  const handleResultsNumberDropdown = useCallback(
    (_: any, result: { value: string }) => {
      setPaginationState((prevState) => ({
        ...prevState,
        limit: parseInt(result.value),
        nextPageTokens: [null],
        page: 0
      }));
    },
    []
  );

  const handleSortOrderDropdown = useCallback(
    (sortField: string, sortDirection: string) => {
      setPaginationState((prevState) => ({
        ...prevState,
        sortOpt: {
          field: sortField,
          direction: sortDirection
        },
        nextPageTokens: [null],
        page: 0
      }));
    },
    []
  );

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
    items,
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
};
