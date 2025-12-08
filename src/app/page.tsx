import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
// import { getSite } from '@/lib/fetchTools'  // Uncomment when lib is ready

export const metadata: Metadata = {
  title: 'Virginia Tech Digital Library - Home',
  description: "Explore Virginia Tech's Digital Library collections and archives",
}

// This is a Server Component - data fetching happens on the server
export default async function HomePage() {
  // TODO: Uncomment when API is ready
  // const site = await getSite()
  // const siteTitle = site?.siteTitle || "Virginia Tech Digital Library"
  
  const siteTitle = "Virginia Tech Digital Library"  // Temporary hardcoded value
  
  return (
    <>
      {/* Hero Banner with Background Image */}
      <div className="hero-banner">
        <Image 
          src="/images/hero-bg.jpg" 
          alt="Virginia Tech Campus"
          fill
          priority
          className="hero-image"
          style={{
            objectFit: 'cover',
            filter: 'brightness(40%) contrast(85%)',
          }}
        />
        <div className="hero-content">
          <h1 className="hero-title">
            Virginia Tech Digital Libraries
          </h1>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="search-container">
        <div className="search-wrapper">
          <input 
            type="text"
            placeholder="Search by keyword, title, description"
            className="search-input"
          />
          <select className="search-select">
            <option>All</option>
          </select>
          <button className="search-button">
            Search
          </button>
        </div>
      </div>

      {/* Browse Collections Section */}
      <div className="browse-section">
        <div className="container">
          <h2 className="section-title">Browse Our Collections</h2>
          <p className="section-description">
            Explore our digital archives, special collections, and institutional repositories
          </p>
          
          <div className="browse-grid">
            {/* Collections Card */}
            <div className="browse-card">
              <div className="icon-circle">
                <span className="icon">📚</span>
              </div>
              <h3 className="card-title">Collections</h3>
              <p className="card-description">
                Browse through our curated digital collections and archives
              </p>
              <Link href="/collections" className="card-link">
                View Collections →
              </Link>
            </div>

            {/* Maps Card */}
            <div className="browse-card">
              <div className="icon-circle">
                <span className="icon">🗺️</span>
              </div>
              <h3 className="card-title">Maps</h3>
              <p className="card-description">
                Explore historical and contemporary maps from our collection
              </p>
              <Link href="/browse/maps" className="card-link">
                Browse Maps →
              </Link>
            </div>

            {/* Formats Card */}
            <div className="browse-card">
              <div className="icon-circle">
                <span className="icon">📁</span>
              </div>
              <h3 className="card-title">Formats</h3>
              <p className="card-description">
                Search library of formats that can be found in our digital repository
              </p>
              <Link href="/about/formats" className="card-link">
                View Formats →
              </Link>
            </div>

            {/* Organizations Card */}
            <div className="browse-card">
              <div className="icon-circle">
                <span className="icon">🏛️</span>
              </div>
              <h3 className="card-title">Organizations</h3>
              <p className="card-description">
                View searchable from archives, institutions and others
              </p>
              <Link href="/about/organizations" className="card-link">
                View Organizations →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
