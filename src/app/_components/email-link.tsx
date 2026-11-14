"use client";

import { useSyncExternalStore } from "react";

type Props = {
  user: string;
  domain: string;
  className?: string;
};

const subscribeToNothing = () => () => {};

/**
 * An email address that is only assembled into a link in the browser.
 * The page source and no-script view show "user [at] domain" instead, which
 * keeps the address away from simple scrapers.
 */
export function EmailLink({ user, domain, className }: Props) {
  const inBrowser = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  if (!inBrowser) {
    return (
      <span className={className}>
        {user} [at] {domain}
      </span>
    );
  }

  const address = `${user}@${domain}`;
  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  );
}
