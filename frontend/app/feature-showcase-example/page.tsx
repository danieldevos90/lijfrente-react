import React from 'react';
import FeatureShowcase from '@/components/sections/FeatureShowcase';

/**
 * Example page demonstrating the Feature Showcase component
 * 
 * This shows how to use the component with static data.
 * In production, this data would come from Strapi.
 */
export default function FeatureShowcaseExample() {
  // Example data matching the images shown
  const exampleData = {
    title: "Experience Seamless Payments",
    description: "See how our platform makes managing your finances effortless and transparent.",
    featureCards: [
      {
        id: 1,
        backgroundImage: {
          url: '/images/pexels-tima-miroshnichenko-6693637.jpg',
          alternativeText: 'Couple receiving payment notification'
        },
        iconImage: {
          url: '/images/pexels-sidesimagery-3351927.jpg',
          alternativeText: 'User avatar'
        },
        badgeText: '+$210.10',
        badgeColor: '#e9d5ff', // Light purple
        badgePosition: 'top-left' as const,
      },
      {
        id: 2,
        backgroundImage: {
          url: '/images/pexels-yankrukov-4458386.jpg',
          alternativeText: 'Woman at computer completing transaction'
        },
        iconEmoji: '✓',
        badgeText: '',
        overlayText: 'Wage disbursement complete',
        overlayColor: '#d1fae5', // Light green
        overlayIcon: '✓',
        badgePosition: 'bottom-center' as const,
      }
    ],
    layout: 'grid-2' as const,
    backgroundColor: '#f9fafb'
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Feature Showcase Component
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A dynamic component for displaying beautiful feature cards with images, icons, and overlays.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="#example" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              See Example
            </a>
            <a 
              href="/FEATURE_SHOWCASE_README.md" 
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Read Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Example Implementation */}
      <div id="example">
        <FeatureShowcase {...exampleData} />
      </div>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Financial Services</h3>
              <p className="text-gray-600">
                Showcase payment notifications, transactions, and financial milestones
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">App Features</h3>
              <p className="text-gray-600">
                Display app screenshots with feature highlights and annotations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Product Benefits</h3>
              <p className="text-gray-600">
                Highlight key features and benefits with visual context
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Examples */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Flexible Configuration
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Layout Options</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 2-column grid (desktop)</li>
                <li>✓ 3-column grid</li>
                <li>✓ 4-column grid</li>
                <li>✓ Horizontal slider</li>
                <li>✓ Fully responsive</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Customization</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Custom badge colors</li>
                <li>✓ 7 badge positions</li>
                <li>✓ Icon or emoji support</li>
                <li>✓ Optional overlay text</li>
                <li>✓ Background colors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Easy to Use
          </h2>
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`<FeatureShowcase
  title="Experience Seamless Payments"
  description="See how our platform works"
  featureCards={[
    {
      backgroundImage: { url: '/image.jpg' },
      iconEmoji: '💰',
      badgeText: '+$210.10',
      badgeColor: '#e9d5ff',
      badgePosition: 'top-left'
    }
  ]}
  layout="grid-2"
/>`}
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}

