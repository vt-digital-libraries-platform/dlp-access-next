import Link from 'next/link'
import styles from './Header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <Link href="https://lib.vt.edu/" className={styles.logoLink}>
          <img
            alt=""
            className={styles.vtLogo}
            src="https://www.assets.cms.vt.edu/images/maroonVTonWhite.svg"
            aria-hidden="true"
          />
          <span className={styles.logoDivider} aria-hidden="true"></span>
          <span className={styles.libraryText}>University Libraries</span>
        </Link>
      </div>
      
      <div className={styles.breadcrumb}>
        <Link href="https://lib.vt.edu" className={styles.breadcrumbLink}>
          University Libraries
        </Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>Virginia Tech Digital Library</span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>HOME</Link>
        <Link href="/collections" className={styles.navLink}>BROWSE</Link>
        <Link href="/search" className={styles.navLink}>SEARCH</Link>
        <Link href="/about" className={styles.navLink}>ABOUT</Link>
      </nav>
    </header>
  )
}
