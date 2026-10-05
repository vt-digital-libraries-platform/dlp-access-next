import { graphqlRequest } from "./graphqlRequest";
import { getRepType } from "./repType";

const FULLTEXT_COLLECTIONS = /* GraphQL */ `
  query BrowseCollections(
    $filter: SearchableCollectionFilterInput
    $sort: SearchableCollectionSortInput
    $limit: Int
    $nextToken: String
  ) {
    fulltextCollections(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
      items {
        id
        identifier
        custom_key
        title
        description
        thumbnail_path
        creator
        start_date
        end_date
        updatedAt
      }
      total
      nextToken
    }
  }
`;

export type CollectionSummary = {
  id: string;
  identifier: string;
  custom_key: string | null;
  title: string;
  description: string[] | null;
  thumbnail_path: string | null;
  creator: string[] | null;
  start_date: string | null;
  end_date: string | null;
  updatedAt: string;
};

export type SortOption = { field: string; direction: "asc" | "desc" };

export type CollectionPage = {
  items: CollectionSummary[];
  total: number;
  nextToken: string | null;
};

/**
 * Fetches one page of this site's visible, top-level collections, using the same filter as
 * dlp-access's browse page (collection_category = REP_TYPE).
 *
 * @param sort Field and direction to sort by
 * @param limit Page size
 * @param nextToken Token from the previous page, or null for the first page
 * @returns The page of collections, or an empty page if it can't be loaded
 */
export async function getBrowseCollections(
  sort: SortOption = { field: "title", direction: "asc" },
  limit = 12,
  nextToken: string | null = null
): Promise<CollectionPage> {
  try {
    const data = await graphqlRequest<{ fulltextCollections: CollectionPage }>(FULLTEXT_COLLECTIONS, {
      filter: {
        collection_category: { eq: getRepType() },
        visibility: { eq: true },
        parent_collection: { exists: false },
      },
      sort,
      limit,
      nextToken,
    });
    return data.fulltextCollections;
  } catch (error) {
    console.error("Error fetching browse collections:", error);
    return { items: [], total: 0, nextToken: null };
  }
}
