/**
 * Loading UI for Next.js App Router streaming (nextjs-app-router-patterns)
 * 
 * This component is shown while the page is loading.
 * It enables streaming and progressive rendering.
 */
export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary, #ffffff)',
      }}
      role="status"
      aria-label="Pagina wordt geladen"
    >
      {/* Skeleton loader for hero section */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '2rem',
        }}
      >
        {/* Header skeleton */}
        <div
          style={{
            height: '64px',
            backgroundColor: 'var(--color-bg-secondary, #f5f5f5)',
            borderRadius: '8px',
            marginBottom: '2rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        
        {/* Hero skeleton */}
        <div
          style={{
            height: '400px',
            backgroundColor: 'var(--color-bg-secondary, #f5f5f5)',
            borderRadius: '16px',
            marginBottom: '2rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        
        {/* Content skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '200px',
                backgroundColor: 'var(--color-bg-secondary, #f5f5f5)',
                borderRadius: '12px',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
