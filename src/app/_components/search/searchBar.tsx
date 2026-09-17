import { MagnifyingGlassIcon } from "@/app/_components/icons/CustomIcons";
import "./SearchBar.css";

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
            <MagnifyingGlassIcon />
            <span className="visually-hidden">Search</span>
          </button>
        </div>
      </form>
    </search>
  );
}
