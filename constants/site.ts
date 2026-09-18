/**
 * Site-wide constants and configuration
 */

export const SITE_CONFIG = {
  name: "Virginia Tech Digital Libraries",
  description: "Explore our digital collections",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://digitallibraries.lib.vt.edu",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
] as const;

export const BROWSE_CATEGORIES = [
  {
    icon: "📚",
    title: "Browse by Collection",
    description: "Explore our curated digital collections",
    href: "/collections",
    linkText: "View Collections",
  },
  {
    icon: "🏛️",
    title: "Browse by Organization",
    description: "Discover content by contributing organizations",
    href: "/browse/organizations",
    linkText: "View Organizations",
  },
  {
    icon: "📄",
    title: "Browse by Format",
    description: "Find materials by format type",
    href: "/browse/formats",
    linkText: "View Formats",
  },
] as const;
