'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import { getPageContent } from '@/lib'

export default function HarmfulContentStatementPage() {
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
        // Harmful Content Statement page content
        const data = await getPageContent('3b35f9f9-82cb-4632-9489-efda0f30594b')
        if (data?.content) {
          setContent(data.content)
        }
      } catch (error) {
        console.error('Error loading harmful content statement:', error)
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
      <div className={styles.page}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Loading...</span>
        </div>
        <h1>Loading...</h1>
        <p>Loading content...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Harmful Content Statement</span>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
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
