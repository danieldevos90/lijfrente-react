"use client";
import React from 'react';
import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  email?: string;
  linkedin?: string;
}

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  members: TeamMember[];
  backgroundColor?: string;
}

export default function TeamSection({
  title = "Ons team",
  subtitle = "Ontmoet de mensen achter GeldGeregeld",
  members,
  backgroundColor = 'var(--color-bg)'
}: TeamSectionProps) {
  return (
    <section style={{
      background: backgroundColor,
      padding: '8rem 0',
      position: 'relative',
    }}>
      <div style={{ margin: '0 auto', padding: '0 2rem', maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '5rem', 
          paddingLeft: '2rem', 
          paddingRight: '2rem', 
          maxWidth: '800px', 
          margin: '0 auto 5rem' 
        }}>
          <h2 style={{
            fontFamily: 'PP Neue Montreal, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.75rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '1rem',
            color: 'var(--color-text)',
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Team Members Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '3rem',
        }}>
          {members.map((member, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '.625rem',
                padding: '2.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              className="team-member-card"
            >
              {/* Profile Image */}
              <div style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '2rem',
                border: '4px solid #f9f9f8',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}>
                {member.imageUrl ? (
                  <Image
                    src={getStrapiImageUrl(member.imageUrl)}
                    alt={member.name}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    unoptimized={member.imageUrl.includes('strapiapp.com')}
                    onError={(e) => {
                      // Hide image on error, show fallback
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                {!member.imageUrl && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #457fff 0%, #0f1720 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    fontWeight: 600,
                    color: 'white',
                  }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 style={{
                fontFamily: 'PP Neue Montreal, sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                color: 'var(--color-text)',
              }}>
                {member.name}
              </h3>

              {/* Role */}
              <p style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                color: '#457fff',
                fontWeight: '600',
                marginBottom: '1.5rem',
              }}>
                {member.role}
              </p>

              {/* Bio */}
              <p style={{
                fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)',
                lineHeight: 1.7,
                color: 'var(--color-text-muted)',
                marginBottom: '1.5rem',
                flex: 1,
              }}>
                {member.bio}
              </p>

              {/* Social Links */}
              {(member.email || member.linkedin) && (
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: 'auto',
                }}>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#f9f9f8',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#457fff';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9f9f8';
                        e.currentTarget.style.color = 'var(--color-text)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      aria-label={`Email ${member.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#f9f9f8',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#0077b5';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9f9f8';
                        e.currentTarget.style.color = 'var(--color-text)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                      aria-label={`LinkedIn ${member.name}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .team-member-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        @media (max-width: 768px) {
          .team-member-card {
            min-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
