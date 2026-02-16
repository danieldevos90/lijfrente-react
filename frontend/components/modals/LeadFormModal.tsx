"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import QuickLeadForm from '../forms/QuickLeadForm';
import SuccessModal from './SuccessModal';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleFormSuccess = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header">
            <h2>Zakelijke financiering aanvragen</h2>
            <button 
              className="modal-close-btn"
              onClick={onClose}
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
