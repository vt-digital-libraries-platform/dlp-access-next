import "./CustomIcons.css";

/**
 * 
 * @returns Chevron svg icon (two angled lines with a shared vertex)
 */
export function ChevronIcon() {
  return (
    <svg className="custom-icon--chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <line x1="3.5" y1="6" x2="8" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12.5" y1="6" x2="8" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 
 * @returns Hamburger menu svg icon (three horizontal lines)
 */
export function HamburgerIcon() {
  return (
    <svg className="custom-icon--hamburger" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
      <line x1="1" y1="2" x2="19" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}


/**
 * 
 * @returns Magnifying glass svg icon (circle and angled path)
 */
export function MagnifyingGlassIcon() {
  return (
    <svg className="custom-icon--magnifying-glass" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 *
 * @returns Copyright svg icon (a "C" inside a circle)
 */
export function CopyrightIcon() {
  return (
    <svg className="custom-icon--copyright" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.75" fill="none" />
      <path d="M12.75 7.5A3.5 3.5 0 1 0 12.75 12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 *
 * @returns External link svg icon (an arrow leaving a box)
 */
export function ExternalLinkIcon() {
  return (
    <svg className="custom-icon--external-link" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M9 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 3h5v5M17 3l-7.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}