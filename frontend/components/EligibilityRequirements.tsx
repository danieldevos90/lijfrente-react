"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const QUALIFYING = [
  "Winstgevend bedrijf (of break-even)",
  "Geen betaalachterstanden op de bankrekening",
  "Minimale jaaromzet van €100.000",
  "Ingeschreven bij de KvK",
];

const DISQUALIFYING = [
  "Bedrijf draait verlies",
  "Betaalachterstanden zichtbaar op bankrekening",
];

type Variant = "banner" | "section";
type Theme = "light" | "dark";

interface EligibilityRequirementsProps {
  variant?: Variant;
  theme?: Theme;
  className?: string;
}

export default function EligibilityRequirements({
  variant = "banner",
  theme = "light",
  className = "",
}: EligibilityRequirementsProps) {
  const isDark = theme === "dark";

  if (variant === "section") {
    return (
      <div className={`eligibility-section ${isDark ? "eligibility-section--dark" : ""} ${className}`}>
        <h3 className="eligibility-section__title">Voorwaarden voor financiering</h3>
        <p className="eligibility-section__subtitle">
          Controleer of jouw bedrijf in aanmerking komt
        </p>
        <div className="eligibility-section__grid">
          <div className="eligibility-section__col">
            <span className="eligibility-section__col-heading eligibility-section__col-heading--pass">
              <CheckCircle2 size={16} aria-hidden /> Vereist
            </span>
            <ul className="eligibility-section__list">
              {QUALIFYING.map((item) => (
                <li key={item} className="eligibility-section__item eligibility-section__item--pass">
                  <CheckCircle2 size={14} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="eligibility-section__col">
            <span className="eligibility-section__col-heading eligibility-section__col-heading--fail">
              <XCircle size={16} aria-hidden /> Niet acceptabel
            </span>
            <ul className="eligibility-section__list">
              {DISQUALIFYING.map((item) => (
                <li key={item} className="eligibility-section__item eligibility-section__item--fail">
                  <XCircle size={14} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`eligibility-banner ${isDark ? "eligibility-banner--dark" : ""} ${className}`}>
      <div className="eligibility-banner__items">
        {QUALIFYING.slice(0, 3).map((item) => (
          <span key={item} className="eligibility-banner__pill">
            <CheckCircle2 size={13} aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
