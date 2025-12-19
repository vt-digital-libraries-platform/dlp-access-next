'use client'
/**
 * About Page - Fetches content from AWS DynamoDB
 *
 * This page fetches:
 * - Site title from getSite()
 * - About page content (Virginia Tech Digital Libraries)
 * - Team page content (VTDLP Core Team)
 *
 * Displays placeholder content while loading and if AWS data is not available.
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSite, getPageContent } from '@/lib'
import styles from './page.module.scss'
export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const [siteTitle, setSiteTitle] = useState('Virginia Tech Digital Library')
  const [aboutContent, setAboutContent] = useState<string>('')
  const [teamContent, setTeamContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setMounted(true)
    const fetchData = async () => {
      try {
        // Small delay to ensure Amplify is configured
        await new Promise(resolve => setTimeout(resolve, 100))
        // Fetch site title
        const site = await getSite()
        if (site?.title) {
          setSiteTitle(site.title)
        }
        // Fetch about page content - Virginia Tech Digital Libraries
        const about = await getPageContent('ff19bffe-f848-4b99-afe0-d9794f4a4049')
        if (about?.content) {
          setAboutContent(about.content)
        }
        // Fetch team page content - VTDLP Core Team
        const team = await getPageContent('f20e72a7-601c-4daf-b70f-1afc7b39bba5')
        if (team?.content) {
          setTeamContent(team.content)
        }
      } catch (error) {
        console.error('Error fetching about page data:', error)
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
      <div className={styles.aboutPage}>
        <div className={styles.aboutHeader}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Home</Link> / <span>About</span>
          </div>
          <h1>Loading...</h1>
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.mainContent}>
            <p>Loading content...</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.aboutPage}>
      {/* Header Section */}
      <div className={styles.aboutHeader}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link> / <span>About</span>
        </div>
        <h1>About {siteTitle}</h1>
      </div>
      <div className={styles.aboutContent}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* About Content from AWS */}
          <section className={styles.section}>
            {aboutContent ? (
              <>
                {/* Partners and Affiliates Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2>Virginia Tech Digital Library Partners and Affiliates (new content)</h2>
                  <p>
                    The Digital Library team collaborates with a range of partners and affiliates,
                    both within and beyond the Commonwealth of Virginia, on numerous collections.
                    These collections vary in size from a small number of digital objects to thousands
                    of digital objects. Below are a few examples of our Virginia Tech–based partners
                    and affiliates:
                  </p>
                  <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                    <li>
                      <a
                        href="https://vtechworks.lib.vt.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--hokieOrange)', textDecoration: 'underline' }}
                      >
                        VTechWorks
                      </a> - Virginia Tech's Institutional Repository
                    </li>
                    <li>
                      <a
                        href="https://iawa.lib.vt.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--hokieOrange)', textDecoration: 'underline' }}
                      >
                        IAWA
                      </a> - International Archive of Women in Architecture
                    </li>
                    <li>
                      <a
                        href="https://www.montgomerymuseum.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--hokieOrange)', textDecoration: 'underline' }}
                      >
                        Montgomery Museum of Art &amp; History
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Split content to insert Digital Collection Strategy link before Organizations section */}
                <div dangerouslySetInnerHTML={{
                  __html: (aboutContent.split('<h2>Organizations').length > 1
                    ? aboutContent.split('<h2>Organizations')[0]
                    : aboutContent
                  ).replace(/<h2>Virginia Tech Digital Libraries<\/h2>/, '<h2>Virginia Tech Digital Libraries (old content)</h2>')
                }} />
                {/* Digital Collection Strategy Link - Inserted after VT Digital Libraries, before Organizations */}
                <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#F5F5F5', borderLeft: '4px solid var(--hokieOrange)' }}>
                  <p style={{ margin: 0 }}>
                    <strong>Learn More:</strong> To understand our approach to building and managing digital collections,
                    please see our <Link href="/about/digital-collection-strategy" style={{ color: 'var(--hokieOrange)', textDecoration: 'underline', fontWeight: 'bold' }}>Digital Collection Strategy</Link>.
                  </p>
                </div>

                {/* Organizations section (if it exists) */}
                {aboutContent.split('<h2>Organizations').length > 1 && (
                  <div dangerouslySetInnerHTML={{
                    __html: '<h2>Organizations' + aboutContent.split('<h2>Organizations')[1]
                  }} />
                )}
              </>
            ) : (
              <>
                <h2>About</h2>
                <p>
                  <em>No about content available. Content should be loaded from AWS DynamoDB.</em>
                </p>
              </>
            )}
          </section>
          {/* Team Section */}
          <section id="team" className={styles.section}>
            {teamContent ? (
              <div dangerouslySetInnerHTML={{ __html: teamContent }} />
            ) : (
              <>
                <h2>Team</h2>
                <p>
                  <em>No team content available. Content should be loaded from AWS DynamoDB via getPageContent('team').</em>
                </p>
              </>
            )}
          </section>
        </div>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Quick Links */}
          <div className={styles.quickLinks}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/about#team">Team</Link></li>
              <li><Link href="/about/digital-collection-strategy">Digital Collection Strategy</Link></li>
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
