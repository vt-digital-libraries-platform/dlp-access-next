import type { Metadata } from "next";

const DEFAULT_SITE_TITLE = "Virginia Tech Digital Libraries";

/**
 * Builds a page's JSON-LD structured data, like dlp-access's buildHeaderSchema.
 *
 * @param parentType schema.org type of the page (e.g. "Article")
 * @param type Type of the page's main entity (e.g. "MetadataPage")
 * @param id The page's URL
 * @param title Headline (dlp-access passes the site title)
 * @returns The structured data object
 */
export function buildHeaderSchema(parentType: string, type: string, id: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": parentType,
    mainEntityOfPage: { "@type": type, "@id": id },
    headline: title,
  };
}

/**
 * Writes structured data into the page as a JSON-LD script, invisible to visitors.
 * "<" is escaped so the JSON can't close the script tag early (Next.js's recommended pattern).
 *
 * @param data The structured data, e.g. from buildHeaderSchema
 * @returns a JSON-LD script element
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={ { __html: JSON.stringify(data).replace(/</g, "\\u003c") } }
    />
  );
}

/**
 * Builds a page's title tags like dlp-access's SiteTitle: "Page | Site" for the browser tab and
 * og:title, and the site title for og:site_name.
 *
 * @param pageTitle The page's own title, e.g. "Metadata Guide"
 * @param siteTitle The site's title from getSite(); defaults to "Virginia Tech Digital Libraries"
 * @returns Next.js metadata with title and openGraph
 */
export function pageMetadata(pageTitle: string, siteTitle?: string | null): Metadata {
  const site = siteTitle || DEFAULT_SITE_TITLE;
  const title = `${ pageTitle } | ${ site }`;

  return {
    title,
    openGraph: { title, siteName: site },
  };
}
