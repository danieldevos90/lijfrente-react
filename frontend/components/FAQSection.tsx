"use client";
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqItems: FAQItem[];
}

export default function FAQSection({ 
  title = "Veelgestelde vragen", 
  subtitle,
  faqItems 
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{
      padding: '5rem 0',
      background: 'rgb(244, 244, 239)',
    }}>
      <div className="container" style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <h2 style={{
            fontFamily: "'Neue Montreal', sans-serif",
            fontSize: '48px',
            fontWeight: 500,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: '#0f1720',
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontFamily: "'Neue Montreal', sans-serif",
              fontSize: '18px',
              color: '#6b7280',
              margin: 0,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {faqItems.map((item, index) => (
            <div 
              key={item.id || index}
              style={{
                background: openIndex === index ? 'rgb(228, 242, 255)' : 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.05)',
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
              <div style={{
                maxHeight: openIndex === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.4s ease, padding 0.4s ease',
                padding: openIndex === index ? '0 2rem 2rem 2rem' : '0 2rem',
              }}>
                <div style={{
                  fontFamily: "'Neue Montreal', sans-serif",
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: '#4b5563',
                  paddingTop: openIndex === index ? '0' : '0',
                }}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



