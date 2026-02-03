'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSite, getBrowseCollections, getPageContent } from '@/lib'
import styles from './page.module.scss'

// Client Component - Amplify works on client side only
export default function HomePage() {
  const [siteTitle, setSiteTitle] = useState('Virginia Tech University Digital Libraries Platform')
  const [recentCollections, setRecentCollections] = useState<any[]>([])
  const [mapsContent, setMapsContent] = useState<string>('')
  const [formatsContent, setFormatsContent] = useState<string>('')
  const [formatsContentWithLinks, setFormatsContentWithLinks] = useState<string>('')
  const [isFormatsExpanded, setIsFormatsExpanded] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Small delay to ensure Amplify is configured
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const site = await getSite()
        if (site?.title) {
          setSiteTitle(site.title)
        }
        
        // Fetch recent collections (first 3, sorted by date descending)
        const collections = await getBrowseCollections(
          { field: 'create_date', direction: 'desc' },
          3,
          null
        )
        
        if (collections?.items) {
          setRecentCollections(collections.items)
        }

        // Fetch Maps content
        const maps = await getPageContent('7857a765-0cf1-44fd-b24a-6cc354b8e142')
        if (maps?.content) {
          setMapsContent(maps.content)
        }

        // Fetch Formats content
        const formats = await getPageContent('3ea75641-e5cd-45ba-a459-0519512a9068')
        if (formats?.content) {
          setFormatsContent(formats.content)
          
          // Convert list items to clickable facet links
          if (typeof window !== 'undefined' && window.DOMParser) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(formats.content, 'text/html')
            const listItems = doc.querySelectorAll('ul li')
            
            listItems.forEach(li => {
              const text = li.textContent?.trim() || ''
              if (text) {
                const link = document.createElement('a')
                link.href = `https://digital.lib.vt.edu/search?q=&field=all&view=gallery&format=${encodeURIComponent(text)}`
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                link.title = `Search for format = ${text}`
                link.textContent = text
                link.style.color = '#e87722'
                link.style.textDecoration = 'none'
                link.style.fontWeight = '500'
                
                li.textContent = ''
                li.appendChild(link)
              }
            })
            
            setFormatsContentWithLinks(doc.body.innerHTML)
          } else {
            setFormatsContentWithLinks(formats.content)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])
  
  return (
    <div className={styles.homeWrapper}>
      {/* Title Section */}
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>{siteTitle}</h1>
        <p className={styles.introText}>
          Explore the extensive digital collections in the Virginia Tech University Digital Libraries Platform. 
          These collections range from 3D Insect Collection and Minerva stories to local collections such as 
          Salem Fire Department and Blacksburg Yearbooks. Explore and learn about the Virginia Tech Digital 
          Libraries Platform.
        </p>
      </div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>Search the Platform</h2>
        <div className={styles.searchBar}>
          <input 
            type="text"
            placeholder="Search by keyword, title, description"
            className={styles.searchInput}
          />
          <select className={styles.searchSelect}>
            <option>All</option>
          </select>
          <button className={styles.searchButton}>
            🔍
          </button>
        </div>
      </div>

      {/* Recent Collections */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Collections</h2>
          <Link href="/search" className={styles.viewAllLink}>
            View All Items
          </Link>
          <Link href="/collections" className={styles.viewAllLink}>
            View All Collections
          </Link>
        </div>
        
        <div className={styles.collectionsContainer}>
          <ul className={styles.collectionBubbles}>
            {recentCollections.map((collection) => (
              <li key={collection.id} className={styles.bubble}>
                <Link href={`/collection/${encodeURIComponent(collection.custom_key)}`} className={styles.bubbleLink}>
                  {collection.thumbnail_path ? (
                    <img 
                      src={collection.thumbnail_path} 
                      alt={collection.title}
                      className={styles.bubbleImage}
                    />
                  ) : (
                    <div className={styles.bubblePlaceholder}>
                      <span className={styles.bubbleText}>{collection.title?.substring(0, 2) || '??'}</span>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <Link href="/collections" className={styles.browseAllLink}>
            <span className={styles.browseAllText}>Browse all collections</span>
            <span className={styles.browseArrow}>→</span>
          </Link>
        </div>
      </div>

      {/* Other Ways to Browse */}
      <div className={styles.browseSection}>
        <h2 className={styles.sectionTitle}>Other Ways to Explore</h2>
        
        <div className={styles.exploreGrid}>
          {/* Maps */}
          <div className={styles.exploreCard}>
            <div className={styles.exploreHeader}>
              <div className={styles.iconCircle}>
                <span className={styles.icon}>🗺️</span>
              </div>
              <h3 className={styles.exploreTitle}>Maps</h3>
            </div>
            <div className={styles.exploreContent}>
              {mapsContent ? (
                <div dangerouslySetInnerHTML={{ __html: mapsContent }} />
              ) : (
                <p>Explore geographic data and spatial visualizations in our digital collections.</p>
              )}
            </div>
            <Link href="/maps" className={styles.exploreLink}>
              View Maps Collection →
            </Link>
          </div>

          {/* Formats */}
          <div className={styles.exploreCard}>
            <div className={styles.exploreHeader}>
              <div className={styles.iconCircle}>
                <span className={styles.icon}>📄</span>
              </div>
              <h3 className={styles.exploreTitle}>Formats</h3>
            </div>
            <div className={styles.exploreContent}>
              {formatsContentWithLinks ? (
                <>
                  <div 
                    className={`${styles.formatsCollapsible} ${isFormatsExpanded ? styles.expanded : ''}`}
                    dangerouslySetInnerHTML={{ __html: formatsContentWithLinks }} 
                  />
                  <button 
                    onClick={() => setIsFormatsExpanded(!isFormatsExpanded)}
                    className={styles.toggleButton}
                    aria-expanded={isFormatsExpanded}
                  >
                    {isFormatsExpanded ? '▲ Show Less' : '▼ Show All Formats'}
                  </button>
                </>
              ) : (
                <p>Browse digital collections by resource format and type.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          This site is running commit <a href="#" className={styles.footerLink}>291bac5</a> of the{' '}
          <a href="https://github.com/vt-digital-libraries-platform/vtdlp-access" className={styles.footerLink}>
            vtdlp-access
          </a>{' '}
          project
        </p>
      </footer>
    </div>
  )
}
