"use client";
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Zap, Lock, FileText } from 'lucide-react';

interface TrustBadge {
  icon: string;
  text: string;
  description?: string;
  color?: string;
  textColor?: string;
}

const trustIconMap: Record<string, React.ComponentType<any>> = {
  '✓': CheckCircle,
  '⚡': Zap,
  '🔒': Lock,
  '📋': FileText,
};

// Check if icon is an SVG path (starts with /icons/ or contains .svg)
const isSvgPath = (icon: string): boolean => {
  return icon.startsWith('/icons/') || icon.includes('.svg') || icon.startsWith('/');
};

interface TrustBadgesProps {
  badges: TrustBadge[];
  variant?: 'default' | 'centered' | 'compact';
}

export default function TrustBadges({ badges, variant = 'default' }: TrustBadgesProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
      margin: '0 auto',
    }}>
"use client";
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Zap, Lock, FileText } from 'lucide-react';

interface TrustBadge {
  icon: string;
  text: string;
  description?: string;
  color?: string;
  textColor?: string;
}

const trustIconMap: Record<string, React.ComponentType<any>> = {
  '✓': CheckCircle,
  '⚡': Zap,
  '🔒': Lock,
  '📋': FileText,
};

// Check if icon is an SVG path (starts with /icons/ or contains .svg)
const isSvgPath = (icon: string): boolean => {
  return icon.startsWith('/icons/') || icon.includes('.svg') || icon.startsWith('/');
};

interface TrustBadgesProps {
  badges: TrustBadge[];
  variant?: 'default' | 'centered' | 'compact';
}

export default function TrustBadges({ badges, variant = 'default' }: TrustBadgesProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
      margin: '0 auto',
    }}>
      {badges.map((badge, index) => {
        const isColored = index % 2 === 0;
        const bgColor = isColored && badge.color ? badge.color : 'white';
        const textColorMain = (isColored && badge.textColor) ? badge.textColor : 'var(--color-text)';
        const hasBorder = !badge.color || bgColor === 'white'; // Cards without color get border
        
        return (
          <div
            key={index}
            style={{
              background: bgColor,
              borderRadius: '.625rem',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              minHeight: '350px',
              border: hasBorder ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
            }}
          >
            <div style={{ 
              width: '6rem', 
              height: '6rem', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSvgPath(badge.icon) ? (
                <Image 
                  src={badge.icon} 
                  alt={badge.text}
                  width={96}
                  height={96}
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                    opacity: 1,
                  }}
                />
              ) : trustIconMap[badge.icon] ? (
                React.createElement(trustIconMap[badge.icon], { size: 96 })
              ) : (
                <span style={{ fontSize: '96px' }}>{badge.icon}</span>
              )}
            </div>
            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: textColorMain,
            }}>
              {badge.text}
            </h3>
            {badge.description && (
              <p style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                fontWeight: 300,
                color: textColorMain,
                lineHeight: 1.7,
                opacity: 0.85,
                margin: 0,
              }}>
                {badge.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
        
        return (
          <div
            key={index}
            style={{
              background: bgColor,
              borderRadius: '.625rem',
              padding: '3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              minHeight: '350px',
              border: hasBorder ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
            }}
          >
            <div style={{ 
              width: '6rem', 
              height: '6rem', 
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isSvgPath(badge.icon) ? (
                <Image 
                  src={badge.icon} 
                  alt={badge.text}
                  width={96}
                  height={96}
                  style={{
                    filter: 'brightness(0) saturate(100%)',
                    opacity: 1,
                  }}
                />
              ) : trustIconMap[badge.icon] ? (
                React.createElement(trustIconMap[badge.icon], { size: 96 })
              ) : (
                <span style={{ fontSize: '96px' }}>{badge.icon}</span>
              )}
            </div>
            <h3 style={{
              fontFamily: 'PP Neue Montreal, sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: textColorMain,
            }}>
              {badge.text}
            </h3>
            {badge.description && (
              <p style={{
                fontSize: 'clamp(0.9375rem, 2vw, 1.0625rem)',
                fontWeight: 300,
                color: textColorMain,
                lineHeight: 1.7,
                opacity: 0.85,
                margin: 0,
              }}>
                {badge.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
