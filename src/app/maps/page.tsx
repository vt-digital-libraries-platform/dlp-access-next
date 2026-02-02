'use client'

/**
 * Maps Page - Fetches content from AWS DynamoDB
 * 
 * This page fetches:
 * - Maps data from getPageContent('maps')
 * 
 * Displays placeholder content while loading and if AWS data is not available.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPageContent } from '@/lib'
import styles from './page.module.scss'

export default function MapsPage() {
  const [mounted, setMounted] = useState(false)
  const [mapsContent, setMapsContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    const fetchData = async () => {
      try {
        // Small delay to ensure Amplify is configured
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Fetch maps page content - Navigating Digital Collections through Mapping
        const maps = await getPageContent('7857a765-0cf1-44fd-b24a-6cc354b8e142')
        if (maps?.content) {
          setMapsContent(maps.content)
        }
      } catch (error) {
        console.error('Error fetching maps page data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className={styles.mapsPage}>
        <div className={styles.pageHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> / <span>Maps</span>
          </div>
          <h1>Loading...</h1>
        </div>
        <div className={styles.pageContent}>
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapsPage}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <span>Maps</span>
        </div>
        <h1>Maps</h1>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.pageContent}>
            {mapsContent ? (
              <div dangerouslySetInnerHTML={{ __html: mapsContent }} />
            ) : (
              <>
                <p>
                  <em>No maps content available. Content should be loaded from AWS DynamoDB via getPageContent('maps').</em>
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Quick Links */}
          <div className={styles.quickLinks}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/about/team">DLP Team</Link></li>
              <li><Link href="/about/digital-collection-strategy">Digital Collection Strategy</Link></li>
              <li><Link href="/about/harmful-content-statement">Harmful Content Statement</Link></li>
              <li><Link href="/collections">Browse Collections</Link></li>
              <li><Link href="/maps">Maps</Link></li>
            </ul>
          </div>
          {/* Organization Info */}
          <div className={styles.organizationInfo}>
            <h3>Organization</h3>
            <p className={styles.orgName}>Virginia Tech University Libraries</p>
            <p className={styles.orgDescription}>
              Part of Virginia Tech's mission to provide access to knowledge and
              support research and learning.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
