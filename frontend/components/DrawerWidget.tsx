"use client";

import React, { useEffect, useState } from "react";
import { Shield, X, Zap } from "lucide-react";
import Logo from "./Logo";
import "./DrawerWidget.css";
import QuickLeadForm from "./forms/QuickLeadForm";

interface DrawerWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerWidget({ isOpen, onClose }: DrawerWidgetProps) {
  const [step, setStep] = useState<1 | 2>(1);

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

  const progressWidth = step === 2 ? "100%" : "50%";

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`drawer-container ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <div className="drawer-title">
            <Logo size={32} showText={true} />
            <div className="step-indicator">Binnen 2 minuten aangevraagd • Aanbod binnen 24 uur</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Sluiten">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-progress" aria-hidden="true">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: progressWidth }} />
          </div>
          <div className="drawer-trust">
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={16} /> Veilig en vertrouwd
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={16} /> Binnen 24 uur reactie
            </span>
          </div>
        </div>

        <div className="drawer-body">
          <QuickLeadForm
            isModal={true}
            defaultSource="drawer"
            onSuccess={onClose}
            onStepChange={(s) => setStep(s)}
          />
        </div>
      </div>
    </>
  );
}

