"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  /** Other path prefixes that should also mark this link as current. */
  alsoActiveFor?: string[];
  children: React.ReactNode;
};

export function NavLink({ href, alsoActiveFor = [], children }: Props) {
  const pathname = usePathname();
  const isCurrent =
    pathname === href ||
    alsoActiveFor.some((prefix) => pathname.startsWith(prefix));

  return (
    <Link
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className="py-1 text-muted hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
    >
      {children}
    </Link>
  );
}
