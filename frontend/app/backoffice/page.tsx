'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function BackofficeLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/backoffice/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/backoffice/leads');
      } else {
        setError('Ongeldig wachtwoord');
      }
    } catch {
      setError('Er ging iets mis');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bo-login">
      <form onSubmit={handleSubmit} className="bo-login-card">
        <div className="bo-login-logo">
          <img src="/logomark.svg" alt="" width={48} height={48} />
          <span className="bo-login-brand">
            <strong>geld</strong>geregeld
          </span>
        </div>
        <h1 className="bo-login-title">Backoffice</h1>
        <label className="bo-login-label" htmlFor="password">
          Wachtwoord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bo-input"
          autoFocus
          required
        />
        {error && <p className="bo-login-error">{error}</p>}
        <button type="submit" className="bo-btn-primary" disabled={loading}>
          {loading ? 'Laden...' : 'Inloggen'}
        </button>
      </form>

      <style>{`
        .bo-login {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
        }
        .bo-login-card {
          width: 100%;
          max-width: 380px;
          background: #fff;
          border-radius: var(--radius-lg, 12px);
          box-shadow: var(--shadow-lg);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .bo-login-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .bo-login-brand {
          font-size: 1.25rem;
          color: var(--color-charcoal, #1e2021);
          letter-spacing: 0.02em;
        }
        .bo-login-brand strong { font-weight: 700; }
        .bo-login-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-charcoal, #1e2021);
        }
        .bo-login-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-muted, #6c737a);
        }
        .bo-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1.5px solid var(--color-border-gray, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: border-color var(--transition-fast, 150ms ease);
          background: #fff;
          color: var(--color-text, #1e2021);
          box-sizing: border-box;
        }
        .bo-input:focus {
          border-color: var(--color-brand, #00c800);
          box-shadow: 0 0 0 3px rgba(0, 200, 0, 0.1);
        }
        .bo-login-error {
          margin: 0;
          color: var(--color-error, #ff0000);
          font-size: 0.875rem;
        }
        .bo-btn-primary {
          padding: 0.625rem 1.5rem;
          background: var(--color-charcoal, #1e2021);
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background var(--transition-fast, 150ms ease);
          margin-top: 0.5rem;
        }
        .bo-btn-primary:hover:not(:disabled) {
          background: var(--color-charcoal-hover, #2a2c2d);
        }
        .bo-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
