"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedStatsCards() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Animate first number (2)
            let current1 = 0;
            const interval1 = setInterval(() => {
              current1 += 1;
              setCount1(current1);
              if (current1 >= 2) clearInterval(interval1);
            }, 100);

            // Animate second number (24)
            let current2 = 0;
            const interval2 = setInterval(() => {
              current2 += 2;
              setCount2(current2);
              if (current2 >= 24) {
                setCount2(24);
                clearInterval(interval2);
              }
            }, 50);

            // Animate third number (3)
            let current3 = 0;
            const interval3 = setInterval(() => {
              current3 += 1;
              setCount3(current3);
              if (current3 >= 3) clearInterval(interval3);
            }, 150);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section 
      id="stats"
      ref={statsRef}
      style={{
        background: 'var(--color-bg)',
        padding: '8rem 2rem',
      }}
    >
      <div style={{
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        }}
        className="stats-grid"
        >
          {/* Card 1 - 2 min */}
          <div
            className="stats-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '360px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '7rem',
              fontWeight: 400,
              color: '#0f1720',
              marginBottom: '0.5rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
              lineHeight: 1,
            }}>
              {count1}
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#0f1720',
              marginBottom: '2rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
            }}>
              minuten
            </div>
            <div style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}>
              Aanvraag indienen
            </div>
          </div>

          {/* Card 2 - 24 hour */}
          <div
            className="stats-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '360px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '7rem',
              fontWeight: 400,
              color: '#0f1720',
              marginBottom: '0.5rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
              lineHeight: 1,
            }}>
              {count2}
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#0f1720',
              marginBottom: '2rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
            }}>
              uur
            </div>
            <div style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}>
              Aanbod ontvangen
            </div>
          </div>

          {/* Card 3 - 3-5 days */}
          <div
            className="stats-card"
            style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '4rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '360px',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '7rem',
              fontWeight: 400,
              color: '#0f1720',
              marginBottom: '0.5rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
              lineHeight: 1,
            }}>
              {count3}-5
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#0f1720',
              marginBottom: '2rem',
              fontFamily: 'PP Neue Montreal, sans-serif',
            }}>
              dagen
            </div>
            <div style={{
              fontSize: '1.125rem',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}>
              Geld op rekening
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          
          .stats-card {
            min-height: 300px !important;
            padding: 3rem 2rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-card {
            min-height: 250px !important;
            padding: 2rem 1.5rem !important;
          }
          
          .stats-card div[style*="fontSize: '7rem'"] {
            font-size: 4.5rem !important;
          }
          
          .stats-card div[style*="fontSize: '2.5rem'"] {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </section>
  );
}

