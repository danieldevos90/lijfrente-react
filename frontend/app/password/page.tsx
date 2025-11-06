'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { theme } from '../../theme';
import './password.css';

// Dynamic metadata to prevent prerendering
export const dynamic = 'force-dynamic';

function PasswordForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Password is correct, redirect to the original page
        router.push(redirectTo);
        router.refresh();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-page">
      <div className="password-container">
        <div className="password-card">
          <div className="password-header">
            <div className="lock-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="password-title">Site Under Development</h1>
            <p className="password-description">
              This site is currently in development. Please enter the password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Enter password"
                autoComplete="off"
                autoFocus
                disabled={isLoading}
              />
              {error && <p className="error-message">{error}</p>}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="password-footer">
            <p className="footer-text">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Your access is secured and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense fallback={
      <div className="password-page">
        <div className="password-container">
          <div className="password-card">
            <div className="password-header">
              <div className="lock-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="password-title">Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    }>
      <PasswordForm />
    </Suspense>
  );
}
