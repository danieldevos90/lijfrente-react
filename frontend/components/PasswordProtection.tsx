'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PasswordProtectionProps {
  children: ReactNode;
}

// SIMPLE PASSWORD CHECK - Change password here
const CORRECT_PASSWORD = 'test123';

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  console.log('[PasswordProtection] Component mounted, loading:', loading);

  useEffect(() => {
    console.log('[PasswordProtection] useEffect running');
    // Check localStorage when component mounts
    if (typeof window !== 'undefined') {
      console.log('[PasswordProtection] Window is defined');
      const verified = localStorage.getItem('site_password_verified');
      console.log('[PasswordProtection] localStorage value:', verified);
      if (verified === 'true') {
        console.log('[PasswordProtection] User already authenticated');
        setIsAuthenticated(true);
      } else {
        console.log('[PasswordProtection] User NOT authenticated');
      }
      setLoading(false);
    } else {
      console.log('[PasswordProtection] Window is undefined (SSR)');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('[PasswordProtection] Form submitted with password:', password);

    if (password === CORRECT_PASSWORD) {
      console.log('[PasswordProtection] Password correct, saving to localStorage');
      localStorage.setItem('site_password_verified', 'true');
      setIsAuthenticated(true);
    } else {
      console.log('[PasswordProtection] Password incorrect');
      setError('Invalid password');
      setPassword('');
    }
  };

  console.log('[PasswordProtection] Current state - loading:', loading, 'isAuthenticated:', isAuthenticated);

  // Don't show anything while checking localStorage
  if (loading) {
    console.log('[PasswordProtection] Still loading, returning null');
    return null;
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    console.log('[PasswordProtection] Not authenticated, showing password form');
    return (
      <div style={styles.overlay}>
        <div style={styles.container}>
          <h1 style={styles.title}>🔐</h1>
          <h2 style={styles.subtitle}>Password Required</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
              autoFocus
            />
            
            {error && <p style={styles.error}>{error}</p>}
            
            <button
              type="submit"
              style={styles.button}
              disabled={!password}
            >
              Access Site
            </button>
          </form>
          
          {/* Debug panel */}
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            fontSize: '12px',
            textAlign: 'left',
            fontFamily: 'monospace',
            color: '#666'
          }}>
            <div>Debug Info:</div>
            <div>Loading: {String(loading)}</div>
            <div>Authenticated: {String(isAuthenticated)}</div>
            <div>Password: {password ? password.length + ' chars' : 'empty'}</div>
            <div>Expected: {CORRECT_PASSWORD}</div>
            <div>Window defined: {String(typeof window !== 'undefined')}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show the actual site content
  console.log('[PasswordProtection] User authenticated, showing site content');
  return <>{children}</>;
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  container: {
    textAlign: 'center',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '60px',
    margin: '0 0 20px',
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0f1720',
    margin: '0 0 30px',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    margin: '0',
  },
};
