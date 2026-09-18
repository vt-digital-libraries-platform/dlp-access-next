'use client'

import { useState } from 'react'
import styles from '../page.module.css'

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('All')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in:', searchFilter)
  }

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSearch} className={styles.searchWrapper}>
        <input 
          type="text"
          placeholder="Search by keyword, title, description"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          className={styles.searchSelect}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        >
          <option>All</option>
          <option>Collections</option>
          <option>Archives</option>
          <option>Maps</option>
        </select>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </div>
  )
}
