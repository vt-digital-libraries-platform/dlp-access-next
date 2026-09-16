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
export default function ItemArchivePage({ id }: Props) {
  return (
    <>
      <h1>Item*: { id }</h1>
      <p>This is the page for item id: { id }.</p>
    </>
  );
}
