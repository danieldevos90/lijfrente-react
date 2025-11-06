"use client";
import React, { useState } from 'react';
import TransparentHeader from '../components/TransparentHeader';
import Footer from '../components/Footer';
import { Zap, Shield, Clock, TrendingUp, Users, Award, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const StickyCTA = dynamic(() => import('../components/StickyCTA'), { ssr: false });

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
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
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{
              border: '1px solid var(--color-charcoal)',
              backgroundColor: 'var(--color-charcoal)',
              color: 'white',
              textAlign: 'center',
              borderRadius: '.25rem',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '10.5rem',
              maxHeight: '2.75rem',
              padding: '1rem 1.5rem',
              fontFamily: 'Public Sans Variable, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              lineHeight: 1,
              transition: 'border-color .28s, background-color .28s',
              display: 'flex',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
            }}>
              Start aanvraag
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Carousel Section */}
      <section id="benefits" style={{
        background: 'var(--color-bg)',
        padding: '8rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
            <h2 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: '3.75rem',
              fontWeight: 400,
              lineHeight: 1,
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

          {/* Benefits Cards Carousel */}
          <div style={{
            position: 'relative',
            overflow: 'auto',
            minHeight: '560px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
            marginLeft: '-4rem',
            marginRight: '-4rem',
            paddingLeft: '4rem',
            paddingRight: '4rem',
          }}
          className="benefits-scroll-container"
          >
            <div style={{
              display: 'flex',
              gap: '2rem',
              paddingBottom: '1rem',
            }}>
              {benefits.map((item, index) => {
                const Icon = item.icon;
                const isColored = index % 2 === 0;
                const bgColor = isColored ? item.color : 'white';
                const textColorMain = isColored ? item.textColor : 'var(--color-text)';
                const iconBgColor = isColored ? 'rgba(15, 23, 32, 0.08)' : item.color;
                const iconColor = isColored ? item.textColor : item.textColor;
                
                return (
                  <div
                    key={index}
                    style={{
                      minWidth: '35rem',
                      maxWidth: '35rem',
                      flex: '0 0 auto',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <div
                      className="benefit-card"
                      style={{
                        background: bgColor,
                        borderRadius: '.625rem',
                        padding: '5rem 5.625rem',
                        width: '35rem',
                        height: '35rem',
                        display: 'flex',
                        flexFlow: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Icon size={40} color="black" strokeWidth={1} style={{ marginBottom: '2rem', width: '9rem', height: 'auto' }} />
                      <h3 style={{
                        fontFamily: 'PP Neue Montreal, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 400,
                        lineHeight: 1.08,
                        marginBottom: '1.5rem',
                        color: textColorMain,
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontSize: '1.125rem',
                        fontWeight: 300,
                        color: textColorMain,
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
          </div>
        </div>
      </section>

      {/* Feature Section with Image */}
      <section id="feature" style={{
        background: 'white',
        padding: '8rem 2rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}>
            {/* Image */}
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: '600px',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              background: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop') center/cover`,
            }}>
            </div>

            {/* Text Content */}
            <div style={{
              padding: '2rem',
            }}>
              <h2 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: '3.75rem',
                fontWeight: 400,
                lineHeight: 1,
                marginBottom: '2rem',
                color: 'var(--color-text)',
              }}>
                Earned wage access
              </h2>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: 300,
                color: 'var(--color-text)',
                lineHeight: 1.7,
                opacity: 0.85,
                marginBottom: '3rem',
              }}>
                Employees have the flexibility to withdraw up to 50% of their earned wages at any moment, presenting a dependable option for immediate financial requirements. It grants real-time visibility into accrued wages.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button style={{
                  border: '1px solid var(--color-charcoal)',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '.25rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: '10.5rem',
                  maxHeight: '2.75rem',
                  padding: '1rem 1.5rem',
                  fontFamily: 'Public Sans Variable, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1,
                  transition: 'border-color .28s, background-color .28s',
                  display: 'flex',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
                }}>
                  Learn more
                </button>
              </div>
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

            {/* Navigation Buttons - Simple round style */}
            <button
              onClick={prevTestimonial}
              aria-label="Vorige"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#0f1720',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronLeft size={24} color="white" strokeWidth={2} />
            </button>

            <button
              onClick={nextTestimonial}
              aria-label="Volgende"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#0f1720',
                border: 'none',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <ChevronRight size={24} color="white" strokeWidth={2} />
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
            border: '1px solid var(--color-charcoal)',
            backgroundColor: 'var(--color-charcoal)',
            color: 'white',
            textAlign: 'center',
            borderRadius: '.25rem',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '10.5rem',
            maxHeight: '2.75rem',
            padding: '1rem 1.5rem',
            fontFamily: 'Public Sans Variable, sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1,
            transition: 'border-color .28s, background-color .28s',
            display: 'flex',
            gap: '0.75rem',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 32, 0.85)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-charcoal)';
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

        .benefits-scroll-container::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 640px) {
          .benefits-scroll-container > div > div {
            min-width: 320px !important;
            max-width: 320px !important;
          }
        }
      `}</style>
    </>
  );
}
