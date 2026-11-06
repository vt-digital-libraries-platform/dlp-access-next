import { notFound } from "next/navigation";
import { getItemDetails } from "@/app/_utils/fetchUtils/getItemDetails";
import { getRightsStatements, findRightsStatement } from "@/app/_utils/fetchUtils/getRightsStatements";
import CopyrightCard from "@/app/_components/items/CopyrightCard";

/**
 * Individual item (archive) view page at /item/[uniqueId].
 * 
 * /archive/[uniqueId] permanently redirects here to maintain backwards compatibility with legacy 
 * DLP routing.
 * 
 * @param uniqueId The URL slug containing the item's unique 6-character identifier
 * @returns ItemPage for the item with identifier: uniqueID
 */
export default async function ItemPage({ params }: PageProps<'/item/[uniqueId]'>) {
  
  const { uniqueId } = await params;
  const details = await getItemDetails(uniqueId);
  if (!details) notFound();

  const { item } = details;
  const statement = findRightsStatement(await getRightsStatements(), item.rights?.[0]);

  return (
    <>
      <h1>{ item.title }</h1>
      { item.description?.map((text, i) => <p key={ i }>{ text }</p>) }
      <CopyrightCard holder={ item.rights_holder?.[0] } uri={ item.rights?.[0] } statement={ statement } />
    </>
  );
}
