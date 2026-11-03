import "./page.css";

const BrowseTypes: { [key: string]: string } = {
  'all': 'Everything',
  'collections': 'Collections',
  'items': 'Items',
  'formats': 'Formats',
  'locations': 'Locations',
  'partners': 'Partner Organizations',
};

/**
 * Dynamic route segment wrapper for the BrowsePage component intended to be used for routes like
 * "Browse Collections" at /browse/collections.
 * 
 * Includes catch-all handling so any additional route segments not contained in the BrowseTypes 
 * object above will be directed to an appropriate page. Examples:
 *    /browse/cats = /browse
 *    /browse/formats/cats = /browse/formats
 *    /browse/cats/cats/cats = /browse
 * 
 * @todo Add a new passed prop for browse type to be used as a fallback if there is no browse type 
 * in the route. Resolve collisions with the browseType route slug, ensuring the slug takes priority
 * over the passed prop.
 * 
 * @param browseType The string array of URL slug(s) containing the browseType(s)
 * @returns BrowsePage which changes based on dynamic optional route segments: [[...browseType]]
 */
export default async function BrowsePage({ params }: PageProps<'/browse/[[...browseType]]'>) {
  const resolvedParams = await params;
  const browseTypeSlug = 
    resolvedParams.browseType 
    && Object.keys(BrowseTypes).includes(resolvedParams.browseType[0])
    ? resolvedParams.browseType[0] 
    : 'all';

  return (
    <>
      <h1>Browse { BrowseTypes[browseTypeSlug] }</h1>
      <p>This is the browse { browseTypeSlug } page.</p>
    </>
  );
}
