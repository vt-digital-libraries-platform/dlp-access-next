import "./page.css";

const BrowseTypes = {
  'all': 'Everything',
  'collections': 'Collections',
  'items': 'Items',
  'formats': 'Formats',
  'locations': 'Locations',
  'partners': 'Partner Organizations',
};

interface Props {
  params: Promise<{ slug: string }>
};

/**
 * Slug wrapper for the BrowsePage component intended to be used for routes like
 * [Browse Collections](/browse/collections).
 * 
 * Includes catch-all handling so any additional route segments not contained in the BrowseTypes 
 * object above will be directed to an appropriate page. Examples:
 *    /browse/cats = /browse
 *    /browse/formats/cats = /browse/formats
 *    /browse/cats/cats/cats = /browse
 * 
 * @returns BrowsePage which changes based on dynamic optional route segments: [[...slug]]
 */
export default async function BrowsePage({ params }: Props) {
  // TODO: add handling for new browse type prop and resolve collisions with slug, slug takes priority
  const { slug } = await params;
  const browseType =
    Object.keys(BrowseTypes).includes(slug?.at(0))
    ? slug[0]
    : 'all';

  return (
    <>
      <h1>Browse { BrowseTypes[browseType] }</h1>
      <p>This is the browse { browseType } page.</p>
    </>
  );
}
