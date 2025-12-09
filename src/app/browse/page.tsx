import { Metadata } from 'next'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Browse - Virginia Tech Digital Library',
  description: 'Browse the Virginia Tech Digital Library collections',
}

export default function BrowsePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Browse</h1>
      <p className={styles.description}>
        Browse page content coming soon...
      </p>
    </div>
  )
}
