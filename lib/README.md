# Lib Utilities

This folder contains shared utility functions and data fetching logic.

## Files

- **fetchTools.ts** - Server-side data fetching utilities for AWS Amplify/GraphQL
- **utils.ts** - General utility functions (classNames, date formatting, etc.)
- **index.ts** - Barrel export for easy imports

## Usage

```typescript
// Import utilities
import { getSite, getCollections, cn, formatDate } from '@/lib';

// Or import specific functions
import { getSite } from '@/lib/fetchTools';
import { cn } from '@/lib/utils';
```

## TODO

- [ ] Integrate AWS Amplify
- [ ] Set up GraphQL queries
- [ ] Add error handling and retry logic
- [ ] Add TypeScript types for API responses
