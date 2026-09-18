import { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Search - Virginia Tech Digital Library',
  description: 'Search the Virginia Tech Digital Library',
}

export default function SearchPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Search</h1>
      <p className={styles.description}>
        Search page content coming soon...
      </p>
    </div>
  )
}
