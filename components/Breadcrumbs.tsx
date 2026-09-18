import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      style={{ 
        padding: '1rem 0',
        fontSize: '0.9rem'
      }}
    >
      <ol style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {items.map((item, index) => (
          <li 
            key={item.href} 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {index < items.length - 1 ? (
              <>
                <Link 
                  href={item.href}
                  style={{
                    color: '#e87722',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {item.label}
                </Link>
                <span style={{ color: '#999' }}>/</span>
              </>
            ) : (
              <span style={{ 
                color: '#333',
                fontWeight: '600'
              }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
