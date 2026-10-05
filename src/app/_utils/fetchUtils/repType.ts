/**
 * This deployment's site, like dlp-access's REACT_APP_REP_TYPE (e.g. "IAWA").
 * Used as Site.siteId and as collection_category / item_category filters.
 *
 * @returns The lowercased site ID, "federated" if NEXT_PUBLIC_REP_TYPE isn't set
 */
export function getRepType(): string {
  return (process.env.NEXT_PUBLIC_REP_TYPE ?? "federated").toLowerCase();
}
