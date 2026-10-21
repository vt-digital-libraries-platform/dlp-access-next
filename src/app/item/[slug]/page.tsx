import ItemArchivePage from "@/app/_components/items/ItemArchivePage";

interface Props {
  params: Promise<{ slug: string }>
};

/**
 * Individual item (archive) view page that uses a single slug for the item's unique ID
 * 
 * @returns ItemPage which changes based on a dynamic route segment: [slug]
 */
export default async function ItemPage({ params }: Props) {
  
  const { slug } = await params;

  return (
    <ItemArchivePage id={ slug } />
  );
}
