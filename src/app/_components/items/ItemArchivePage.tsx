import Link from "next/link";
import { notFound } from "next/navigation";
import { toSlug } from "@/app/_utils/fetchUtils/getCollectionDetails";
import { getItemDetails } from "@/app/_utils/fetchUtils/getItemDetails";

interface Props {
  id: string
}

/**
 * A shared page component for /item/id and /archive/id route pages to maintain backwards
 * compatibility with legacy DLP routing.
 *
 * @param id The unique identifier for the item/archive, obtained from the dynamic route slug in
 * the parent component
 * @returns a singular page contents object for item/archive pages
 */
export default async function ItemArchivePage({ id }: Props) {

  const details = await getItemDetails(id);
  if (!details) notFound();

  const { item, collection } = details;

  return (
    <>
      <h1>{ item.title }</h1>
      <p>Part of <Link href={ `/collection/${ toSlug(collection.custom_key) }` }>{ collection.title }</Link></p>
      { item.description?.map((text, i) => <p key={ i }>{ text }</p>) }
    </>
  );
}
