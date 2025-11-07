import React from 'react';
import FeatureCard from '../FeatureCard';

interface FeatureCardData {
  id: number;
  backgroundImage: {
    url: string;
    alternativeText?: string;
  };
  iconImage?: {
    url: string;
    alternativeText?: string;
  };
  iconEmoji?: string;
  badgeText: string;
  badgeColor?: string;
  badgePosition?: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  overlayText?: string;
  overlayColor?: string;
  overlayIcon?: string;
}

interface FeatureShowcaseProps {
  title?: string;
  description?: string;
  featureCards: FeatureCardData[];
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'slider';
  backgroundColor?: string;
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  title,
  description,
  featureCards,
  layout = 'grid-2',
  backgroundColor = '#ffffff',
}) => {
  const getGridClasses = () => {
    const layouts: Record<string, string> = {
      'grid-2': 'grid-cols-1 md:grid-cols-2',
      'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      'slider': 'flex overflow-x-auto snap-x snap-mandatory',
    };
    return layouts[layout] || layouts['grid-2'];
  };

  return (
    <section
      className="feature-showcase py-16 px-4 md:px-8"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Feature Cards Grid */}
        <div className={`grid ${getGridClasses()} gap-8`}>
          {featureCards.map((card) => (
            <FeatureCard
              key={card.id}
              backgroundImage={card.backgroundImage}
              iconImage={card.iconImage}
              iconEmoji={card.iconEmoji}
              badgeText={card.badgeText}
              badgeColor={card.badgeColor}
              badgePosition={card.badgePosition}
              overlayText={card.overlayText}
              overlayColor={card.overlayColor}
              overlayIcon={card.overlayIcon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;




