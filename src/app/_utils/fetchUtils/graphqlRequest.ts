type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

type RequestOptions = {
  /** Another AppSync API's URL (default: NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT) */
  endpoint?: string;
  /** That API's key (default: NEXT_PUBLIC_AWS_APPSYNC_API_KEY) */
  apiKey?: string;
  /** Cache the response for this many seconds (default: not cached) */
  revalidate?: number;
};

/**
 * Sends a GraphQL query to the DLP AppSync API using its API key.
 * Throws if the request fails or the API returns errors.
 *
 * @param query GraphQL query text
 * @param variables Values for the query's $variables
 * @param options A different API to call, and how long to cache the response
 * @returns The response's `data`, typed as T
 */
export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: RequestOptions = {}
): Promise<T> {
  const endpoint = options.endpoint ?? process.env.NEXT_PUBLIC_AWS_APPSYNC_GRAPHQL_ENDPOINT;
  const apiKey = options.apiKey ?? process.env.NEXT_PUBLIC_AWS_APPSYNC_API_KEY;
  if (!endpoint || !apiKey) {
    throw new Error("Missing AppSync endpoint or API key environment variables");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ query, variables }),
    ...(options.revalidate !== undefined && { next: { revalidate: options.revalidate } }),
  });
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data as T;
}
