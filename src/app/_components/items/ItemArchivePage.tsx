import { notFound } from "next/navigation";
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

  const { item } = details;

  return (
    <>
      <h1>{ item.title }</h1>
      { item.description?.map((text, i) => <p key={ i }>{ text }</p>) }
    </>
  );
}
