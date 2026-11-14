/** Facts about the site that more than one page needs. */
export const site = {
  name: "Lachlan O'Connell",
  url: "https://lachlanoc.com",
  description: "Where I post about my projects, and ideas.",
  /** Shown at the top of the home page. */
  intro:
    "I'm Lachlan, a computer science student at the University of Queensland. I write about cyber security, my homelab, hackathon projects and learning Japanese.",
  links: {
    github: "https://github.com/Lachlanoc",
    linkedin: "https://linkedin.com/in/lachlan-oc",
  },
  /** Kept in two parts so the full address never appears in the page source. */
  email: { user: "lachlanoco", domain: "gmail.com" },
} as const;
