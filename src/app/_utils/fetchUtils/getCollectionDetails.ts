import { graphqlRequest } from "./graphqlRequest";
import { getRepType } from "./repType";

const COLLECTION_FIELDS = /* GraphQL */ `
  id
  identifier
  custom_key
  title
  description
  thumbnail_path
  creator
  create_date
  start_date
  end_date
  display_date
  subject
  language
  location
  rights
  rights_holder
  bibliographic_citation
  heirarchy_path
  parent_collection
  updatedAt
`;

const COLLECTION_BY_CUSTOM_KEY = /* GraphQL */ `
  query CollectionByCustomKey($filter: SearchableCollectionFilterInput, $limit: Int) {
    searchCollections(filter: $filter, limit: $limit) {
      items { ${COLLECTION_FIELDS} }
    }
  }
`;

const GET_COLLECTION = /* GraphQL */ `
  query GetCollection($id: ID!) {
    getCollection(id: $id) { ${COLLECTION_FIELDS} }
  }
`;

export type CollectionDetails = {
  id: string;
  identifier: string;
  custom_key: string | null;
  title: string;
  description: string[] | null;
  thumbnail_path: string | null;
  creator: string[] | null;
  create_date: string | null;
  start_date: string | null;
  end_date: string | null;
  display_date: string[] | null;
  subject: string[] | null;
  language: string[] | null;
  location: string[] | null;
  rights: string[] | null;
  rights_holder: string[] | null;
  bibliographic_citation: string[] | null;
  heirarchy_path: string[] | null;
  parent_collection: string[] | null;
  updatedAt: string;
};

export type CollectionWithParent = {
  collection: CollectionDetails;
  topLevel: CollectionDetails;
};

const ARK_PREFIX = "ark:/53696/";

/**
 * Accepts a URL slug or a full ARK and returns the full custom_key, e.g.
 * "6997b595", "ark%3A%2F53696%2F6997b595" and "ark:/53696/6997b595" all give "ark:/53696/6997b595".
 */
function toCustomKey(key: string): string {
  const decoded = decodeURIComponent(key).trim();
  return decoded.startsWith("ark:/") ? decoded : `${ARK_PREFIX}${decoded}`;
}

/**
 * Fetches a visible collection of this site by its custom key, plus its top-level parent,
 * like dlp-access's getCollectionFromCustomKey + getTopLevelParentForCollection.
 *
 * @param customKey The collection's custom key: a slug ("6997b595") or full ARK
 * @returns The collection and its top-level parent (itself if top-level), or null if not found
 */
export async function getCollectionDetails(customKey: string): Promise<CollectionWithParent | null> {
  if (!customKey?.trim()) return null;

  try {
    const data = await graphqlRequest<{ searchCollections: { items: CollectionDetails[] } }>(
      COLLECTION_BY_CUSTOM_KEY,
      {
        filter: {
          collection_category: { eq: getRepType() },
          visibility: { eq: true },
          custom_key: { matchPhrase: toCustomKey(customKey) },
        },
        limit: 1,
      }
    );
    const collection = data.searchCollections.items[0];
    if (!collection) return null;

    const topLevelId = collection.heirarchy_path?.[0];
    if (!topLevelId || topLevelId === collection.id) {
      return { collection, topLevel: collection };
    }

    const parent = await graphqlRequest<{ getCollection: CollectionDetails | null }>(GET_COLLECTION, {
      id: topLevelId,
    });
    return { collection, topLevel: parent.getCollection ?? collection };
  } catch (error) {
    console.error(`Error fetching collection: ${customKey}`, error);
    return null;
  }
}
