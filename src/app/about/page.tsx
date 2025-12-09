'use client'

/**
 * About Page - Fetches content from AWS DynamoDB
 * 
 * This page fetches:
 * - Site title from getSite()
 * - About page content from getPageContent('about')
 * - Team page content from getPageContent('team')
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
  const [organizationsContent, setOrganizationsContent] = useState<string>('')
  const [strategyContent, setStrategyContent] = useState<string>('')
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
        
        // Fetch about page content
        const about = await getPageContent('about')
        if (about?.content) {
          setAboutContent(about.content)
        }
        
        // Fetch team page content
        const team = await getPageContent('team')
        if (team?.content) {
          setTeamContent(team.content)
        }
        
        // Fetch organizations page content
        const organizations = await getPageContent('organizations')
        if (organizations?.content) {
          setOrganizationsContent(organizations.content)
        }
        
        // Fetch digital collection strategy content
        const strategy = await getPageContent('digital-collection-strategy')
        if (strategy?.content) {
          setStrategyContent(strategy.content)
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
              <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
            ) : (
              <>
                <h2>About</h2>
                <p>
                  <em>No about content available. Content should be loaded from AWS DynamoDB via getPageContent('about').</em>
                </p>
              </>
            )}
          </section>

          {/* Organizations Section */}
          <section id="organizations" className={styles.section}>
            {organizationsContent ? (
              <div dangerouslySetInnerHTML={{ __html: organizationsContent }} />
            ) : (
              <>
                <h2>Organizations</h2>
                <p>
                  <em>No organizations content available. Content should be loaded from AWS DynamoDB via getPageContent('organizations').</em>
                </p>
              </>
            )}
          </section>

          {/* Digital Collection Strategy Section */}
          <section id="digital-collection-strategy" className={styles.section}>
            {strategyContent ? (
              <div dangerouslySetInnerHTML={{ __html: strategyContent }} />
            ) : (
              <>
                <h2>Digital Collection Strategy</h2>
                <p>
                  <em>No digital collection strategy content available. Content should be loaded from AWS DynamoDB via getPageContent('digital-collection-strategy').</em>
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
              <li><Link href="/about/formats">Formats</Link></li>
              <li><Link href="/about/organizations">Organizations</Link></li>
              <li><Link href="/about/team">Team</Link></li>
              <li><Link href="/collections">Browse Collections</Link></li>
              <li><Link href="/search">Search Archives</Link></li>
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
