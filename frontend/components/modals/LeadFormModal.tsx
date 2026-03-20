"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import QuickLeadForm from '../forms/QuickLeadForm';
import SuccessModal from './SuccessModal';
import type { QuickLeadCloseMethod } from '@/lib/analytics';

function dispatchSurfaceClose(method: QuickLeadCloseMethod) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("quick_lead_surface_close", { detail: { method } })
  );
}

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const closeWith = useCallback(
    (method: QuickLeadCloseMethod) => {
      dispatchSurfaceClose(method);
      onClose();
    },
    [onClose]
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeWith('escape');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeWith]);

  const handleFormSuccess = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    closeWith('close_button');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={() => closeWith('overlay')}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <h2>Zakelijke financiering aanvragen</h2>
            <button 
              type="button"
              className="modal-close-btn"
              onClick={() => closeWith('close_button')}
              aria-label="Sluit formulier"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="modal-content modal-content--padded">
            <QuickLeadForm
              onSuccess={handleFormSuccess}
              isModal={true}
              surface="exit_intent_modal"
              openTrigger="exit_intent"
              defaultSource="exit_intent_modal"
            />
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccess}
        onClose={handleSuccessClose}
      />
    </>
  );
}
