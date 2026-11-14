/** Facts about the site that more than one page needs. */
export const site = {
  url: "https://lachlanoc.com",
  description: "Where I post about my projects, and ideas.",
  links: {
    github: "https://github.com/Lachlanoc",
    linkedin: "https://linkedin.com/in/lachlan-oc",
  },
  /** Kept in two parts so the full address never appears in the page source. */
  email: { user: "lachlanoco", domain: "gmail.com" },
} as const;
