import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSite } from "@/app/_utils/fetchUtils/getSite";
import { getMetadataFields } from "@/app/_utils/fetchUtils/getMetadataFields";
import { buildHeaderSchema, JsonLd, pageMetadata } from "@/app/_utils/structuredData";
import MetadataGuide from "./MetadataGuide";
import "./page.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    ...pageMetadata("Metadata Guide", site?.siteTitle),
    description: "Comprehensive metadata field guide for digital collections",
  };
}

/**
 * Metadata Guide page, like dlp-access's MetadataPage.
 *
 * @returns the metadata field guide for this site
 */
export default async function MetadataPage() {
  const [site, fields, headerList] = await Promise.all([getSite(), getMetadataFields(), headers()]);
  const url = `${ headerList.get("x-forwarded-proto") ?? "http" }://${ headerList.get("host") }/about/metadata`;

  return (
    <>
      <JsonLd data={ buildHeaderSchema("Article", "MetadataPage", url, site?.siteTitle || "Virginia Tech Digital Libraries") } />
      <MetadataGuide fields={ fields } />
    </>
  );
}
