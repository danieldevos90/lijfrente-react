"use client";

import { useEffect, useRef, useState } from "react";
import LeadFormModal from "./modals/LeadFormModal";
import { useWidget } from "./GlobalWidgetProvider";

function shouldEnableOnPath(pathname: string): boolean {
  // Avoid showing on conversion pages or in admin-like areas.
  if (pathname.startsWith("/lead")) return false;
  if (pathname.startsWith("/bedankt")) return false;
  if (pathname.startsWith("/password")) return false;
  if (pathname.startsWith("/admin")) return false;
  return true;
}

export default function ExitIntentLeadCapture() {
  const [open, setOpen] = useState(false);
  const armedRef = useRef(false);
  const shownRef = useRef(false);
  const { isOpen: isDrawerOpen } = useWidget();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = "exit_intent_lead_v1";
    try {
      const already = window.sessionStorage.getItem(key);
      if (already === "1") shownRef.current = true;
    } catch {}

    const pathOk = shouldEnableOnPath(window.location.pathname);
    if (!pathOk) return;

    // Never interrupt the user when the drawer is active.
    if (isDrawerOpen) return;

    const isDesktop = window.matchMedia && window.matchMedia("(min-width: 900px)").matches;
    if (!isDesktop) return;

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, 12000); // give value before interrupting

    const onMouseLeave = (e: MouseEvent) => {
      if (shownRef.current) return;
      if (!armedRef.current) return;
      // top edge exit intent
      if (e.clientY > 8) return;
      shownRef.current = true;
      try {
        window.sessionStorage.setItem(key, "1");
      } catch {}
      setOpen(true);
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    // If the drawer opens while the modal is (about to be) shown, close it.
    setOpen(false);
  }, [isDrawerOpen]);

  return <LeadFormModal isOpen={open} onClose={() => setOpen(false)} />;
}

