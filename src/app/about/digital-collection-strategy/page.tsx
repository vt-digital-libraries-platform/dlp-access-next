'use client'

/**
 * Digital Collection Strategy Page
 * 
 * Placeholder page to be filled with content about the digital collection strategy.
 */

import { useState } from 'react'
import Link from 'next/link'
import styles from '../page.module.scss'

export default function DigitalCollectionStrategyPage() {
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
  })

  if (!mounted) {
    return null
  }

  return (
    <div className={styles.aboutPage}>
      {/* Header Section */}
      <div className={styles.aboutHeader}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Digital Collection Strategy</span>
        </div>
        <h1>Digital Collection Strategy</h1>
      </div>

      <div className={styles.aboutContent}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <p>
              <em>Content for Digital Collection Strategy page will be added here.</em>
            </p>
            <p>
              This page will outline the strategic approach for building, managing, and sustaining 
              digital collections within the Virginia Tech Digital Libraries Platform.
            </p>
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
