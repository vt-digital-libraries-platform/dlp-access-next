# Homepage Migration Progress

## ✅ Completed

### 1. Branch Setup

- Created local branch: `feature/homepage-and-static-pages`
- Added Claude migration repo as remote
- Branch stays local (no pushing until clearance)

### 2. Homepage Conversion

**From:** `pages/index.js` (Pages Router)  
**To:** `src/app/page.tsx` (App Router)

**Changes:**

- ✅ Converted to Next.js 16 App Router Server Component
- ✅ Added TypeScript types
- ✅ Implemented Metadata API for SEO
- ✅ Created page-specific CSS (`page.module.css`)
- ✅ Migrated all UI sections:
  - Hero banner with background image
  - Search bar
  - Browse collections grid (4 cards)
- ✅ Converted `<Link>` and `<Image>` to Next.js 16 patterns
- ✅ Placeholder for data fetching (getSite function ready to uncomment)

### 3. Global Components

- ✅ Created `components/Footer.tsx` (TypeScript)
- Ready to be used across all pages

## 📋 Next Steps

### Phase 1: Complete Homepage

1. **Import CSS module** in page.tsx
2. **Create hero-bg.jpg** image or use placeholder
3. **Implement search functionality** (client component)
4. **Test the build**: `npm run dev`
5. **Add Header component** from Claude repo

### Phase 2: Static Pages Migration

Convert these pages from Claude repo:

- [ ] `/about` - About page
- [ ] `/about/formats` - Formats page
- [ ] `/about/organizations` - Organizations page
- [ ] `/about/team` - Team page
- [ ] `/partner` - Partner page
- [ ] `/permissions` - Permissions page

### Phase 3: Dynamic Pages (If Needed)

- [ ] `/collection/[customKey]` - Collection detail page
- [ ] `/archive/[customKey]` - Archive detail page
- [ ] `/browse/formats` - Browse formats
- [ ] `/browse/maps` - Browse maps

### Phase 4: Support Infrastructure

- [ ] Set up `lib/fetchTools.ts` (data fetching utilities)
- [ ] Configure AWS Amplify
- [ ] Set up GraphQL queries
- [ ] Create shared components (Header, Breadcrumbs, etc.)

## 🔄 Team Coordination

### Other Developers Working On:

- **Routing logic** - Will merge into main
- **Pagination** - Separate feature

### Workflow:

1. **Daily sync**:

   ```bash
   git checkout main
   git pull origin main
   git checkout feature/homepage-and-static-pages
   git rebase main
   ```

2. **Continue work** on homepage and static pages

3. **When ready**: Push branch and create PR

## 📁 Project Structure (Team Convention)

```
src/app/
  ├── page.tsx                    # Homepage
  ├── page.module.css             # Homepage styles
  ├── about/
  │   ├── page.tsx                # /about route
  │   ├── page.module.css
  │   ├── components/             # About-specific components
  │   ├── formats/
  │   │   └── page.tsx            # /about/formats route
  │   └── team/
  │       └── page.tsx            # /about/team route
  └── collection/
      └── [customKey]/
          ├── page.tsx            # Dynamic collection page
          ├── page.module.css
          └── components/         # Collection-specific components

components/                       # Global components
  ├── Footer.tsx
  ├── Header.tsx
  └── ...

lib/                             # Utilities
  └── fetchTools.ts
```

## 🎯 Current Focus

**Working on:** Homepage UI and layout  
**Branch:** `feature/homepage-and-static-pages` (local only)  
**Next immediate task:** Test homepage build and styling

## 💡 Notes

- CSS uses plain CSS modules (not Tailwind for page-specific styles)
- Server Components by default (use 'use client' only when needed)
- Data fetching ready but commented out (waiting for API setup)
- Following team's directory structure conventions
