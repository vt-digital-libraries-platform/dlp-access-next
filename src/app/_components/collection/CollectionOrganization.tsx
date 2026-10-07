import Link from "next/link";
import type { CollectionMapNode } from "@/app/_utils/fetchUtils/getCollectionMap";

interface Props {
  map: CollectionMapNode
  currentId: string
}

function TreeNode({ node, currentId }: { node: CollectionMapNode, currentId: string }) {
  return (
    <li>
      <Link
        href={ `/collection/${ node.custom_key }` }
        aria-current={ node.id === currentId ? "page" : undefined }
      >
        { node.name }
      </Link>
      { node.children?.length ? (
        <ul>
          { node.children.map((child) => <TreeNode key={ child.id } node={ child } currentId={ currentId } />) }
        </ul>
      ) : null }
    </li>
  );
}

/**
 * The "Collection Organization" tree of a top-level collection and its sub-collections, like
 * dlp-access's SubCollectionsTree. Renders nothing if the collection has no sub-collections.
 *
 * @param map The collection map from getCollectionMap
 * @param currentId The ID of the collection being viewed, marked as the current page
 * @returns a nested list of links to each collection in the tree
 */
export default function CollectionOrganization({ map, currentId }: Props) {
  if (!map.children?.length) return null;

  return (
    <section aria-labelledby="collection-organization">
      <h2 id="collection-organization">Collection Organization</h2>
      <ul>
        <TreeNode node={ map } currentId={ currentId } />
      </ul>
    </section>
  );
}
