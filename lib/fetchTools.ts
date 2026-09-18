/**
 * Data fetching utilities for DLP Access
 * Real AWS Amplify GraphQL implementation
 */

import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';

// Lazy client generation - only create when needed (after Amplify configured)
let client: any = null;
const getClient = () => {
  if (!client) {
    client = generateClient();
  }
  return client;
};

/**
 * Gets site configuration data
 */
export async function getSite() {
  try {
    const response: any = await getClient().graphql({
      query: queries.getSite,
      variables: { id: "1" }
    });
    return response.data.getSite;
  } catch (error) {
    console.error('Error fetching site configuration:', error);
    return null;
  }
}

export async function getCollections() {
  // Placeholder - not used in current implementation
  return [];
}

/**
 * Fetches all top-level collections for browse page
 */
export async function getBrowseCollections(
  sortOpt: { field: string; direction: string },
  limit: number,
  nextToken?: string | null
) {
  const options = {
    filter: {
      visibility: { eq: true },
      parent_collection: { exists: false } // Only top-level collections
    },
    sort: [{ field: sortOpt.field, direction: sortOpt.direction }],
    limit: limit,
    nextToken: nextToken
  };

  try {
    const response: any = await getClient().graphql({
      query: queries.searchCollections,
      variables: options
    });
    return response.data.searchCollections;
  } catch (error) {
    console.error('Error fetching browse collections:', error);
    return { items: [], total: 0, nextToken: null };
  }
}

export async function searchItems(query: string, filters?: Record<string, any>) {
  // TODO: Implement search functionality
  return {
    items: [],
    total: 0,
  };
}

/**
 * Fetches a collection by its custom key (URL-friendly identifier)
 */
export async function getCollectionFromCustomKey(customKey: string | string[] | undefined) {
  if (!customKey || Array.isArray(customKey)) return null;

  const options = {
    order: "ASC",
    limit: 1,
    filter: {
      visibility: { eq: true },
      custom_key: {
        matchPhrase: customKey
      }
    }
  };

  try {
    const response: any = await getClient().graphql({
      query: queries.searchCollections,
      variables: options
    });
    return response.data.searchCollections.items[0];
  } catch (error) {
    console.error(`Error fetching collection: ${customKey}`, error);
    return null;
  }
}

/**
 * Gets the top-level parent collection from a collection's hierarchy path
 */
export async function getTopLevelParentForCollection(collection: any) {
  if (!collection?.heirarchy_path || collection.heirarchy_path.length === 0) {
    // If no hierarchy, the collection itself is the top level
    return collection;
  }

  const topLevelId = collection.heirarchy_path[0];

  try {
    const response: any = await getClient().graphql({
      query: queries.getCollection,
      variables: { id: topLevelId }
    });
    return response.data.getCollection;
  } catch (error) {
    console.error(`Error getting top level parent for: ${collection.id}`, error);
    return collection;
  }
}

/**
 * Fetches items within a collection with pagination and sorting
 */
export async function getCollectionItems(
  collectionID: string,
  limit: number = 10,
  offset: number = 0
) {
  // Calculate nextToken from offset (simplified - actual implementation may differ)
  const queryGetCollectionItems = `query SearchCollectionItems(
      $parent_id: String!
      $limit: Int
      $sort: [SearchableArchiveSortInput]
      $nextToken: String
    ) {
    searchArchives(
      filter: {
        heirarchy_path: { eq: $parent_id },
        visibility: { eq: true }
      },
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        title
        archiveOptions
        description
        start_date
        thumbnail_path
        custom_key
        identifier
        description
        tags
        creator
      }
      total
      nextToken
    }
  }`;

  try {
    const response: any = await getClient().graphql({
      query: queryGetCollectionItems,
      variables: {
        parent_id: collectionID,
        limit: limit,
        sort: [{ field: "title", direction: "asc" }],
        nextToken: null
      }
    });
    return response.data.searchArchives;
  } catch (error) {
    console.error(`Error fetching collection items for: ${collectionID}`, error);
    return { items: [], total: 0, nextToken: null };
  }
}

/**
 * Fetches page content by category (e.g., 'about', 'team')
 */
export async function getPageContent(contentId: string) {
  try {
    const response: any = await getClient().graphql({
      query: queries.getPageContent,
      variables: { id: contentId }
    });
    return response.data.getPageContent;
  } catch (error) {
    console.error(`Error fetching page content: ${contentId}`, error);
    return null;
  }
}
