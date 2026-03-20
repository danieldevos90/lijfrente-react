"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import "./DrawerWidget.css";
import QuickLeadForm from "./forms/QuickLeadForm";
import type { QuickLeadCloseMethod } from "@/lib/analytics";

function dispatchSurfaceClose(method: QuickLeadCloseMethod) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("quick_lead_surface_close", { detail: { method } })
  );
}

interface DrawerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  /** CTA / deeplink source from openDrawer('…'); optional for standalone drawers (e.g. sticky CTA) */
  openTrigger?: string | null;
}

export default function DrawerWidget({ isOpen, onClose, openTrigger = null }: DrawerWidgetProps) {
  const closeWith = useCallback(
    (method: QuickLeadCloseMethod) => {
      dispatchSurfaceClose(method);
      onClose();
    },
    [onClose]
  );

  // Close on ESC for usability.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWith("escape");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeWith]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => closeWith("overlay")} />
      <div
        className={`drawer-container ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="drawer-close"
          onClick={() => closeWith("close_button")}
          aria-label="Sluiten"
        >
          <X size={20} />
        </button>

        <div className="drawer-body">
          <QuickLeadForm
            isModal={true}
            defaultSource="drawer"
            surface="drawer"
            openTrigger={openTrigger ?? undefined}
            onSuccess={() => {}}
          />
        </div>
      </div>
    </>
  );
}
