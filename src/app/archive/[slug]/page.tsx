import ItemArchivePage from "@/app/_components/items/ItemArchivePage";

interface Props {
  params: Promise<{ slug: string }>
};

/**
 * Individual archive (item) view page that uses a single slug for the item's unique ID
 * 
 * @returns ArchivePage which changes based on a dynamic route segment: [slug]
 */
export default async function ArchivePage({ params }: Props) {
  
  const { slug } = await params;

  return (
    <ItemArchivePage id={ slug } />
  );
}
