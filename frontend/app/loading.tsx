import Image from 'next/image';

/**
 * Loading UI for Next.js App Router streaming.
 *
 * Keep this lightweight: a centered brand mark + subtle dot bounce,
 * instead of a full skeleton grid that can feel "template-y".
 */
export default function Loading() {
  return (
    <div className="app-loader" role="status" aria-live="polite" aria-label="Pagina wordt geladen">
      <div className="app-loader__mark" aria-hidden="true">
        <Image src="/logomark.svg" alt="" width={56} height={56} priority />
      </div>

      <div className="app-loader__dots" aria-hidden="true">
        <span className="app-loader__dot app-loader__dot--1" />
        <span className="app-loader__dot app-loader__dot--2" />
        <span className="app-loader__dot app-loader__dot--3" />
      </div>

      <span className="sr-only">Pagina wordt geladen</span>

      <style>{`
        .app-loader {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          padding: 2.5rem 1.25rem;
          background: var(--color-bg, #ffffff);
          color: var(--color-text, #1e2021);
        }

        .app-loader__mark {
          opacity: 0.95;
          transform: translateZ(0);
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.08));
        }

        .app-loader__dots {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          height: 12px;
        }

        .app-loader__dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.65;
          animation: app-loader-bounce 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
          will-change: transform, opacity;
        }

        .app-loader__dot--2 {
          animation-delay: 0.12s;
        }

        .app-loader__dot--3 {
          animation-delay: 0.24s;
        }

        @keyframes app-loader-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.55;
          }
          40% {
            transform: translateY(-7px);
            opacity: 1;
          }
        }

        /* Minimal screen-reader-only utility (kept local to this component) */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
}
