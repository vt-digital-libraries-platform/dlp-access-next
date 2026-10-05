import { graphqlRequest } from "./graphqlRequest";

const SITE_BY_SITE_ID = /* GraphQL */ `
  query SiteBySiteId($siteId: String!, $limit: Int) {
    siteBySiteId(siteId: $siteId, limit: $limit) {
      items {
        id
        siteId
        siteName
        siteTitle
        siteColor
        lang
        assetBasePath
        contact
        homePage
        browseCollections
        updatedAt
      }
    }
  }
`;

export type Site = {
  id: string;
  siteId: string | null;
  siteName: string | null;
  siteTitle: string | null;
  siteColor: string | null;
  lang: string | null;
  assetBasePath: string | null;
  contact: string[]; // list of JSON text
  homePage: string | null; // JSON text
  browseCollections: string | null; // JSON text
  updatedAt: string;
};

/**
 * Fetches this deployment's site configuration, looked up by siteId like dlp-access does with
 * REACT_APP_REP_TYPE. Each deployment sets NEXT_PUBLIC_REP_TYPE (e.g. "IAWA"); defaults to "federated".
 *
 * @param siteId The site's siteId (case-insensitive)
 * @returns The site configuration, or null if it can't be loaded or doesn't exist
 */
export async function getSite(
  siteId = process.env.NEXT_PUBLIC_REP_TYPE ?? "federated"
): Promise<Site | null> {
  try {
    const data = await graphqlRequest<{ siteBySiteId: { items: Site[] } }>(SITE_BY_SITE_ID, {
      siteId: siteId.toLowerCase(),
      limit: 1,
    });
    return data.siteBySiteId.items[0] ?? null;
  } catch (error) {
    console.error("Error fetching site configuration:", error);
    return null;
  }
}
