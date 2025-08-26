"use client";
import React, { useEffect } from 'react';
import { Check, Phone, Mail, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          className="modal-close-btn success-close"
          onClick={onClose}
          aria-label="Sluit bericht"
        >
          <X size={20} />
        </button>

        {/* Success Content */}
        <div className="success-content">
          <div className="success-icon">
            <Check size={48} />
          </div>
          
          <h2>Bedankt voor uw aanvraag!</h2>
          <p>Uw financieringsaanvraag is succesvol ontvangen. We nemen binnen 24 uur contact met u op.</p>
          
          <div className="success-next-steps">
            <h3>Wat gebeurt er nu?</h3>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Beoordeling binnen 4 uur</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Persoonlijk gesprek binnen 24 uur</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Concreet financieringsvoorstel</span>
              </div>
            </div>
          </div>

          <div className="success-contact">
            <h3>Direct contact nodig?</h3>
            <div className="contact-options">
              <a href="tel:0851305000" className="contact-option">
                <Phone size={20} />
                <span>085 - 130 5000</span>
              </a>
              <a href="mailto:info@zakelijklening.nl" className="contact-option">
                <Mail size={20} />
                <span>info@zakelijklening.nl</span>
              </a>
            </div>
          </div>

          <button className="btn btn-primary" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
