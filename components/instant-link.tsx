"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, MouseEvent, startTransition } from "react";

type InstantLinkProps = ComponentProps<typeof Link> & {
  instant?: boolean;
};

/**
 * A Link component that navigates instantly without waiting for data fetching.
 * Set instant={true} for instant navigation with loading states.
 * Set instant={false} or omit for default Next.js behavior (prefetch and wait).
 */
export function InstantLink({
  instant = true,
  onClick,
  ...props
}: InstantLinkProps) {
  const router = useRouter();

  if (!instant) {
    return <Link {...props} />;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // If default was prevented, don't navigate
    if (e.defaultPrevented) {
      return;
    }

    // Prevent default link behavior
    e.preventDefault();

    // Dispatch navigation start event for progress bar
    window.dispatchEvent(new Event("navigationStart"));

    // Get the href
    const href = props.href.toString();

    // Use startTransition to mark navigation as non-urgent
    // This allows React to show loading states immediately
    startTransition(() => {
      router.push(href);
    });
  };

  // prefetch={false} prevents Next.js from prefetching on hover
  return <Link {...props} onClick={handleClick} prefetch={false} />;
}
