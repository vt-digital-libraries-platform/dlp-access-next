import Link from 'next/link'
import styles from '../page.module.css'

interface BrowseCardProps {
  icon: string
  title: string
  description: string
  href: string
  linkText: string
}

export default function BrowseCard({ icon, title, description, href, linkText }: BrowseCardProps) {
  return (
    <div className={styles.browseCard}>
      <div className={styles.iconCircle}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <Link href={href} className={styles.cardLink}>
        {linkText} →
      </Link>
    </div>
  )
}
