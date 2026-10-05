import { graphqlRequest } from "./graphqlRequest";
import { getRepType } from "./repType";
import {
  getCollectionById,
  getTopLevelParent,
  toCustomKey,
  type CollectionDetails,
} from "./getCollectionDetails";

const ITEM_BY_CUSTOM_KEY = /* GraphQL */ `
  query ItemByCustomKey($filter: SearchableArchiveFilterInput, $limit: Int) {
    searchArchives(filter: $filter, limit: $limit) {
      items {
        id
        identifier
        custom_key
        title
        description
        creator
        contributor
        publisher
        create_date
        start_date
        end_date
        display_date
        format
        medium
        type
        subject
        tags
        language
        location
        rights
        rights_holder
        provenance
        bibliographic_citation
        thumbnail_path
        manifest_url
        archiveOptions
        heirarchy_path
        parent_collection
        updatedAt
      }
    }
  }
`;

export type ItemDetails = {
  id: string;
  identifier: string;
  custom_key: string | null;
  title: string;
  description: string[] | null;
  creator: string[] | null;
  contributor: string[] | null;
  publisher: string[] | null;
  create_date: string | null;
  start_date: string | null;
  end_date: string | null;
  display_date: string[] | null;
  format: string[] | null;
  medium: string[] | null;
  type: string[] | null;
  subject: string[] | null;
  tags: string[] | null;
  language: string[] | null;
  location: string[] | null;
  rights: string[] | null;
  rights_holder: string[] | null;
  provenance: string[] | null;
  bibliographic_citation: string[] | null;
  thumbnail_path: string | null;
  manifest_url: string | null;
  archiveOptions: string | null; // JSON text
  heirarchy_path: string[] | null;
  parent_collection: string[] | null;
  updatedAt: string;
};

export type ItemWithCollections = {
  item: ItemDetails;
  collection: CollectionDetails;
  topLevel: CollectionDetails;
};

/**
 * Fetches a visible item of this site by its custom key, plus its collection and that
 * collection's top-level parent, like dlp-access's ArchivePage getArchive.
 * Used by both /item/[slug] and /archive/[slug].
 *
 * @param customKey The item's custom key: a slug ("2z11cq41") or full ARK
 * @returns The item with its collection and top-level parent, or null if any is missing
 */
export async function getItemDetails(customKey: string): Promise<ItemWithCollections | null> {
  if (!customKey?.trim()) return null;

  try {
    const data = await graphqlRequest<{ searchArchives: { items: ItemDetails[] } }>(ITEM_BY_CUSTOM_KEY, {
      filter: {
        item_category: { eq: getRepType() },
        visibility: { eq: true },
        custom_key: { eq: toCustomKey(customKey) },
      },
      limit: 1,
    });
    const item = data.searchArchives.items[0];
    if (!item) return null;

    const parentId = item.parent_collection?.[0];
    const collection = parentId ? await getCollectionById(parentId) : null;
    if (!collection) return null;

    return { item, collection, topLevel: await getTopLevelParent(collection) };
  } catch (error) {
    console.error(`Error fetching item: ${customKey}`, error);
    return null;
  }
}
