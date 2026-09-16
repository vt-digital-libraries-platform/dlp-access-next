// TODO: Can we make this ssr'd?
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SearchBar from "@/app/_components/search/searchBar";
import "./header.css";

type NavLink = {
  label: string;
  href: string;
};

const browseLinks: NavLink[] = [
  { label: "All", href: "/browse" },
  { label: "Collections", href: "/browse/collections" },
  { label: "Formats", href: "/browse/formats" },
  { label: "Items", href: "/browse/items" },
  { label: "Locations", href: "/browse/locations" },
  { label: "Partner Organizations", href: "/browse/partners" },
];

const aboutLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "About the Digital Library Platform", href: "/about/platform" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Feedback", href: "/about/contact-us" },
  { label: "Metadata Guide", href: "/about/metadata-guide" },
  { label: "Permissions", href: "/about/permissions" },
];

// Two segments rather than one <path> so each can animate independently.
function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <line className="chevron-segment chevron-start" x1="3.5" y1="6" x2="8" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line className="chevron-segment chevron-end" x1="12.5" y1="6" x2="8" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="hamburger-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false">
      <line className="line line-top" x1="1" y1="2" x2="19" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line className="line line-middle" x1="1" y1="8" x2="19" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line className="line line-bottom" x1="1" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// "source" isn't typed in the shipped DOM lib yet; cast preserves the
// implicit anchor link for script-opened popovers.
function showPopoverAnchoredTo(popover: HTMLElement, source: HTMLElement) {
  (popover as HTMLElement & { showPopover(options?: { source?: Element }): void }).showPopover({ source });
}

// Double-gated on hover/pointer capability, so a touch tap's pointerenter
// can't race its own click into open-then-close.
function useHoverToOpenDropdowns(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: Array<() => void> = [];

    header.querySelectorAll<HTMLButtonElement>("[popovertarget]").forEach((trigger) => {
      const panel = trigger.popoverTargetElement;
      const item = trigger.closest("li");
      if (!(panel instanceof HTMLElement) || !item) return;

      const isOpen = () => panel.matches(":popover-open");

      // :focus-visible keeps a tap from opening the panel a frame before its
      // own click toggles it shut. relatedTarget keeps Escape's focus
      // restoration from immediately reopening what Escape just closed.
      const openOnFocus = (event: FocusEvent) => {
        if (event.relatedTarget instanceof Node && panel.contains(event.relatedTarget)) return;
        if (!trigger.matches(":focus-visible")) return;
        if (!isOpen()) showPopoverAnchoredTo(panel, trigger);
      };

      const openOnHover = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (!isOpen()) showPopoverAnchoredTo(panel, trigger);
      };

      // Client-side navigation leaves the panel in the top layer otherwise.
      const closeOnLinkClick = (event: MouseEvent) => {
        if (event.target instanceof Element && event.target.closest("a") && isOpen()) panel.hidePopover();
      };

      const closeWhenInactive = () => {
        requestAnimationFrame(() => {
          const isHovered = trigger.matches(":hover") || panel.matches(":hover");
          const hasFocus = item.contains(document.activeElement);
          if (!isHovered && !hasFocus && isOpen()) panel.hidePopover();
        });
      };

      trigger.addEventListener("focus", openOnFocus);
      item.addEventListener("focusout", closeWhenInactive);
      panel.addEventListener("click", closeOnLinkClick);
      cleanups.push(() => {
        trigger.removeEventListener("focus", openOnFocus);
        item.removeEventListener("focusout", closeWhenInactive);
        panel.removeEventListener("click", closeOnLinkClick);
      });

      if (canHover) {
        trigger.addEventListener("pointerenter", openOnHover);
        trigger.addEventListener("pointerleave", closeWhenInactive);
        panel.addEventListener("pointerleave", closeWhenInactive);
        cleanups.push(() => {
          trigger.removeEventListener("pointerenter", openOnHover);
          trigger.removeEventListener("pointerleave", closeWhenInactive);
          panel.removeEventListener("pointerleave", closeWhenInactive);
        });
      }
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [headerRef]);
}

// Menu ships collapsed in the markup to avoid a flash on load; the no-JS
// fallback lives in the CSS (`@media (scripting: none)`), not here.
function useMobileNavToggle(headerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const toggle = headerRef.current?.querySelector<HTMLButtonElement>(".mobile-nav-toggle");
    const menu = headerRef.current?.querySelector<HTMLElement>(".mobile-nav-menu");
    if (!toggle || !menu) return;

    const setOpen = (open: boolean) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };

    const handleToggleClick = () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    };

    // Client-side navigation leaves the menu expanded otherwise.
    const handleMenuClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
    };

    // Focus is deliberately left where the pointer put it, unlike Escape.
    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      const target = event.target;
      if (target instanceof Node && (menu.contains(target) || toggle.contains(target))) return;
      setOpen(false);
    };

    toggle.addEventListener("click", handleToggleClick);
    toggle.addEventListener("keydown", handleKeydown);
    menu.addEventListener("keydown", handleKeydown);
    menu.addEventListener("click", handleMenuClick);
    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      toggle.removeEventListener("click", handleToggleClick);
      toggle.removeEventListener("keydown", handleKeydown);
      menu.removeEventListener("keydown", handleKeydown);
      menu.removeEventListener("click", handleMenuClick);
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [headerRef]);
}

/**
 * TODO: TSDoc
 */
export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  useHoverToOpenDropdowns(headerRef);
  useMobileNavToggle(headerRef);

  return (
    <header className="header" ref={headerRef}>
      <Link href="/" className="site-logo">
        <span>Virginia Tech</span>
        <span>Digital Library</span>
      </Link>
      
      <button type="button" className="mobile-nav-toggle" aria-controls="mobile-nav-menu" aria-expanded="false">
        <HamburgerIcon />
        <span className="visually-hidden">Menu</span>
      </button>

      <nav id="mobile-nav-menu" aria-label="Site" className="mobile-nav-menu" hidden>
        <div className="mobile-nav-menu-inner">
          <p className="mobile-nav-heading">Browse</p>
          <ul>
            {browseLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <p className="mobile-nav-heading">About</p>
          <ul>
            {aboutLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <SearchBar />

      <nav aria-label="Site" className="site-nav">
        <ul>
          <li>
            <button type="button" popoverTarget="browse-menu">
              Browse
              <Chevron />
            </button>
            <ul id="browse-menu" popover="auto">
              {browseLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <button type="button" popoverTarget="about-menu">
              About
              <Chevron />
            </button>
            <ul id="about-menu" popover="auto">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
