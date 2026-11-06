import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionDetails, toSlug } from "@/app/_utils/fetchUtils/getCollectionDetails";
import { getCollectionItems } from "@/app/_utils/fetchUtils/getCollectionItems";
import { getCollectionMap } from "@/app/_utils/fetchUtils/getCollectionMap";
import CollectionOrganization from "./CollectionOrganization";

interface Props {
  params: Promise<{ uniqueId: string }>
};

/**
 * Individual collection view page that uses a single uniqueId for the collection's unique ID
 *
 * @returns CollectionPage which changes based on a dynamic route segment: [uniqueId]
 */
export default async function CollectionPage({ params }: Props) {

  const { uniqueId } = await params;

  const details = await getCollectionDetails(uniqueId);
  if (!details) notFound();

  const { collection, topLevel } = details;
  const { items, total } = await getCollectionItems(collection.id);
  const map = await getCollectionMap(collection, topLevel);

  return (
    <>
      { topLevel?.thumbnail_path && (
        // eslint-disable-next-line @next/next/no-img-element -- plain img like dlp-access; images come from several hosts
        <img src={ topLevel.thumbnail_path } alt="" />
      ) }
      <h1>{ collection.title }</h1>
      { collection.description?.map((text, i) => <p key={ i }>{ text }</p>) }
      { map && <CollectionOrganization map={ map } currentId={ collection.id } /> }
      <h2>Items ({ total })</h2>
      <ul>
        { items.map((item) => (
          <li key={ item.id }>
            { item.thumbnail_path && (
              // eslint-disable-next-line @next/next/no-img-element -- plain img like dlp-access
              <img src={ item.thumbnail_path } alt="" />
            ) }
            <Link href={ `/item/${ toSlug(item.custom_key) }` }>{ item.title }</Link>
          </li>
        )) }
      </ul>
    </>
  );
}
