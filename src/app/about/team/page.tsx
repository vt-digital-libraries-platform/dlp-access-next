'use client'

import Link from 'next/link'
import styles from './page.module.scss'

export default function TeamPage() {
  return (
    <div className={styles.teamPage}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Team</span>
      </div>

      <h1 className={styles.title}>About Our Team</h1>
      
      <section className={styles.section}>
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
              target="_blank"
              rel="noopener noreferrer"
            >
              VTDLP Team Page
            </a>
          </p>
        </div>
        
        <div className={styles.teamGrid}>
          <div className={styles.teamCard}>
            <div className={styles.avatar}>
              👤
            </div>
            <h3>Team Member</h3>
            <p className={styles.position}>Position Title</p>
            <p>Brief description of role and responsibilities.</p>
          </div>
          
          <div className={styles.teamCard}>
            <div className={styles.avatar}>
              👤
            </div>
            <h3>Team Member</h3>
            <p className={styles.position}>Position Title</p>
            <p>Brief description of role and responsibilities.</p>
          </div>
          
          <div className={styles.teamCard}>
            <div className={styles.avatar}>
              👤
            </div>
            <h3>Team Member</h3>
            <p className={styles.position}>Position Title</p>
            <p>Brief description of role and responsibilities.</p>
          </div>
        </div>
      </section>

      <section className={styles.note}>
        <p>
          📝 <strong>Note:</strong> This is a placeholder page. Actual team member information needs to be added.
        </p>
      </section>
    </div>
  )
}
