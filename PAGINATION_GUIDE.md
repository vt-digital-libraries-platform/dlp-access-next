# Pagination Implementation Guide

## Overview

Our pagination system uses **token-based (cursor) pagination** from AWS AppSync GraphQL API, which is different from traditional offset-based pagination.

---

## 🎯 Two Types of Pagination

### 1. **Offset-Based Pagination (Traditional - NOT what we use)**

```
Think of it like a book with page numbers:
┌─────────────────────────────────────┐
│ Page 1: Items 1-10                  │
│ Page 2: Items 11-20                 │
│ Page 3: Items 21-30                 │
└─────────────────────────────────────┘

To get Page 2: Skip 10 items, take 10
To get Page 3: Skip 20 items, take 10
```

**Problems:**

- Slow for large datasets (must count all skipped items)
- Data can shift if items added/deleted during browsing
- Not efficient for databases

---

### 2. **Token-Based (Cursor) Pagination (What AWS uses - What we implement)**

```
Think of it like bookmarks in a long scroll:
┌─────────────────────────────────────┐
│ Request 1: Give me 10 items         │
│ Response: [items] + token="abc123"  │ ← Bookmark for "where you left off"
│                                     │
│ Request 2: Give me 10 more after    │
│            token "abc123"           │
│ Response: [items] + token="def456"  │ ← New bookmark
└─────────────────────────────────────┘
```

**Benefits:**

- Fast - database uses index to jump directly to position
- Consistent - immune to data changes during browsing
- Scalable - works with millions of items

---

## 🔍 How Our Implementation Works

### Visual Flow Diagram

```
User Action          →  Frontend State            →  GraphQL API Call
──────────────────────────────────────────────────────────────────────

Initial Load
┌──────────┐        ┌──────────────────┐        ┌─────────────────┐
│ Page 1   │   →    │ page: 0          │   →    │ query: {        │
│          │        │ limit: 10        │        │   limit: 10     │
│          │        │ nextToken: null  │        │   nextToken:    │
│          │        │                  │        │     null        │
└──────────┘        └──────────────────┘        └─────────────────┘
                             ↓
                    ┌──────────────────┐
                    │ Response:        │
                    │ - items: [...]   │
                    │ - total: 50      │
                    │ - nextToken:     │
                    │   "abc123"       │
                    └──────────────────┘
                             ↓
                    ┌──────────────────┐
                    │ Store in state:  │
                    │ nextPageTokens = │
                    │ [null, "abc123"] │
                    └──────────────────┘

Click "Next" Button
┌──────────┐        ┌──────────────────┐        ┌─────────────────┐
│ Page 2   │   →    │ page: 1          │   →    │ query: {        │
│          │        │ limit: 10        │        │   limit: 10     │
│          │        │ nextToken:       │        │   nextToken:    │
│          │        │   "abc123"       │        │     "abc123"    │
└──────────┘        └──────────────────┘        └─────────────────┘
                             ↓
                    ┌──────────────────┐
                    │ Response:        │
                    │ - items: [...]   │
                    │ - total: 50      │
                    │ - nextToken:     │
                    │   "def456"       │
                    └──────────────────┘
                             ↓
                    ┌──────────────────┐
                    │ Store in state:  │
                    │ nextPageTokens = │
                    │ [null, "abc123", │
                    │  "def456"]       │
                    └──────────────────┘
```

---

## 💻 Code Implementation

### 1. **State Management** (`useBrowseCollections.ts`)

```typescript
const [paginationState, setPaginationState] = useState({
  sortOpt: { field: "title", direction: "asc" },
  page: 0, // Current page index (0-based)
  limit: 12, // Items per page
  totalPages: 1, // Total number of pages
  total: 0, // Total number of items
  nextPageTokens: [null], // Array of tokens for each page
  //               ↑
  //               Page 0 always starts with null
});
```

**Token Array Analogy:**

```
Think of nextPageTokens as a trail of breadcrumbs:

nextPageTokens: [null, "token1", "token2", "token3"]
                 ↑      ↑        ↑         ↑
                 |      |        |         |
              Page 0  Page 1  Page 2   Page 3

To go to Page 2: Use token "token2"
To go to Page 0: Use token null (start from beginning)
```

### 2. **Fetching Data** (`useEffect`)

```typescript
useEffect(() => {
  const loadCollections = async () => {
    // Get the token for current page
    const currentToken = nextPageTokens[page];
    //                   ↑
    //    If page=2, gets nextPageTokens[2] = "token2"

    // Call GraphQL API
    const response = await getBrowseCollections(
      sortOpt, // { field: "title", direction: "asc" }
      limit, // 12
      currentToken // "token2" or null
    );

    // AWS returns:
    // {
    //   items: [...],           // The actual collection data
    //   total: 50,              // Total items in database
    //   nextToken: "token3"     // Token for NEXT page
    // }

    // Update state with NEW next token
    setPaginationState((prevState) => {
      const newNextPageTokens = [...prevState.nextPageTokens];
      newNextPageTokens[page + 1] = response.nextToken;
      //                    ↑
      // Store token for the NEXT page (page + 1)

      return {
        ...prevState,
        nextPageTokens: newNextPageTokens,
        totalPages: Math.ceil(response.total / limit),
        total: response.total,
      };
    });

    setCollections(response.items);
  };

  loadCollections();
}, [page, limit, sortOpt]);
//  ↑     ↑      ↑
//  Whenever these change, re-fetch data
```

### 3. **Navigation Functions**

```typescript
// Go to Previous Page
const handlePrevPage = () => {
  setPaginationState((prevState) => ({
    ...prevState,
    page: Math.max(prevState.page - 1, 0),
    //    ↑
    //    Never go below 0
  }));
};

// Go to Next Page
const handleNextPage = () => {
  setPaginationState((prevState) => ({
    ...prevState,
    page: Math.min(prevState.page + 1, prevState.totalPages - 1),
    //    ↑
    //    Never exceed total pages
  }));
};
```

---

## 🎬 Example Scenario

Let's say we have 50 collections, showing 12 per page:

### Step-by-Step Execution:

#### **Initial State:**

```typescript
{
  page: 0,
  limit: 12,
  total: 0,
  totalPages: 1,
  nextPageTokens: [null]
}
```

#### **Step 1: Load Page 1 (page index 0)**

```typescript
// API Call:
getBrowseCollections(sortOpt, 12, null)  // token = null

// AWS Response:
{
  items: [Collection1, Collection2, ..., Collection12],
  total: 50,
  nextToken: "eyJsYXN0S2V5...abc"  // Encrypted cursor pointing to item 13
}

// State Update:
{
  page: 0,
  limit: 12,
  total: 50,
  totalPages: 5,  // ceil(50/12) = 5 pages
  nextPageTokens: [null, "eyJsYXN0S2V5...abc"]
  //               ↑      ↑
  //            Page 0   Page 1 token stored
}
```

#### **Step 2: User Clicks "Next" → Go to Page 2**

```typescript
// handleNextPage() called
// Sets page: 1

// API Call:
getBrowseCollections(sortOpt, 12, "eyJsYXN0S2V5...abc")
//                                 ↑
//                          Uses stored token for page 1

// AWS Response:
{
  items: [Collection13, Collection14, ..., Collection24],
  total: 50,
  nextToken: "eyJsYXN0S2V5...def"  // Points to item 25
}

// State Update:
{
  page: 1,
  limit: 12,
  total: 50,
  totalPages: 5,
  nextPageTokens: [null, "eyJsYXN0S2V5...abc", "eyJsYXN0S2V5...def"]
  //               ↑      ↑                      ↑
  //            Page 0   Page 1                Page 2 token stored
}
```

#### **Step 3: User Clicks "Previous" → Back to Page 1**

```typescript
// handlePrevPage() called
// Sets page: 0

// API Call:
getBrowseCollections(sortOpt, 12, null);
//                                 ↑
//                          Uses token from index 0

// No new token stored (we already have it)
// Just displays the first 12 items again
```

---

## 📊 UI Display Logic

```typescript
// In the component:
<div className={styles.totalText}>
  Showing {collections.length} of {total} collections
  {/* Example: "Showing 12 of 50 collections" */}
</div>

<div className={styles.pageInfo}>
  Page {page + 1} of {totalPages}
  {/* Example: "Page 2 of 5" */}
</div>

<button
  onClick={handlePrevPage}
  disabled={page === 0}
  {/* Disabled on first page */}
>
  ← Previous
</button>

<button
  onClick={handleNextPage}
  disabled={page >= totalPages - 1}
  {/* Disabled on last page */}
>
  Next →
</button>
```

---

## 🔄 Items Per Page Change

When user changes items per page (12 → 24 → 48):

```typescript
const handleResultsNumberDropdown = (_, result) => {
  setPaginationState((prevState) => ({
    ...prevState,
    limit: parseInt(result.value), // New limit
    nextPageTokens: [null], // RESET tokens (important!)
    page: 0, // GO BACK to page 0
  }));
  // Why reset? Because tokens are tied to specific page sizes
  // A token for "12 items" doesn't work for "24 items"
};
```

---

## 🎨 Visual Analogy: The Restaurant Menu

```
Imagine a restaurant with 50 dishes:

┌─────────────────────────────────────────────┐
│  Waiter gives you menu pages:               │
│                                             │
│  Page 1: Dishes 1-12  → Token: "Page2Card" │
│  (You're here)                              │
│                                             │
│  [Previous] [Next →]                        │
└─────────────────────────────────────────────┘
           ↓ Click Next
┌─────────────────────────────────────────────┐
│  You give waiter "Page2Card"                │
│  Waiter brings:                             │
│                                             │
│  Page 2: Dishes 13-24 → Token: "Page3Card" │
│  (You're here now)                          │
│                                             │
│  [← Previous] [Next →]                      │
└─────────────────────────────────────────────┘

You can go back to Page 1 anytime - the waiter
remembers where Page 1 started (token = null)
```

---

## 🚀 GraphQL API Call (Under the Hood)

```typescript
// What getBrowseCollections does:
export async function getBrowseCollections(sortOpt, limit, nextToken) {
  const options = {
    filter: {
      visibility: { eq: true },
      parent_collection: { exists: false },
    },
    sort: [{ field: sortOpt.field, direction: sortOpt.direction }],
    limit: limit,
    nextToken: nextToken, // ← The magic cursor
  };

  const response = await client.graphql({
    query: queries.searchCollections,
    variables: options,
  });

  return response.data.searchCollections;
  // Returns: { items: [...], total: 50, nextToken: "..." }
}
```

**GraphQL Query Sent to AWS:**

```graphql
query SearchCollections(
  $filter: SearchableCollectionFilterInput
  $sort: [SearchableCollectionSortInput]
  $limit: Int
  $nextToken: String
) {
  searchCollections(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      title
      description
      thumbnail_path
      custom_key
      # ... more fields
    }
    total # ← Total count in database
    nextToken # ← Cursor for next batch
  }
}
```

---

## 🎯 Key Takeaways for Your Developer

1. **Token Array is Critical**: `nextPageTokens` stores bookmarks for each page
2. **Page Index ≠ Offset**: `page: 0` means "use token at index 0", NOT "skip 0 items"
3. **Always Reset on Filter Change**: New filters/sorts = new token sequence
4. **Tokens are Opaque**: Don't try to decode or manipulate them
5. **Backward Navigation is Free**: We store previous tokens, so going back doesn't need new API calls

---

## 📝 Comparison Table

| Feature             | Offset Pagination         | Token Pagination (Ours) |
| ------------------- | ------------------------- | ----------------------- |
| Performance         | O(n) - slower             | O(1) - fast             |
| Data consistency    | Can skip/duplicate items  | Stable snapshots        |
| Implementation      | `skip` & `take`           | `nextToken`             |
| Backward navigation | Always possible           | Requires token storage  |
| AWS AppSync support | ❌ Not natively supported | ✅ Native support       |
| Good for            | Small datasets            | Large datasets          |

---

## 🐛 Common Mistakes to Avoid

```typescript
// ❌ WRONG: Treating page like offset
const offset = page * limit;
// This doesn't work with tokens!

// ✅ CORRECT: Use page as index into token array
const currentToken = nextPageTokens[page];

// ❌ WRONG: Reusing tokens after changing limit
// Token for 12 items won't work for 24 items

// ✅ CORRECT: Reset tokens when changing limit
setPaginationState({
  ...prevState,
  limit: newLimit,
  nextPageTokens: [null], // ← Reset
  page: 0, // ← Start over
});
```

---

**Need more clarification? Let me know!** 🚀
