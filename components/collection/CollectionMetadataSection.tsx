// CollectionMetadataSection.tsx - Display collection metadata in a table

interface CollectionMetadataSectionProps {
  collection: any;
}

export const CollectionMetadataSection = ({ collection }: CollectionMetadataSectionProps) => {
  if (!collection) {
    return null;
  }

  /**
   * Helper: Format array values as comma-separated string
   */
  const formatArrayValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(', ');
    }
    return value || 'N/A';
  };

  /**
   * Helper: Format date value
   */
  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';
    
    // If it's an array, join with comma
    if (Array.isArray(dateValue)) {
      return dateValue.filter(Boolean).join(', ');
    }
    
    // If it's a timestamp, format it
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
      try {
        return new Date(dateValue).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateValue;
      }
    }
    
    return dateValue;
  };

  /**
   * Metadata fields to display
   */
  const metadataFields = [
    {
      label: 'Size',
      value: collection.size || 'N/A',
      show: !!collection.size
    },
    {
      label: 'Identifier',
      value: collection.identifier || collection.custom_key || 'N/A',
      show: true
    },
    {
      label: 'Creator',
      value: formatArrayValue(collection.creator),
      show: !!collection.creator && collection.creator.length > 0
    },
    {
      label: 'Date Created',
      value: formatDate(collection.date || collection.createdAt),
      show: !!(collection.date || collection.createdAt)
    },
    {
      label: 'Last Modified',
      value: formatDate(collection.updatedAt),
      show: !!collection.updatedAt
    },
    {
      label: 'Subject',
      value: formatArrayValue(collection.subject),
      show: !!collection.subject && collection.subject.length > 0
    },
    {
      label: 'Language',
      value: formatArrayValue(collection.language),
      show: !!collection.language && collection.language.length > 0
    },
    {
      label: 'Rights',
      value: formatArrayValue(collection.rights),
      show: !!collection.rights
    },
    {
      label: 'Rights Holder',
      value: formatArrayValue(collection.rights_holder),
      show: !!collection.rights_holder
    },
    {
      label: 'Bibliographic Citation',
      value: formatArrayValue(collection.bibliographic_citation),
      show: !!collection.bibliographic_citation
    },
    {
      label: 'Related URL',
      value: collection.relation,
      show: !!collection.relation,
      isLink: true
    },
    {
      label: 'Tags',
      value: formatArrayValue(collection.tags),
      show: !!collection.tags && collection.tags.length > 0
    }
  ];

  // Filter to only show fields that have values
  const visibleFields = metadataFields.filter(field => field.show);

  // If no metadata to show, return null
  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      padding: '2rem 0',
      borderTop: '2px solid #e9ecef',
      marginTop: '2rem'
    }}>
      <h2 style={{ 
        fontSize: '1.8rem', 
        color: '#e87722',
        marginBottom: '1.5rem'
      }}>
        Collection Details
      </h2>

      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <tbody>
            {visibleFields.map((field, index) => (
              <tr 
                key={field.label}
                style={{ 
                  borderBottom: index < visibleFields.length - 1 ? '1px solid #dee2e6' : 'none'
                }}
              >
                <td style={{ 
                  padding: '1rem 1rem 1rem 0',
                  fontWeight: '600',
                  color: '#495057',
                  verticalAlign: 'top',
                  width: '200px'
                }}>
                  {field.label}:
                </td>
                <td style={{ 
                  padding: '1rem 0',
                  color: '#212529',
                  lineHeight: '1.6'
                }}>
                  {field.isLink && field.value !== 'N/A' ? (
                    <a 
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        color: '#e87722',
                        textDecoration: 'none',
                        borderBottom: '1px solid #e87722'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderBottom = '2px solid #e87722';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderBottom = '1px solid #e87722';
                      }}
                    >
                      {field.value}
                    </a>
                  ) : (
                    field.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permanent Link Section */}
      {collection.custom_key && (
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <div style={{ 
            fontSize: '0.9rem',
            color: '#856404',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            📌 Permanent Link
          </div>
          <div style={{ 
            fontSize: '0.85rem',
            color: '#856404',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: '0.5rem',
            borderRadius: '4px'
          }}>
            {typeof window !== 'undefined' 
              ? `${window.location.origin}/collection/${collection.custom_key}`
              : `/collection/${collection.custom_key}`
            }
          </div>
        </div>
      )}
    </div>
  );
};
