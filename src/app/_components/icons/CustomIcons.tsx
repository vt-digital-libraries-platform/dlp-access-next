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