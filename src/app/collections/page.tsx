'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBrowseCollections } from '@/hooks/useBrowseCollections'
import styles from './page.module.scss'

export default function CollectionsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const {
    collections,
    total,
    sortOpt,
    totalPages,
    page,
    limit,
    handleResultsNumberDropdown,
    handleSortOrderDropdown,
    handlePrevPage,
    handleNextPage
  } = useBrowseCollections()

  // Loading state
  if (!mounted || collections === null) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading collections...</p>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      {/* Page Header */}
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Browse Collections</h1>
        <p className={styles.totalText}>
          Showing {collections.length} of {total} collections
        </p>
      </div>

      {/* Controls: Items per page and Sort */}
      <div className={styles.controlsContainer}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Items per page:</label>
          <select
            value={limit}
            onChange={(e) => handleResultsNumberDropdown(null, { value: e.target.value })}
            className={styles.dropdown}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Sort by:</label>
          <select
            value={`${sortOpt.field}-${sortOpt.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-')
              handleSortOrderDropdown(field, direction)
            }}
            className={styles.dropdown}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="start_date-desc">Date (Newest)</option>
            <option value="start_date-asc">Date (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Pagination Controls - Top */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className={styles.noResults}>
          <p>No collections found.</p>
        </div>
      ) : (
        <div className={styles.collectionsGrid}>
          {collections.map((collection: any) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Pagination Controls - Bottom */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer} style={{ marginTop: '30px' }}>
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}

      {/* Footer Note */}
      <div className={styles.footerNote}>
        <p className={styles.footerText}>
          Browse all available collections in the Virginia Tech Digital Library
        </p>
      </div>
    </div>
  )
}

/**
 * CollectionCard Component - Individual collection card in grid
 */
function CollectionCard({ collection }: { collection: any }) {
  const thumbnailUrl = collection.thumbnail_path || '/images/static/collection-placeholder.jpg'
  const title = collection.title || 'Untitled Collection'
  const description = collection.description || ''
  
  // Strip ark:/53696/ prefix from custom_key for URL
  const customKey = collection.custom_key?.replace('ark:/53696/', '') || collection.id

  // Truncate description to ~150 characters
  const truncatedDescription = description.length > 150 
    ? description.substring(0, 150) + '...'
    : description

  return (
    <Link href={`/collection/${customKey}`} className={styles.cardLink}>
      <div className={styles.card}>
        {/* Thumbnail */}
        <div className={styles.thumbnailContainer}>
          <img
            src={thumbnailUrl}
            alt={title}
            className={styles.thumbnail}
            onError={(e: any) => {
              e.target.src = '/images/static/collection-placeholder.jpg'
            }}
          />
        </div>

        {/* Content */}
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {truncatedDescription && (
            <p className={styles.cardDescription}>{truncatedDescription}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
