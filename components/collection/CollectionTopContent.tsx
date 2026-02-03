// CollectionTopContent.tsx - Collection header with image and metadata

interface CollectionTopContentProps {
  collectionImg?: string;
  collectionTitle: string;
  creator?: string[] | null;
  updatedAt?: string;
  description?: string[] | null;
}

export const CollectionTopContent = ({
  collectionImg,
  collectionTitle,
  creator,
  updatedAt,
  description
}: CollectionTopContentProps) => {
  return (
    <div 
      className="top-content-row row"
      role="region"
      aria-labelledby="collection-page-title"
      style={{ padding: '2rem 0', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}
    >
      {/* Collection Thumbnail */}
      {collectionImg && (
        <div className="collection-img-col" style={{ flex: '0 0 300px' }}>
          <img 
            src={collectionImg} 
            alt={collectionTitle}
            style={{ 
              width: '100%', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      
      {/* Collection Details */}
      <div className="collection-details-col" style={{ flex: '1', minWidth: '300px' }}>
        <h1 
          className="collection-title" 
          id="collection-page-title"
          style={{ 
            fontSize: '2.5rem', 
            color: '#e87722', 
            marginBottom: '1rem' 
          }}
        >
          {collectionTitle}
        </h1>
        
        {/* Metadata */}
        <div className="post-heading" style={{ 
          marginBottom: '1.5rem', 
          color: '#6c757d',
          fontSize: '0.9rem'
        }}>
          {creator && creator.length > 0 && (
            <div className="creator" style={{ marginBottom: '0.5rem' }}>
              <strong>Created by:</strong> {creator.join(", ")}
            </div>
          )}
          {updatedAt && (
            <div className="last-updated">
              <strong>Last updated:</strong> {new Date(updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
        
        {/* Description */}
        {description && description.length > 0 && (
          <div 
            className="description"
            id="collection-description"
            style={{ 
              lineHeight: '1.6',
              color: '#333'
            }}
          >
            {description.map((para, idx) => (
              <p key={idx} style={{ marginBottom: '1rem' }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
