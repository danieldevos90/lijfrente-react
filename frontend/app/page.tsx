"use client";
import React, { useState } from 'react';
import TransparentHeader from '../components/TransparentHeader';
import Footer from '../components/Footer';
import { Zap, Shield, Clock, TrendingUp, Users, Award, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const StickyCTA = dynamic(() => import('../components/StickyCTA'), { ssr: false });

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  
  const testimonials = [
    {
      name: 'Sarah van der Berg',
      role: 'Eigenaar Café de Hoek',
      text: 'Met GeldGeregeld kon ik eindelijk mijn terras uitbreiden. De aanvraag was verrassend eenvoudig en binnen een dag had ik een offerte.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Mark Jansen',
      role: 'Directeur Transport BV',
      text: 'Geen gedoe met ingewikkelde formulieren. Gewoon duidelijke uitleg en snelle service. Precies wat we als MKB nodig hebben.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    },
    {
      name: 'Lisa Vermeulen',
      role: 'Oprichter Webshop Groen',
      text: 'Ik was eerst sceptisch, maar GeldGeregeld heeft mijn verwachtingen overtroffen. Persoonlijk contact en transparante voorwaarden.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  ];

  const benefits = [
    { 
      icon: Zap, 
      title: 'Razendsnel', 
      desc: 'Binnen 24 uur reactie op uw aanvraag. We begrijpen dat tijd geld is voor ondernemers.',
      color: '#fff2b2',
      textColor: '#5e5515'
    },
    { 
      icon: Shield, 
      title: 'Betrouwbaar', 
      desc: 'Volledig gecertificeerd en transparant. Geen verborgen kosten of verrassingen achteraf.',
      color: '#bbe7be',
      textColor: '#114e0b'
    },
    { 
      icon: Clock, 
      title: 'Flexibel', 
      desc: 'Looptijd en voorwaarden volledig op maat van uw bedrijf en situatie.',
      color: '#aad5fc',
      textColor: '#0f1720'
    },
    { 
      icon: TrendingUp, 
      title: 'Groei', 
      desc: 'Investeer in de toekomst van uw bedrijf met onze flexibele financieringsoplossingen.',
      color: '#d7d0ff',
      textColor: '#3b0b0b'
    },
    { 
      icon: Users, 
      title: 'Persoonlijk', 
      desc: 'Een dedicated adviseur begeleidt u door het hele proces, van aanvraag tot uitbetaling.',
      color: '#f8e4e4',
      textColor: '#3b0b0b'
    },
    { 
      icon: Award, 
      title: 'Bewezen', 
      desc: 'Meer dan 500 tevreden ondernemers gingen u voor. Bekijk hun ervaringen hieronder.',
      color: '#fcf8d8',
      textColor: '#5e5515'
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextBenefit = () => {
    setCurrentBenefit((prev) => (prev + 1) % benefits.length);
  };

  const prevBenefit = () => {
    setCurrentBenefit((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  return (
    <>
      <TransparentHeader />
      
      {/* Hero Section */}
      <section id="hero" style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(rgba(15, 23, 32, 0.5), rgba(15, 23, 32, 0.5)), url('https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1920&h=1080&fit=crop') center/cover`,
        backgroundAttachment: 'fixed',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            Zakelijke financiering <span style={{ color: 'var(--color-sun)' }}>geregeld</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            marginBottom: '3rem',
            opacity: 0.95,
            lineHeight: 1.6,
          }}>
            Van aanvraag tot uitbetaling in 24 uur. Helder, flexibel en zonder papierwerk.
          </p>
          
          <button style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 3rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(69, 127, 255, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(69, 127, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(69, 127, 255, 0.4)';
          }}>
            Start aanvraag
          </button>
        </div>
      </section>

      {/* Benefits Carousel Section */}
      <section id="benefits" style={{
        background: 'var(--color-bg)',
        padding: '8rem 2rem',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Waarom ondernemers voor ons kiezen
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-muted)',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              Snelle service, transparante voorwaarden en persoonlijk advies
            </p>
          </div>

          {/* BIG Colored Cards Carousel */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '400px',
          }}>
            <div style={{
              display: 'flex',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `translateX(-${currentBenefit * 100}%)`,
            }}>
              {benefits.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '100%',
                      padding: '0 1rem',
                    }}
                  >
                    <div
                      className="big-card"
                      style={{
                        background: item.color,
                        borderRadius: '32px',
                        padding: '4rem',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        margin: '0 auto',
                        maxWidth: '900px',
                      }}
                    >
                      <div>
                        <div style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '24px',
                          background: 'rgba(15, 23, 32, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '2.5rem',
                        }}>
                          <Icon size={48} color={item.textColor} strokeWidth={2} />
                        </div>
                        <h3 style={{
                          fontSize: '2.5rem',
                          fontWeight: 500,
                          marginBottom: '1.5rem',
                          color: item.textColor,
                        }}>
                          {item.title}
                        </h3>
                      </div>
                      <p style={{
                        fontSize: '1.375rem',
                        color: item.textColor,
                        lineHeight: 1.7,
                        opacity: 0.85,
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevBenefit}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'white',
                border: 'none',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
            >
              <ChevronLeft size={28} color="var(--color-text)" strokeWidth={2.5} />
            </button>

            <button
              onClick={nextBenefit}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'white',
                border: 'none',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
              }}
            >
              <ChevronRight size={28} color="var(--color-text)" strokeWidth={2.5} />
            </button>

            {/* Dots Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '3rem',
            }}>
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBenefit(index)}
                  style={{
                    width: currentBenefit === index ? '40px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    background: currentBenefit === index ? 'var(--color-primary)' : 'rgba(15, 23, 32, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section id="testimonials" style={{
        background: 'white',
        padding: '8rem 2rem',
        position: 'relative',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Wat ondernemers zeggen
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-muted)',
            }}>
              Echte ervaringen van echte ondernemers
            </p>
          </div>

          {/* Carousel */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background: 'var(--color-bg-tertiary)',
            padding: '4rem 3rem',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '100%',
                  padding: '0 3rem',
                  opacity: currentTestimonial === index ? 1 : 0,
                  transform: `translateX(${(index - currentTestimonial) * 100}%)`,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '2rem',
                    border: '4px solid white',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <p style={{
                  fontSize: '1.5rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                  marginBottom: '2rem',
                  maxWidth: '700px',
                  fontStyle: 'italic',
                }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    marginBottom: '0.25rem',
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'white',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <ChevronLeft size={24} color="var(--color-text)" />
            </button>

            <button
              onClick={nextTestimonial}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'white',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <ChevronRight size={24} color="var(--color-text)" />
            </button>

            {/* Dots Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.75rem',
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  style={{
                    width: currentTestimonial === index ? '32px' : '12px',
                    height: '12px',
                    borderRadius: '6px',
                    background: currentTestimonial === index ? 'var(--color-primary)' : 'rgba(15, 23, 32, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        background: 'var(--color-bg)',
        padding: '8rem 2rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}>
              Zo werkt het
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--color-text-muted)',
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              In 4 eenvoudige stappen naar uw zakelijke financiering
            </p>
          </div>

          {/* Steps Cards */}
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
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
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
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(69, 127, 255, 0.4)',
                  }}>
                    {item.step}
                  </div>
                </div>
                <div style={{ padding: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 500,
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
      <section id="cta" style={{
        background: 'var(--color-charcoal)',
        padding: '8rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <CheckCircle size={80} color="var(--color-sun)" strokeWidth={2} style={{ marginBottom: '2rem' }} />
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            color: 'white',
          }}>
            Klaar om te starten?
          </h2>
          <p style={{
            fontSize: '1.375rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            lineHeight: 1.6,
          }}>
            Vraag binnen 2 minuten uw zakelijke financiering aan
          </p>
          <button style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '1.25rem 3rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(69, 127, 255, 0.4)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(69, 127, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(69, 127, 255, 0.4)';
          }}>
            Start je aanvraag nu
            <ArrowRight size={24} />
          </button>
    </div>
      </section>

      <Footer />
      <StickyCTA label="Aanvraag starten" useDrawer={true} />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .big-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </>
  );
}
