'use client'

import Link from 'next/link'
import styles from './page.module.scss'

export default function FormatsPage() {
  return (
    <div className={styles.formatsPage}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link> / <Link href="/about">About</Link> / <span>Formats</span>
      </div>

      <h1 className={styles.title}>About Formats</h1>
      
      <section className={styles.section}>
        <p className={styles.intro}>
          Learn about the digital formats and file types used in our collections.
        </p>
        
        <div className={styles.formatGroups}>
          <div className={styles.formatGroup}>
            <h2>📄 Document Formats</h2>
            <ul>
              <li><strong>PDF</strong> - Portable Document Format for documents and reports</li>
              <li><strong>TXT</strong> - Plain text files</li>
              <li><strong>XML/TEI</strong> - Encoded textual materials</li>
            </ul>
          </div>
          
          <div className={styles.formatGroup}>
            <h2>🖼️ Image Formats</h2>
            <ul>
              <li><strong>JPEG/JPG</strong> - Compressed image format</li>
              <li><strong>TIFF</strong> - High-quality archival images</li>
              <li><strong>PNG</strong> - Lossless image format</li>
            </ul>
          </div>
          
          <div className={styles.formatGroup}>
            <h2>🎵 Audio Formats</h2>
            <ul>
              <li><strong>MP3</strong> - Compressed audio format</li>
              <li><strong>WAV</strong> - Uncompressed audio format</li>
              <li><strong>FLAC</strong> - Lossless audio compression</li>
            </ul>
          </div>
          
          <div className={styles.formatGroup}>
            <h2>🎥 Video Formats</h2>
            <ul>
              <li><strong>MP4</strong> - Standard video format</li>
              <li><strong>MOV</strong> - QuickTime video format</li>
              <li><strong>AVI</strong> - Audio Video Interleave</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.note}>
        <p>
          📝 <strong>Note:</strong> This is a placeholder page. Detailed format specifications need to be added.
        </p>
      </section>
    </div>
  )
}
