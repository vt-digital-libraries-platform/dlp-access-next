'use client'

/**
 * Digital Collection Strategy Page
 * Fetches content from AWS DynamoDB
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPageContent } from '@/lib'
import styles from '../page.module.scss'

export default function DigitalCollectionStrategyPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function fetchData() {
      try {
        setLoading(true)
        // Digital Collection Strategy page content
        const data = await getPageContent('c59ab8c6-b0e4-4e86-91e8-96b9bd417448')
        if (data?.content) {
          setContent(data.content)
        }
      } catch (error) {
        console.error('Error loading digital collection strategy content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className={styles.aboutPage}>
        <div className={styles.aboutHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Loading...</span>
          </div>
          <h1>Loading...</h1>
        </div>
        <div className={styles.aboutContent}>
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.aboutPage}>
      {/* Header Section */}
      <div className={styles.aboutHeader}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Digital Collection Strategy</span>
        </div>
      </div>

      <div className={styles.aboutContent}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </section>
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
              <li><Link href="/maps">Maps</Link></li>
              <li><Link href="/collections">Browse Collections</Link></li>
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
