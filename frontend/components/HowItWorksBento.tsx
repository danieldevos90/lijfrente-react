"use client";
import React from 'react';
import Image from 'next/image';

interface BentoItem {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  iconPath: string;
  gridArea: string;
}

export default function HowItWorksBento() {
  const bentoItems: BentoItem[] = [
    {
      title: 'Aanvraag indienen',
      description: 'Vul in 2 minuten het online formulier in. Simpel, snel en geen papierwerk. We vragen alleen wat we echt nodig hebben voor uw zakelijke financiering.',
      backgroundColor: '#fff2b2',
      textColor: '#5e5515',
      iconPath: '/icons/SVG/files/file-form.svg',
      gridArea: 'aanvraag',
    },
    {
      title: 'Snelle beoordeling',
      description: 'Ons team beoordeelt uw aanvraag direct. Met behulp van slimme technologie en menselijke expertise krijgt u binnen 4 uur een eerste reactie.',
      backgroundColor: '#aad5fc',
      textColor: '#0f1720',
      iconPath: '/icons/SVG/interface/search.svg',
      gridArea: 'beoordeling',
    },
    {
      title: 'Transparant voorstel',
      description: 'U ontvangt een helder voorstel met alle voorwaarden, rentetarieven en aflosschema. Geen verborgen kosten of verrassingen achteraf.',
      backgroundColor: '#bbe7be',
      textColor: '#114e0b',
      iconPath: '/icons/SVG/interface/checklist.svg',
      gridArea: 'voorstel',
    },
    {
      title: 'Direct uitbetaling',
      description: 'Zodra u akkoord gaat, zorgen we voor snelle uitbetaling. Het geld staat meestal binnen 24 uur op uw zakelijke rekening.',
      backgroundColor: '#d7d0ff',
      textColor: '#3b0b5e',
      iconPath: '/icons/SVG/finance/cash.svg',
      gridArea: 'uitbetaling',
    },
  ];

  return (
    <section id="how-it-works-bento" style={{
      background: 'var(--color-bg)',
      padding: '8rem 2rem',
    }}>
      <div style={{ margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{
            fontFamily: '"PP Neue Montreal", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.1,
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

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '2rem',
          gridTemplateAreas: `
            "aanvraag beoordeling"
            "voorstel uitbetaling"
          `,
        }}
        className="bento-grid"
        >
          {bentoItems.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: item.backgroundColor,
                borderRadius: '1.5rem',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '400px',
                gridArea: item.gridArea,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: 'none',
              }}
              className="bento-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Top Section - Icon */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '2rem',
                minHeight: '140px',
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Image
                    src={item.iconPath}
                    alt={item.title}
                    width={120}
                    height={120}
                    style={{
                      filter: 'brightness(0) saturate(100%)',
                      opacity: 1,
                      transform: 'scale(0.85)',
                    }}
                  />
                </div>
              </div>

              {/* Bottom Section - Content */}
              <div>
                <h3 style={{
                  fontFamily: 'PP Neue Montreal, sans-serif',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 500,
                  lineHeight: 1.1,
                  marginBottom: '1rem',
                  color: item.textColor,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: item.textColor,
                  lineHeight: 1.6,
                  opacity: 0.85,
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            grid-template-areas: 
              "aanvraag"
              "beoordeling"
              "voorstel"
              "uitbetaling" !important;
          }
          
          .bento-card {
            min-height: 360px !important;
          }
        }

        @media (max-width: 640px) {
          .bento-card {
            padding: 2rem !important;
            min-height: 300px !important;
          }
          
          #how-it-works-bento {
            padding: 4rem 1rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .bento-card {
            min-height: 280px !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

