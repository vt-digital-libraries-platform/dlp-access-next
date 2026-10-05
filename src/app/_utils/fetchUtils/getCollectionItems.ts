import { graphqlRequest } from "./graphqlRequest";
import type { SortOption } from "./getBrowseCollections";

const SEARCH_COLLECTION_ITEMS = /* GraphQL */ `
  query SearchCollectionItems(
    $parent_id: String!
    $limit: Int
    $sort: [SearchableArchiveSortInput]
    $nextToken: String
  ) {
    searchArchives(
      filter: { heirarchy_path: { eq: $parent_id }, visibility: { eq: true } }
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        identifier
        custom_key
        title
        description
        creator
        start_date
        thumbnail_path
        tags
        archiveOptions
      }
      total
      nextToken
    }
  }
`;

export type ArchiveSummary = {
  id: string;
  identifier: string;
  custom_key: string | null;
  title: string;
  description: string[] | null;
  creator: string[] | null;
  start_date: string | null;
  thumbnail_path: string | null;
  tags: string[] | null;
  archiveOptions: string | null; // JSON text
};

export type ArchivePage = {
  items: ArchiveSummary[];
  total: number;
  nextToken: string | null;
};

/**
 * Fetches one page of the visible items in a collection, like dlp-access's getCollectionItems.
 *
 * @param collectionId The collection's ID (matched against each item's heirarchy_path)
 * @param options Page size, sort, and the token from the previous page (null for the first page)
 * @returns The page of items, or an empty page if it can't be loaded
 */
export async function getCollectionItems(
  collectionId: string,
  {
    limit = 10,
    sort = { field: "title", direction: "asc" },
    nextToken = null,
  }: { limit?: number; sort?: SortOption; nextToken?: string | null } = {}
): Promise<ArchivePage> {
  try {
    const data = await graphqlRequest<{ searchArchives: ArchivePage }>(SEARCH_COLLECTION_ITEMS, {
      parent_id: collectionId,
      limit,
      sort: [sort],
      nextToken,
    });
    return data.searchArchives;
  } catch (error) {
    console.error(`Error fetching collection items for: ${collectionId}`, error);
    return { items: [], total: 0, nextToken: null };
  }
}
