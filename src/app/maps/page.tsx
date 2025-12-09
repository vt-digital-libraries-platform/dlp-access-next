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
        
        // Fetch maps page content
        const maps = await getPageContent('maps')
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
  )
}
