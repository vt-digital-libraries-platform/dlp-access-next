/**
 * Individual collection view page at /collection/[uniqueId].
 * 
 * @param uniqueId The URL slug containing the collection's unique 6-character identifier
 * @returns CollectionPage for the collection with identifier: uniqueID
 */
export default async function CollectionPage({ params }: PageProps<'/collection/[uniqueId]'>) {
  
  const { uniqueId } = await params;

  return (
    <>
      <h1>Collection: { uniqueId }</h1>
      <p>This is the page for collection id: { uniqueId }.</p>
    </>
  );
}
