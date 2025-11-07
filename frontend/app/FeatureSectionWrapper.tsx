"use client";
import FeatureSection from '../components/FeatureSection';
import { useWidget } from '../components/GlobalWidgetProvider';

interface FeatureSectionWrapperProps {
  title: string;
  description: string;
  buttonText?: string;
  imagePath: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: string;
}

export default function FeatureSectionWrapper(props: FeatureSectionWrapperProps) {
  const { openDrawer } = useWidget();
  
  return (
    <FeatureSection
      {...props}
      onButtonClick={() => openDrawer('feature_section')}
    />
  );
}

