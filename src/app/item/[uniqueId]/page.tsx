interface Props {
  params: Promise<{ uniqueId: string }>
};

/**
 * Individual item (archive) view page at /item/[uniqueId].
 * 
 * /archive/[uniqueId] permanently redirects here to maintain backwards compatibility with legacy 
 * DLP routing.
 * 
 * @param uniqueId The URL slug containing the item's unique 6-character identifier
 * @returns ItemPage for the item with identifier: uniqueID
 */
export default async function ItemPage({ params }: Props) {
  
  const { uniqueId } = await params;

  return (
    <>
      <h1>Item: { uniqueId }</h1>
      <p>This is the page for item id: { uniqueId }.</p>
    </>
  );
}
