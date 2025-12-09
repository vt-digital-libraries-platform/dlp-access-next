'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGetCollection } from '@/hooks/useGetCollection';
import { CollectionTopContent } from '@/components/collection/CollectionTopContent';
import { CollectionItems } from '@/components/collection/CollectionItems';
import { CollectionMetadataSection } from '@/components/collection/CollectionMetadataSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

/**
 * Collection Detail Page - Shows detailed information about a specific collection
 * 
 * This page uses the useGetCollection hook to fetch real data from AWS!
 * URL: /collection/[id] (e.g., /collection/3bc105fc-e394-462b-9e8c-bd1487654143)
 */
export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customKey = params.id as string;
  const [mounted, setMounted] = useState(false);

  // Only run on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // ════════════════════════════════════════════════════════════
  //          FETCH COLLECTION DATA USING CUSTOM HOOK
  // ════════════════════════════════════════════════════════════
  const {
    collection,
    title,
    description,
    thumbnail_path,
    creator,
    updatedAt,
    isError
  } = useGetCollection(customKey);

  // ════════════════════════════════════════════════════════════
  //                    LOADING STATE
  // ════════════════════════════════════════════════════════════
  // Wait for client-side mount and customKey
  if (!mounted || !customKey) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>⏳ Loading...</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //                    ERROR STATE
  // ════════════════════════════════════════════════════════════
  if (isError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>❌ Collection Not Found</h1>
        <p>The collection <code>{customKey}</code> could not be found.</p>
        <button 
          onClick={() => router.push('/collections')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#630031',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Browse All Collections
        </button>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //              DATA LOADING STATE
  // ════════════════════════════════════════════════════════════
  if (!collection) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⏳ Loading Collection Data...</h2>
        <p>Fetching: <code>{customKey}</code></p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //              SUCCESS STATE - DISPLAY DATA!
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: title || customKey, href: '#' }
        ]}
      />

      {/* Render the CollectionTopContent component */}
      <CollectionTopContent
        collectionImg={thumbnail_path}
        collectionTitle={title}
        creator={creator}
        updatedAt={updatedAt}
        description={description}
      />

      {/* Render the CollectionMetadataSection component */}
      <CollectionMetadataSection collection={collection} />

      {/* Render the CollectionItems component */}
      <CollectionItems collection={collection} />
    </div>
  );
}
