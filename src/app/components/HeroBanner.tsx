import Image from 'next/image'
import styles from '../page.module.css'

interface HeroBannerProps {
  title: string
  imageUrl?: string
}

export default function HeroBanner({ title, imageUrl = '/images/hero-bg.jpg' }: HeroBannerProps) {
  return (
    <div className={styles.heroBanner}>
      <Image 
        src={imageUrl} 
        alt="Virginia Tech Campus"
        fill
        priority
        className={styles.heroImage}
        style={{
          objectFit: 'cover',
          filter: 'brightness(40%) contrast(85%)',
        }}
      />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {title}
        </h1>
      </div>
    </div>
  )
}
