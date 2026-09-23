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

  return (
    <>
      <h1>Collection: { slug }</h1>
      <p>This is the page for collection id: { slug }.</p>
    </>
  );
}
