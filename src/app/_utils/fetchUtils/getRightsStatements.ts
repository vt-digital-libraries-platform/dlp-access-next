import { graphqlRequest } from "./graphqlRequest";

const LIST_RIGHTS_STATEMENTS = /* GraphQL */ `
  query ListRightsStatements($limit: Int, $nextToken: String) {
    listRightsStatements(limit: $limit, nextToken: $nextToken) {
      items {
        id
        rightsURI
        rightsCode
        rightsLabel
        rightsCategory
        isActive
        rightsStatementText
      }
      nextToken
    }
  }
`;

export type RightsStatement = {
  id: string;
  rightsURI: string;
  rightsCode: string;
  rightsLabel: string;
  rightsCategory: string | null;
  isActive: boolean | null;
  rightsStatementText: string | null;
};

type RightsStatementPage = {
  listRightsStatements: { items: RightsStatement[]; nextToken: string | null };
};

/**
 * Fetches every row of the RightsStatement lookup table, cached for a day.
 *
 * Until dlp-access-next is connected to the CDK backend, the table is read from the API in
 * RIGHTS_APPSYNC_GRAPHQL_ENDPOINT / RIGHTS_APPSYNC_API_KEY; without them, the usual API is used.
 *
 * @returns All rights statements, or an empty list if they can't be fetched
 */
export async function getRightsStatements(): Promise<RightsStatement[]> {
  const statements: RightsStatement[] = [];
  let nextToken: string | null = null;

  try {
    do {
      const data: RightsStatementPage = await graphqlRequest<RightsStatementPage>(
        LIST_RIGHTS_STATEMENTS,
        { limit: 100, nextToken },
        {
          endpoint: process.env.RIGHTS_APPSYNC_GRAPHQL_ENDPOINT,
          apiKey: process.env.RIGHTS_APPSYNC_API_KEY,
          revalidate: 60 * 60 * 24,
        }
      );
      statements.push(...data.listRightsStatements.items);
      nextToken = data.listRightsStatements.nextToken;
    } while (nextToken);
  } catch (error) {
    console.error("Error fetching rights statements", error);
    return [];
  }

  return statements;
}

/**
 * Makes two ways of writing the same statement URI compare equal: http/https, /page/ vs /vocab/,
 * a ?language=en query, a trailing slash, and letter case.
 * e.g. "https://rightsstatements.org/page/InC/1.0/?language=en" → "rightsstatements.org/vocab/inc/1.0"
 */
const normalizeUri = (uri: string) =>
  uri
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[?#].*$/, "")
    .replace("/page/", "/vocab/")
    .replace(/\/+$/, "");

/**
 * Finds the rights statement for an item's rights URI.
 *
 * @param statements From getRightsStatements
 * @param uri The item's rights value
 * @returns The matching statement, or null if there's no URI or no match
 */
export function findRightsStatement(
  statements: RightsStatement[],
  uri: string | null | undefined
): RightsStatement | null {
  if (!uri) return null;
  const target = normalizeUri(uri);
  return statements.find((statement) => normalizeUri(statement.rightsURI) === target) ?? null;
}
