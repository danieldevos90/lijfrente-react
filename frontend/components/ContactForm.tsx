"use client";
import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Onderwerp is verplicht';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Bericht is verplicht';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData(initialFormData);
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        const error = await response.json();
        alert(error.error || 'Er is een fout opgetreden. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: 'var(--color-white)',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-success-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Check size={32} color="white" />
          </div>
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
        }}>
          Bericht verzonden!
        </h3>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1rem',
        }}>
          We hebben uw bericht ontvangen en nemen zo spoedig mogelijk contact met u op.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '3rem 2rem',
      background: 'white',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 400,
          marginBottom: '0.5rem',
          color: 'var(--color-text)',
          fontFamily: 'PP Neue Montreal, sans-serif',
        }}>
          Stuur ons een bericht
        </h2>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1rem',
        }}>
          Vul het formulier in en we nemen binnen 24 uur contact met u op.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--color-text)',
            }}>
              Naam *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: `2px solid ${errors.name ? 'var(--color-error-red)' : 'var(--color-border-gray)'}`,
                borderRadius: '0.75rem',
                fontSize: '16px',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-brand)';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.name ? 'var(--color-error-red)' : 'var(--color-border-gray)';
              }}
            />
            {errors.name && (
              <p style={{
                color: 'var(--color-error-red)',
                fontSize: '14px',
                marginTop: '0.25rem',
                margin: 0,
              }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '14px',
              color: 'var(--color-text)',
            }}>
              E-mail *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: `2px solid ${errors.email ? 'var(--color-error-red)' : 'var(--color-border-gray)'}`,
                borderRadius: '0.75rem',
                fontSize: '16px',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-brand)';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? 'var(--color-error-red)' : 'var(--color-border-gray)';
              }}
            />
            {errors.email && (
              <p style={{
                color: 'var(--color-error-red)',
                fontSize: '14px',
                marginTop: '0.25rem',
                margin: 0,
              }}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text)',
          }}>
            Telefoonnummer
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid var(--color-border-gray)',
              borderRadius: '0.75rem',
              fontSize: '16px',
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-brand)';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-border-gray)';
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text)',
          }}>
            Onderwerp *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: `2px solid ${errors.subject ? 'var(--color-error-red)' : 'var(--color-border-gray)'}`,
              borderRadius: '0.75rem',
              fontSize: '16px',
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-brand)';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.subject ? 'var(--color-error-red)' : 'var(--color-border-gray)';
            }}
          />
          {errors.subject && (
            <p style={{
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '0.25rem',
              margin: 0,
            }}>
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--color-text)',
          }}>
            Bericht *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => updateFormData('message', e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: `2px solid ${errors.message ? 'var(--color-error-red)' : 'var(--color-border-gray)'}`,
              borderRadius: '0.75rem',
              fontSize: '16px',
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-brand)';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.message ? 'var(--color-error-red)' : 'var(--color-border-gray)';
            }}
          />
          {errors.message && (
            <p style={{
              color: '#ef4444',
              fontSize: '14px',
              marginTop: '0.25rem',
              margin: 0,
            }}>
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            border: 'none',
            backgroundColor: isSubmitting ? 'var(--color-gray-400)' : 'var(--color-charcoal)',
            color: 'white',
            textAlign: 'center',
            borderRadius: '10rem',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '14rem',
            padding: '1rem 2rem',
            fontFamily: 'Public Sans Variable, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1rem',
            transition: 'all .28s',
            display: 'flex',
            gap: '0.5rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
            }
          }}
        >
          {isSubmitting ? (
            <>
              <span>Verzenden...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Verstuur bericht</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

