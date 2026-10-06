import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionDetails, toSlug } from "@/app/_utils/fetchUtils/getCollectionDetails";
import { getCollectionItems } from "@/app/_utils/fetchUtils/getCollectionItems";

interface Props {
  params: Promise<{ slug: string }>
};

/**
 * Individual collection view page that uses a single slug for the collection's unique ID
 *
 * @returns CollectionPage which changes based on a dynamic route segment: [slug]
 */
export default async function CollectionPage({ params }: Props) {

  const { slug } = await params;

  const details = await getCollectionDetails(slug);
  if (!details) notFound();

  const { collection, topLevel } = details;
  const { items, total } = await getCollectionItems(collection.id);

  return (
    <>
      <h1>{ collection.title }</h1>
      { topLevel.id !== collection.id && (
        <p>Part of <Link href={ `/collection/${ toSlug(topLevel.custom_key) }` }>{ topLevel.title }</Link></p>
      ) }
      { collection.description?.map((text, i) => <p key={ i }>{ text }</p>) }
      <h2>Items ({ total })</h2>
      <ul>
        { items.map((item) => (
          <li key={ item.id }>
            <Link href={ `/item/${ toSlug(item.custom_key) }` }>{ item.title }</Link>
          </li>
        )) }
      </ul>
    </>
  );
}
