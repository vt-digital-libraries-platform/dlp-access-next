import { graphqlRequest } from "./graphqlRequest";
import type { CollectionDetails } from "./getCollectionDetails";

const GET_COLLECTION_MAP = /* GraphQL */ `
  query GetCollectionmap($id: ID!) {
    getCollectionmap(id: $id) {
      map_object
    }
  }
`;

export type CollectionMapNode = {
  id: string;
  name: string;
  custom_key: string;
  children?: CollectionMapNode[];
};

/**
 * Sorts each level's children by their trailing number when both names end in one, otherwise by
 * name, like dlp-access's useLoadMap.
 */
function sortTree(node: CollectionMapNode): CollectionMapNode {
  const children = node.children?.map(sortTree).sort((a, b) => {
    const aNum = parseInt(a.name.split(" ").pop() ?? "");
    const bNum = parseInt(b.name.split(" ").pop() ?? "");
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum > bNum ? 1 : -1;
    return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
  });
  return { ...node, children };
}

/**
 * Fetches the collection map (the stored tree of a top-level collection and its sub-collections),
 * using the collection's own map or its top-level parent's, like dlp-access's useLoadMap.
 *
 * @param collection The collection being shown
 * @param topLevel Its top-level parent (itself if top-level)
 * @returns The sorted tree, or null if there's no map or it can't be loaded
 */
export async function getCollectionMap(
  collection: CollectionDetails,
  topLevel: CollectionDetails
): Promise<CollectionMapNode | null> {
  const mapId = collection.collectionmap_id ?? topLevel.collectionmap_id;
  if (!mapId) return null;
  try {
    const data = await graphqlRequest<{ getCollectionmap: { map_object: string } | null }>(
      GET_COLLECTION_MAP,
      { id: mapId }
    );
    const mapObject = data.getCollectionmap?.map_object;
    return mapObject ? sortTree(JSON.parse(mapObject)) : null;
  } catch (error) {
    console.error(`Error fetching collection map: ${mapId}`, error);
    return null;
  }
}
