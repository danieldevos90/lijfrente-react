"use client";
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultBackground?: string;
  activeBackground?: string;
  maxWidth?: string;
}

/**
 * Compact FAQ Accordion component for use within other pages/sections
 * Can be embedded anywhere without the full section wrapper
 */
export default function FAQAccordion({ 
  items,
  defaultBackground = 'white',
  activeBackground = 'rgb(228, 242, 255)',
  maxWidth = '900px'
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{
      maxWidth,
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {items.map((item, index) => (
          <div 
            key={item.id || index}
            style={{
              background: openIndex === index ? activeBackground : defaultBackground,
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: openIndex === index ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Question Header */}
            <button
              onClick={() => toggleFAQ(index)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '2rem 1rem 2rem 2rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                gridColumnGap: '3rem',
                gridRowGap: '3rem',
                gap: '2rem',
                transition: 'all 0.3s ease',
              }}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: '18px',
                fontWeight: 500,
                color: '#0f1720',
                flex: 1,
                lineHeight: 1.4,
              }}>
                {item.question}
              </span>
              <div style={{
                width: '24px',
                height: '24px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
              }}>
                <Plus size={24} color="#0f1720" strokeWidth={2} />
              </div>
            </button>

            {/* Answer Content */}
            <div 
              id={`faq-answer-${index}`}
              style={{
                maxHeight: openIndex === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease, padding 0.4s ease',
                padding: openIndex === index ? '0 2rem 2rem 2rem' : '0 2rem',
              }}
            >
              <div style={{
                fontFamily: "'Neue Montreal', sans-serif",
                fontSize: '16px',
                lineHeight: 1.7,
                color: '#4b5563',
              }}>
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

