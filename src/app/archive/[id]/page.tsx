'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import * as queries from '@/graphql/queries';

const client = generateClient();

/**
 * Archive Item Detail Page
 * Shows individual item (document, image, etc.) details
 * URL: /archive/[id] (e.g., /archive/catalog-1927)
 */
export default function ArchiveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customKey = params.id as string;
  
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !customKey) return;

    const fetchItem = async () => {
      setLoading(true);
      
      try {
        // Search for archive by custom_key
        const options = {
          limit: 1,
          filter: {
            visibility: { eq: true },
            custom_key: { eq: `ark:/53696/${customKey}` }
          }
        };

        const response: any = await client.graphql({
          query: queries.searchArchives,
          variables: options
        });

        const items = response.data.searchArchives.items;
        if (items && items.length > 0) {
          setItem(items[0]);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching archive item:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [mounted, customKey]);

  // Loading State
  if (!mounted || loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>⏳ Loading Item...</h2>
        <p>Fetching: <code>{customKey}</code></p>
      </div>
    );
  }

  // Error State
  if (error || !item) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>❌ Item Not Found</h1>
        <p>The item <code>{customKey}</code> could not be found.</p>
        <button 
          onClick={() => router.back()}
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
          ← Go Back
        </button>
      </div>
    );
  }

  // Success State
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <nav style={{ 
        padding: '1rem 0',
        fontSize: '0.9rem',
        marginBottom: '2rem'
      }}>
        <Link href="/" style={{ color: '#e87722', textDecoration: 'none' }}>
          Home
        </Link>
        <span style={{ margin: '0 0.5rem', color: '#999' }}>/</span>
        <Link href="/collections" style={{ color: '#e87722', textDecoration: 'none' }}>
          Collections
        </Link>
        <span style={{ margin: '0 0.5rem', color: '#999' }}>/</span>
        <span style={{ color: '#333', fontWeight: '600' }}>
          {item.title}
        </span>
      </nav>

      {/* Item Header */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Thumbnail */}
        <div style={{
          width: '100%',
          minHeight: '400px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {item.thumbnail_path ? (
            <img 
              src={item.thumbnail_path}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <span style={{ fontSize: '4rem', color: '#ccc' }}>📄</span>
          )}
        </div>

        {/* Item Info */}
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            color: '#e87722', 
            marginBottom: '1rem' 
          }}>
            {item.title}
          </h1>

          {item.description && (
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              color: '#333',
              marginBottom: '1.5rem'
            }}>
              {Array.isArray(item.description) 
                ? item.description.join(' ') 
                : item.description}
            </p>
          )}

          {/* Metadata */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '8px' 
          }}>
            {item.creator && item.creator.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Creator:</strong>{' '}
                {Array.isArray(item.creator) ? item.creator.join(', ') : item.creator}
              </div>
            )}
            
            {item.start_date && (
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Date:</strong> {item.start_date}
              </div>
            )}
            
            {item.identifier && (
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Identifier:</strong> {item.identifier}
              </div>
            )}
            
            {item.custom_key && (
              <div style={{ marginBottom: '0.75rem' }}>
                <strong>Custom Key:</strong>{' '}
                <code style={{ 
                  backgroundColor: '#fff', 
                  padding: '2px 6px', 
                  borderRadius: '3px' 
                }}>
                  {item.custom_key}
                </code>
              </div>
            )}

            {item.tags && item.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>{' '}
                {item.tags.map((tag: string, idx: number) => (
                  <span 
                    key={idx}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#e87722',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      marginRight: '0.5rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Metadata Section */}
      {(item.rights || item.bibliographic_citation || item.subject) && (
        <div style={{ 
          borderTop: '2px solid #e9ecef', 
          paddingTop: '2rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            color: '#630031', 
            marginBottom: '1rem' 
          }}>
            Additional Information
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {item.subject && item.subject.length > 0 && (
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ 
                    padding: '1rem 1rem 1rem 0', 
                    fontWeight: '600', 
                    verticalAlign: 'top',
                    width: '200px'
                  }}>
                    Subject:
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {Array.isArray(item.subject) ? item.subject.join(', ') : item.subject}
                  </td>
                </tr>
              )}
              
              {item.rights && (
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ 
                    padding: '1rem 1rem 1rem 0', 
                    fontWeight: '600', 
                    verticalAlign: 'top' 
                  }}>
                    Rights:
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {(() => {
                      const rightsValue = Array.isArray(item.rights) ? item.rights[0] : item.rights;
                      const rightsStr = typeof rightsValue === 'string' ? rightsValue : String(rightsValue || '');
                      
                      return rightsStr.startsWith('http') ? (
                        <a 
                          href={rightsStr} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#e87722' }}
                        >
                          {rightsStr}
                        </a>
                      ) : (
                        rightsStr
                      );
                    })()}
                  </td>
                </tr>
              )}
              
              {item.bibliographic_citation && (
                <tr>
                  <td style={{ 
                    padding: '1rem 1rem 1rem 0', 
                    fontWeight: '600', 
                    verticalAlign: 'top' 
                  }}>
                    Citation:
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {Array.isArray(item.bibliographic_citation) 
                      ? item.bibliographic_citation.join('; ') 
                      : item.bibliographic_citation}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Back Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={() => router.back()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e87722',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Back to Collection
        </button>
      </div>
    </div>
  );
}
