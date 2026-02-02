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
          <h1>Statement on Potentially Offensive and Harmful Content</h1>

          <div className={styles.content}>
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <>
            <p className={styles.fallback}>
              The University Libraries at Virginia Tech provides preservation and access to a wide range of materials spanning several centuries. The Digital Library Platform includes historical records, cultural heritage materials, and other research objects such as biospecimens. These materials are available in a variety of formats to promote and enrich the scholarship of researchers, students, and community members.
            </p>

            <h2>Why are historical content available on this site?</h2>
            <p className={styles.fallback}>
              University Libraries acknowledges that the recording of history has never been a neutral act. Historical records and cultural heritage materials often reflect the biases, prejudices, and dominant ideologies of their time. As a result, some materials contain harmful or inaccurate representations of marginalized groups.
            </p>
            <p className={styles.fallback}>
              We recognize that some content—including language, imagery, or context—may be harmful, offensive, inaccurate, or challenging to engage with. While University Libraries does not condone or support discrimination or derogatory language of any kind, items in the Digital Library Platform are presented in their original state. This aligns with cultural heritage best practices and preserves the integrity of historical records for future research.
            </p>

            <h2>How are historical content identified as harmful or contains offensive language?</h2>
            <p className={styles.fallback}>
              Within the site if a collection or at the item level items have been identified as follows when and if it contains harmful or offensive language:
            </p>
            <p className={styles.fallback}>
              The University Libraries at Virginia Tech recognizes that some issues of the [collection name] contain offensive content that does not reflect the University's <a href="https://www.inclusive.vt.edu/Programs/vtpoc0.html" target="_blank" rel="noopener noreferrer">"Principles of Community"</a>
            </p>
            <p className={styles.fallback}>
              The University Libraries present the following content in its original and unaltered form for the purpose of research, study, and personal reading. Providing online access to these historical records does not endorse any attitudes, prejudices, or behaviors depicted in the digital content. The University Libraries is committed to upholding the principle of equal and free access to unaltered historical information and supports the University's <a href="https://vtx.vt.edu/campus-news/statements/unirel-statement-040919.html" target="_blank" rel="noopener noreferrer">statement on offensive photographs</a>.
            </p>

            <h2>Contact Us</h2>
            <p className={styles.fallback}>
              If you have questions or concerns about a collection or policy listed above please feel free to contact us: <a href="mailto:digital-libraries@vt.edu">digital-libraries@vt.edu</a>
            </p>

            <p className={styles.notice}>
              <em>Note: This content will be loaded from the database once the page content is added to DynamoDB.</em>
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
