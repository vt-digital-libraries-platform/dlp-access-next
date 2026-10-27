// TODO: Can we make this ssr'd?
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import SearchBar from "@/app/_components/search/SearchBar";
import { HamburgerIcon, ChevronIcon } from "@/app/_components/icons/CustomIcons";
import "./Header.css";

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
  { label: "Accessibility", href: "/accessibility" },
  { label: "Feedback", href: "/feedback" },
  { label: "Metadata Guide", href: "/about/metadata" },
  { label: "Permissions", href: "/about/permissions" },
];

/**
 * Preserve implicit anchor link for script-opened popovers for weird DOM edge cases
 * 
 * @param popover 
 * @param source 
 */
function showPopoverAnchoredTo(popover: HTMLElement, source: HTMLElement) {
  (popover as HTMLElement & { showPopover(options?: { source?: Element }): void }).showPopover({ source });
}

// Double-gated on hover/pointer capability, so a touch tap's pointerenter
// can't race its own click into open-then-close.
/**
 * 
 * 
 * @param headerRef 
 */
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

      /**
       * Open a popover when its trigger gains the :focus-visible pseudo-class.
       * 
       * Handles colliding trigger events from touch inputs causing immediate focus change and 
       * gracefully returns focus to the trigger on closure without re-triggering.
       * 
       * @param event FocusEvent "focus"
       */
      const openOnFocus = (event: FocusEvent) => {
        if (event.relatedTarget instanceof Node && panel.contains(event.relatedTarget)) return;
        if (!trigger.matches(":focus-visible")) return;
        if (!isOpen()) showPopoverAnchoredTo(panel, trigger);
      };

      /**
       * Open the popover on trigger hover.
       * 
       * @param event PointerEvent "pointerenter"
       */
      const openOnHover = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (!isOpen()) showPopoverAnchoredTo(panel, trigger);
      };

      // Client-side navigation leaves the panel in the top layer otherwise.
      // TODO: @kellyme Might be unecessary
      const closeOnLinkClick = (event: MouseEvent) => {
        if (event.target instanceof Element && event.target.closest("a") && isOpen()) panel.hidePopover();
      };

      /**
       * Collapse an open popover when it and its trigger aren't hovered and don't have focus
       */
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

/**
 * Pre-collapses the mobile nav menu to avoid flash on load/hydration.
 * 
 * @see Header.css "No-JS Fallback for useMobileNavToggle()"
 * @param headerRef 
 */
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

    // Client-side navigation leaves the menu expanded otherwise
    const handleMenuClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
    };

    // Focus is left where the pointer put it (unlike esc key)
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
 * TODO: @kellyme TSDoc
 */
export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  useHoverToOpenDropdowns(headerRef);
  useMobileNavToggle(headerRef);

  return (
    <header ref={headerRef}>
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
              <ChevronIcon />
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
              <ChevronIcon />
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
