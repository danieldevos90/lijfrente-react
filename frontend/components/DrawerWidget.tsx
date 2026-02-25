"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import "./DrawerWidget.css";
import QuickLeadForm from "./forms/QuickLeadForm";

interface DrawerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerWidget({ isOpen, onClose }: DrawerWidgetProps) {
  // Close on ESC for usability.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`drawer-container ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Sluiten">
          <X size={20} />
        </button>

        <div className="drawer-body">
          <QuickLeadForm
            isModal={true}
            defaultSource="drawer"
            onSuccess={() => {}}
          />
        </div>
      </div>
    </>
  );
}

