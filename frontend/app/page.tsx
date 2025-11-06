"use client";
import React from 'react';
import TransparentHeader from '../components/TransparentHeader';
import Footer from '../components/Footer';
import { Zap, Shield, Clock, TrendingUp, Users, Award, CheckCircle, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const StickyCTA = dynamic(() => import('../components/StickyCTA'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <TransparentHeader />
      
      {/* Big Hero Section with Image - FULLSCREEN */}
      <section style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(15, 23, 32, 0.6), rgba(15, 23, 32, 0.6)), url('https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1920&h=1080&fit=crop') center/cover`,
        backgroundAttachment: 'fixed',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            Zakelijke financiering zonder gedoe
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            marginBottom: '3rem',
            opacity: 0.95,
            lineHeight: 1.6,
          }}>
            Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk.
          </p>
          
          {/* Single CTA in center */}
          <button style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 3rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(69, 127, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(69, 127, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(69, 127, 255, 0.3)';
          }}>
            Start aanvraag
          </button>
        </div>
      </section>

      {/* Animated Stacking Cards Section */}
      <section style={{
        background: 'var(--color-bg)',
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Waarom ondernemers voor ons kiezen
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Snelle service, transparante voorwaarden en persoonlijk advies
            </p>
          </div>

          {/* Stacking Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { icon: Zap, title: 'Razendsnel', desc: 'Binnen 24 uur reactie op uw aanvraag', color: '--color-sun' },
              { icon: Shield, title: 'Betrouwbaar', desc: 'Gecertificeerd en volledig transparant', color: '--color-mint' },
              { icon: Clock, title: 'Flexibel', desc: 'Looptijd en voorwaarden op maat', color: '--color-sky' },
              { icon: TrendingUp, title: 'Groei', desc: 'Investeer in de toekomst van uw bedrijf', color: '--color-pink-light' },
              { icon: Users, title: 'Persoonlijk', desc: 'Dedicated adviseur voor elke klant', color: '--color-sun' },
              { icon: Award, title: 'Bewezen', desc: 'Honderden tevreden ondernemers', color: '--color-mint' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="stack-card"
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all 0.3s ease',
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-lg)',
                    background: `var(${item.color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                  }}>
                    <Icon size={32} color="var(--color-charcoal)" strokeWidth={2} />
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--color-text)',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Carousel Section */}
      <section style={{
        background: 'var(--color-bg-tertiary)',
        padding: '6rem 2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Zo werkt het
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              In 4 eenvoudige stappen naar uw zakelijke financiering
            </p>
          </div>

          {/* Benefits Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { 
                step: '1',
                title: 'Aanvraag indienen',
                desc: 'Vul in 2 minuten het aanvraagformulier in met uw bedrijfsgegevens',
                image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop'
              },
              { 
                step: '2',
                title: 'Beoordeling',
                desc: 'Onze experts beoordelen uw aanvraag en nemen binnen 4 uur contact op',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
              },
              { 
                step: '3',
                title: 'Offerte ontvangen',
                desc: 'U ontvangt een transparant voorstel met alle voorwaarden',
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
              },
              { 
                step: '4',
                title: 'Uitbetaling',
                desc: 'Bij akkoord wordt het geld snel naar u overgemaakt',
                image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop'
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-lg)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: `url('${item.image}') center/cover`,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}>
                    {item.step}
                  </div>
                </div>
                <div style={{ padding: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '0.75rem',
                    color: 'var(--color-text)',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'var(--color-bg)',
        padding: '6rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <CheckCircle size={64} color="var(--color-primary)" strokeWidth={2} style={{ marginBottom: '1.5rem' }} />
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            Klaar om te starten?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--color-text-muted)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            Vraag binnen 2 minuten uw zakelijke financiering aan
          </p>
          <button style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
          }}>
            Start je aanvraag nu
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <Footer />
      <StickyCTA label="Aanvraag starten" useDrawer={true} />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stack-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-2xl);
        }
      `}</style>
    </>
  );
}
