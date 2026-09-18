'use client';

// CollectionItems.tsx - Display collection items in grid view with pagination

import Link from 'next/link';
import { useGetCollectionItems } from '@/hooks/useGetCollectionItems';

interface CollectionItemsProps {
  collection: any;
}

export const CollectionItems = ({ collection }: CollectionItemsProps) => {
  // Use custom hook to fetch and manage items
  const {
    items,
    total,
    totalPages,
    page,
    limit,
    handleResultsNumberDropdown,
    handlePrevPage,
    handleNextPage
  } = useGetCollectionItems(collection.id);

  // ════════════════════════════════════════════════════════════
  //                      LOADING STATE
  // ════════════════════════════════════════════════════════════
  if (items === null) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          fontSize: '1.2rem', 
          color: '#666' 
        }}>
          Loading collection items...
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //                      EMPTY STATE
  // ════════════════════════════════════════════════════════════
  if (total === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Items in Collection (0)
        </h2>
        <p style={{ color: '#666' }}>
          This collection does not contain any items yet.
        </p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //                      ITEMS DISPLAY
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Header with item count */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          color: '#e87722',
          margin: 0 
        }}>
          Items in Collection ({total})
        </h2>
        
        {/* Pagination info */}
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#666' 
        }}>
          Page {page + 1} of {totalPages} • Showing {items.length} items
        </div>
      </div>

      {/* Pagination controls - Top */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: page === 0 ? '#e9ecef' : '#e87722',
            color: page === 0 ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Previous
        </button>
        
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: page >= totalPages - 1 ? '#e9ecef' : '#e87722',
            color: page >= totalPages - 1 ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Next →
        </button>
        
        <div style={{ marginLeft: 'auto' }}>
          <label style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>
            Items per page:
          </label>
          <select
            value={limit}
            onChange={(e) => handleResultsNumberDropdown(null, { value: e.target.value })}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '0.9rem'
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Grid of items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {items.map((item) => {
          // Strip ark:/53696/ prefix from custom_key for URL
          const archiveKey = item.custom_key?.replace('ark:/53696/', '') || item.identifier;
          
          return (
            <Link 
              key={item.identifier}
              href={`/archive/${archiveKey}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Item thumbnail */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {item.thumbnail_path ? (
                    <img
                      src={item.thumbnail_path}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/static/collection-placeholder.jpg';
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '3rem', color: '#dee2e6' }}>📄</span>
                  )}
                </div>

                {/* Item details */}
                <div style={{
                  padding: '1rem',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#e87722',
                    marginBottom: '0.5rem',
                    lineHeight: '1.4'
                  }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#666',
                      lineHeight: '1.5',
                      marginBottom: '0.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.description}
                    </p>
                  )}

                  {item.date && (
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#999',
                      marginTop: 'auto'
                    }}>
                      {item.date}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination controls - Bottom */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button
          onClick={handlePrevPage}
          disabled={page === 0}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: page === 0 ? '#e9ecef' : '#e87722',
            color: page === 0 ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Previous
        </button>
        
        <span style={{ fontSize: '0.9rem', color: '#666' }}>
          Page {page + 1} of {totalPages}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: page >= totalPages - 1 ? '#e9ecef' : '#e87722',
            color: page >= totalPages - 1 ? '#999' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
