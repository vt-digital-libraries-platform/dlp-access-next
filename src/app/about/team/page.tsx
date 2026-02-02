'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'
import { getPageContent } from '@/lib'

export default function TeamPage() {
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
        // Fetch team page content - VTDLP Core Team
        const team = await getPageContent('f20e72a7-601c-4daf-b70f-1afc7b39bba5')
        if (team?.content) {
          setContent(team.content)
        }
      } catch (error) {
        console.error('Error loading team content:', error)
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
      <div className={styles.teamPage}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Loading...</span>
        </div>
        <h1 className={styles.title}>Loading...</h1>
        <p>Loading content...</p>
      </div>
    )
  }

  return (
    <div className={styles.teamPage}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>DLP Team</span>
      </div>
      
      <div className={styles.pageContent}>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <section className={styles.section}>
                <h1 className={styles.title}>VTDLP Core Team</h1>
                <p className={styles.intro}>
                  Meet the team behind the Virginia Tech Digital Library Program.
                </p>
                
                <div className={styles.infoCard}>
                  <h2>👥 Digital Libraries Team</h2>
                  <p>
                    The VTDLP team includes librarians, archivists, developers, and digital preservation
                    specialists dedicated to providing access to Virginia Tech's digital collections.
                  </p>
                  <p>
                    For more information about our team members and their roles, please visit:{' '}
                    <a 
                      href="https://about.digital.lib.vt.edu/team/"
                    >
                      VTDLP Team Page
                    </a>
                  </p>
                </div>

                <p className={styles.notice}>
                  <em>Note: Team content will be loaded from the database once added to DynamoDB.</em>
                </p>
              </section>
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
