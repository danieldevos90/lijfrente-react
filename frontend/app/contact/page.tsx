"use client";
import React, { useState } from 'react';
import TransparentHeader from '../../components/TransparentHeader';
import Footer from '../../components/Footer';
import SubpageHero from '../../components/SubpageHero';
import { useWidget } from '../../components/GlobalWidgetProvider';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const { openDrawer } = useWidget();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCtaClick = () => {
    openDrawer('contact_page');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <>
      <TransparentHeader transparent={true} textColor="black" onCtaClick={handleCtaClick} />
      
      {/* Hero Section */}
      <SubpageHero
        title="Neem contact op"
        subtitle="Heeft u vragen of wilt u meer weten over onze diensten? We helpen u graag verder."
        backgroundColor="var(--color-bg)"
        iconPath="/icons/SVG/interface/message.svg"
      />
      
      <main style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
      }}>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem 6rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
          }}>
            {/* Contact Cards */}
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <Phone size={28} color="white" />
              </div>
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '0.75rem',
                color: 'var(--color-text)',
              }}>
                Bel ons
              </h3>
              <p style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
              }}>
                Ma-Vr: 09:00 - 18:00
              </p>
              <a href="tel:0201234567" style={{
                fontSize: '1.125rem',
                color: 'var(--color-charcoal)',
                fontWeight: 500,
                textDecoration: 'none',
              }}>
                020-1234567
              </a>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <Mail size={28} color="white" />
              </div>
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '0.75rem',
                color: 'var(--color-text)',
              }}>
                E-mail ons
              </h3>
              <p style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
              }}>
                Reactie binnen 24 uur
              </p>
              <a href="mailto:info@geldgeregeld.nl" style={{
                fontSize: '1.125rem',
                color: 'var(--color-charcoal)',
                fontWeight: 500,
                textDecoration: 'none',
              }}>
                info@geldgeregeld.nl
              </a>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              border: '1px solid var(--color-border)',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-charcoal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <MapPin size={28} color="white" />
              </div>
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 400,
                marginBottom: '0.75rem',
                color: 'var(--color-text)',
              }}>
                Bezoek ons
              </h3>
              <p style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text-muted)',
                marginBottom: '0.5rem',
              }}>
                Op afspraak
              </p>
              <p style={{
                fontSize: '1.0625rem',
                color: 'var(--color-text)',
                lineHeight: 1.6,
              }}>
                Herengracht 282<br />
                1016 BX Amsterdam
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: 'white',
            padding: '3rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
          }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '2.5rem',
              fontWeight: 400,
              marginBottom: '1.5rem',
              color: 'var(--color-text)',
              textAlign: 'center',
            }}>
              Stuur ons een bericht
            </h2>

            {submitStatus === 'success' && (
              <div style={{
                background: '#bbe7be',
                border: '1px solid #114e0b',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                color: '#114e0b',
                textAlign: 'center',
              }}>
                ✓ Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: '#f8e4e4',
                border: '1px solid #3b0b0b',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                color: '#3b0b0b',
                textAlign: 'center',
              }}>
                ✗ Er is iets misgegaan. Probeer het opnieuw of neem telefonisch contact op.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Naam *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  E-mailadres *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Onderwerp *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                  }}
                >
                  <option value="">Selecteer een onderwerp</option>
                  <option value="financiering">Vraag over financiering</option>
                  <option value="aanvraag">Status van mijn aanvraag</option>
                  <option value="algemeen">Algemene vraag</option>
                  <option value="samenwerking">Zakelijke samenwerking</option>
                  <option value="overig">Overig</option>
                </select>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                  color: 'var(--color-text)',
                }}>
                  Bericht *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isSubmitting ? 'var(--color-text-muted)' : 'var(--color-charcoal)',
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  fontFamily: 'Public Sans Variable, sans-serif',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.28s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = '#333333';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.background = 'var(--color-charcoal)';
                }}
              >
                {isSubmitting ? (
                  'Verzenden...'
                ) : (
                  <>
                    <Send size={20} />
                    Verstuur bericht
                  </>
                )}
              </button>

              <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                marginTop: '1rem',
                textAlign: 'center',
              }}>
                Door dit formulier te verzenden gaat u akkoord met ons <a href="/privacy" style={{ color: 'var(--color-charcoal)', textDecoration: 'underline' }}>privacybeleid</a>.
              </p>
            </form>
          </div>

          {/* Opening Hours */}
          <div style={{
            maxWidth: '700px',
            margin: '3rem auto 0',
            background: '#aad5fc',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
              <Clock size={28} color="#0f1720" />
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: '1.5rem',
                fontWeight: 400,
                color: '#0f1720',
                margin: 0,
              }}>
                Openingstijden
              </h3>
            </div>
            <p style={{
              fontSize: '1.0625rem',
              color: '#0f1720',
              lineHeight: 1.8,
              margin: 0,
            }}>
              Maandag - Vrijdag: 09:00 - 18:00<br />
              Zaterdag - Zondag: Gesloten
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

