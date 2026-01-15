'use client';

import { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';

interface PasswordProtectionProps {
  children: ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get password from environment variable
  const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'lekkergeld';

  useEffect(() => {
    // Check localStorage when component mounts
    if (typeof window !== 'undefined') {
      const verified = localStorage.getItem('site_password_verified');
      if (verified === 'true') {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('=== PASSWORD DEBUG ===');
    console.log('Entered length:', password.length);
    console.log('Expected length:', CORRECT_PASSWORD.length);
    console.log('Match:', password === CORRECT_PASSWORD);
    console.log('Env var available:', !!process.env.NEXT_PUBLIC_SITE_PASSWORD);

    if (password === CORRECT_PASSWORD) {
      console.log('✅ Password correct!');
      localStorage.setItem('site_password_verified', 'true');
      setIsAuthenticated(true);
    } else {
      console.log('❌ Password incorrect!');
      setError('Onjuist wachtwoord');
      setPassword('');
    }
  };

  // Don't show anything while checking localStorage
  if (loading) {
    return null;
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={styles.overlay}>
        <div style={styles.container}>
          <div style={styles.iconWrapper}>
            <Image 
              src="/icons/SVG/interface/lock.svg" 
              alt="Beveiligd" 
              width={72} 
              height={72}
              style={{ opacity: 1 }}
            />
          </div>
          <h1 style={styles.title}>Beveiligde Toegang</h1>
          <p style={styles.subtitle}>Voer het wachtwoord in om door te gaan</p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wachtwoord"
              style={styles.input}
              autoFocus
            />
            
            {error && <p style={styles.error}>{error}</p>}
            
            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: isHovered ? '#2a2c2d' : '#1e2021',
              }}
              disabled={!password}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Toegang Verkrijgen
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show the actual site content
  return <>{children}</>;
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f9f9f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: 'PP Neue Montreal, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  container: {
    textAlign: 'center',
    padding: '3rem',
    maxWidth: '480px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  iconWrapper: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: '400',
    lineHeight: '1.1',
    margin: '0 0 1rem',
    color: '#1e2021',
    fontFamily: 'PP Neue Montreal, sans-serif',
  },
  subtitle: {
    fontSize: '1.125rem',
    fontWeight: '300',
    color: '#6c737a',
    margin: '0 0 2.5rem',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  input: {
    padding: '1rem 1.25rem',
    fontSize: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#1e2021',
  },
  button: {
    border: 'none',
    backgroundColor: '#1e2021',
    color: 'white',
    textAlign: 'center',
    borderRadius: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '14rem',
    padding: '1.25rem 2.5rem',
    fontFamily: 'Public Sans Variable, sans-serif',
    fontSize: '18px',
    fontWeight: '400',
    lineHeight: '1rem',
    transition: 'all .28s',
    display: 'flex',
    cursor: 'pointer',
    margin: '0 auto',
  },
  error: {
    color: '#dc3545',
    fontSize: '0.875rem',
    margin: '0',
  },
};
