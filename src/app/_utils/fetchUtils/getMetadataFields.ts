import { graphqlRequest } from "./graphqlRequest";

const LIST_METADATA_FIELDS = /* GraphQL */ `
  query ListMetadataFields($limit: Int, $nextToken: String) {
    listMetadataFields(limit: $limit, nextToken: $nextToken) {
      items {
        id
        columnName
        labelName
        type
        required
        description
        example
        category
        sortOrder
        isSystemGenerated
        isSIPRequired
        isFacetRequired
      }
      nextToken
    }
  }
`;

export type MetadataField = {
  id: string;
  columnName: string;
  labelName: string;
  type: string;
  required: string; // "Yes", "No" or "Conditional"
  description: string;
  example: string;
  category: string; // "Archive", "Collection" or "Both"
  sortOrder: number | null;
  isSystemGenerated: boolean;
  isSIPRequired: boolean;
  isFacetRequired: boolean;
};

type MetadataFieldPage = {
  items: MetadataField[];
  nextToken: string | null;
};

/**
 * Fetches every metadata field for the Metadata Guide, like dlp-access's MetadataPage:
 * all pages of listMetadataFields, sorted by sortOrder, then by columnName.
 *
 * @returns The fields, or null if they can't be loaded
 */
export async function getMetadataFields(): Promise<MetadataField[] | null> {
  try {
    const fields: MetadataField[] = [];
    let nextToken: string | null = null;
    do {
      const data: { listMetadataFields: MetadataFieldPage } = await graphqlRequest(
        LIST_METADATA_FIELDS,
        { limit: 500, nextToken }
      );
      fields.push(...data.listMetadataFields.items);
      nextToken = data.listMetadataFields.nextToken;
    } while (nextToken);

    // Same order as dlp-access: sortOrder first, fields without one last, then by columnName
    return fields.sort((a, b) => {
      if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
      if (a.sortOrder != null) return -1;
      if (b.sortOrder != null) return 1;
      return a.columnName.localeCompare(b.columnName);
    });
  } catch (error) {
    console.error("Error fetching metadata fields:", error);
    return null;
  }
}
