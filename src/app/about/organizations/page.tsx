'use client'

import Link from 'next/link'
import styles from './page.module.scss'

export default function OrganizationsPage() {
  return (
    <div className={styles.organizationsPage}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Organizations</span>
      </div>

      <h1 className={styles.title}>About Organizations</h1>
      
      <section className={styles.section}>
        <p className={styles.intro}>
          Learn about the organizations and institutions that contribute to and partner with
          the Virginia Tech Digital Library Program.
        </p>
        
        <div className={styles.card}>
          <h2>🏛️ Contributing Organizations</h2>
          <p>
            The VTDLP collaborates with libraries, archives, museums, and cultural heritage
            institutions to preserve and provide access to digital collections.
          </p>
          <p>
            <strong>Virginia Tech University Libraries</strong> serves as the primary steward of 
            the platform, working to digitize, preserve, and provide access to materials that 
            document the history and ongoing activities of Virginia Tech and the broader community.
          </p>
        </div>
        
        <div className={styles.card}>
          <h2>🤝 Partnership Opportunities</h2>
          <p>
            Organizations interested in partnering with the Virginia Tech Digital Library Program
            can learn more about collaboration opportunities and contribution guidelines.
          </p>
          <ul>
            <li><strong>Digital collection hosting</strong> - Host your digital collections on a robust, cloud-native platform</li>
            <li><strong>Metadata consulting</strong> - Expert guidance on metadata standards and best practices</li>
            <li><strong>Preservation services</strong> - Long-term digital preservation using AWS infrastructure</li>
            <li><strong>Technical support</strong> - Access to expertise in digital library technologies</li>
          </ul>
        </div>

        <div className={styles.contactCard}>
          <h2>📧 Get Involved</h2>
          <p>
            If your organization is interested in partnering with VTDLP or learning more about 
            our services, please contact the Digital Libraries Team.
          </p>
          <a 
            href="mailto:digitallibraries@vt.edu" 
            className={styles.contactButton}
          >
            Contact Us About Partnerships
          </a>
        </div>
      </section>
    </div>
  )
}
