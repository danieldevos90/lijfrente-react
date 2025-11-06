import React from 'react';
import Image from 'next/image';
import './FeatureCard.css';

interface FeatureCardProps {
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

const FeatureCard: React.FC<FeatureCardProps> = ({
  backgroundImage,
  iconImage,
  iconEmoji,
  badgeText,
  badgeColor = '#e9d5ff',
  badgePosition = 'top-left',
  overlayText,
  overlayColor = '#d1fae5',
  overlayIcon,
}) => {
  const getPositionClasses = (position: string) => {
    const positions: Record<string, string> = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positions[position] || positions['top-left'];
  };

  return (
    <div className="feature-card relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <div className="relative w-full h-full" style={{ minHeight: '400px' }}>
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alternativeText || 'Feature image'}
          fill
          className="object-cover"
        />
        
        {/* Badge Overlay */}
        <div
          className={`badge-overlay absolute ${getPositionClasses(badgePosition)} flex items-center gap-3 px-4 py-2 rounded-full shadow-md backdrop-blur-sm`}
          style={{ backgroundColor: badgeColor }}
        >
          {/* Icon Circle */}
          {(iconImage || iconEmoji) && (
            <div className="icon-circle flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
              {iconImage ? (
                <Image
                  src={iconImage.url}
                  alt={iconImage.alternativeText || 'Icon'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl">{iconEmoji}</span>
              )}
            </div>
          )}
          
          {/* Badge Text */}
          <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">
            {badgeText}
          </span>
        </div>

        {/* Bottom Overlay Text */}
        {overlayText && (
          <div
            className="overlay-text absolute bottom-0 left-0 right-0 px-6 py-4 backdrop-blur-sm"
            style={{ backgroundColor: overlayColor }}
          >
            <div className="flex items-center gap-2">
              {overlayIcon && (
                <span className="text-xl flex-shrink-0">{overlayIcon}</span>
              )}
              <span className="text-base font-medium text-gray-900">
                {overlayText}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;

