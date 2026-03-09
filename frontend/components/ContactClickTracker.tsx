"use client";

import { useEffect } from "react";
import { trackContactClick } from "@/lib/analytics";

function getClosestAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest("a[href]") as HTMLAnchorElement | null;
}

export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = getClosestAnchor(event.target);
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackContactClick("phone", href, { link_text: anchor.textContent?.trim() || undefined });
      } else if (href.startsWith("mailto:")) {
        trackContactClick("email", href, { link_text: anchor.textContent?.trim() || undefined });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
