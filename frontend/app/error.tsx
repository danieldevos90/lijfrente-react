'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Silently handle errors - don't log to console
  // This prevents error boundaries from logging to console
  return null;
}
