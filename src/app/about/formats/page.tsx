'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPageContent } from '@/lib'
import styles from './page.module.scss'

// Component to render facet links
interface FacetLinksProps {
  name: string
  values: string[]
}

function FacetLinks({ name, values }: FacetLinksProps) {
  return (
    <ul className={styles.facetList}>
      {values.map((value, index) => {
        const searchUrl = `https://digital.lib.vt.edu/search?q=&field=all&view=gallery&${name}=${encodeURIComponent(value)}`
        return (
          <li key={index} className={styles.facetItem}>
            <a 
              href={searchUrl} 
              title={`Search for ${name} = ${value}`}
              className={styles.facetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {value}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default function FormatsPage() {
  const [formatsContent, setFormatsContent] = useState<string>('')
  const [formatValues, setFormatValues] = useState<string[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Small delay to ensure Amplify is configured
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Fetch Formats content from DynamoDB
        const formats = await getPageContent('3ea75641-e5cd-45ba-a459-0519512a9068')
        console.log('Formats data:', formats)
        
        if (formats?.content) {
          setFormatsContent(formats.content)
          
          // Extract format values from the HTML content
          // Check if we're in the browser
          if (typeof window !== 'undefined' && window.DOMParser) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(formats.content, 'text/html')
            const listItems = doc.querySelectorAll('ul li')
            const values = Array.from(listItems).map(li => li.textContent?.trim() || '')
            console.log('Extracted format values:', values)
            setFormatValues(values.filter(v => v.length > 0))
          }
        }
      } catch (error) {
        console.error('Failed to fetch formats data:', error)
      }
    }
    
    fetchData()
  }, [])
  
  return (
    <div className={styles.formatsPage}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Formats</span>
      </div>

      <h1 className={styles.title}>Formats</h1>
      
      <section className={styles.section}>
        <p className={styles.intro}>
          Browse digital collections by resource format and type. Click any format to search for items in that format.
        </p>
        
        {formatsContent ? (
          <div className={styles.formatsContent}>
            <div className={styles.contentDisplay}>
              <div dangerouslySetInnerHTML={{ __html: formatsContent }} />
            </div>
            
            {formatValues.length > 0 && (
              <div className={styles.facetLinksSection}>
                <h2 className={styles.facetTitle}>Search by Format</h2>
                <p className={styles.facetDescription}>
                  Click any format below to search the digital library for items in that format:
                </p>
                <FacetLinks name="format" values={formatValues} />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.loading}>
            <p>Loading formats...</p>
          </div>
        )}
      </section>
    </div>
  )
}
