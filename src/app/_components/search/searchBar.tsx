import "./searchBar.css";

function MagnifyingGlass() {
  return (
    <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SearchBar() {
  return (
    <search className="site-search">
      <form action="/search">
        <label htmlFor="site-search" className="visually-hidden">
          Search the digital library
        </label>
        <div className="input-group">
          <input id="site-search" name="q" type="search" placeholder="Search the archive" autoComplete="off" />
          <button type="submit">
            <MagnifyingGlass />
            <span className="visually-hidden">Search</span>
          </button>
        </div>
      </form>
    </search>
  );
}
