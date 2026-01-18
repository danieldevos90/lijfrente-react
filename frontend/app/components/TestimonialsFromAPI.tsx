"use client";
import { useState, useEffect } from 'react';
import TestimonialsGrid from '@/components/TestimonialsGrid';
import { getStrapiImageUrl } from '@/lib/strapi-cms';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

export default function TestimonialsFromAPI() {
  const [testimonials, setTestimonials] = useState<Array<{
    name: string;
    role: string;
    text: string;
    image: string;
    company?: string;
    rating?: number;
  }>>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`/api/strapi/testimonials?siteId=${SITE_ID}`);
        if (response.ok) {
          const data = await response.json();
          const strapiTestimonials = data.testimonials || [];
          
          if (strapiTestimonials.length > 0) {
            console.log('[TestimonialsFromAPI] Received testimonials:', strapiTestimonials.length);
            const converted = strapiTestimonials.map((t: any) => {
              // Handle both Strapi v4 (attributes) and v5 (flat) formats
              const attrs = t.attributes || t;
              let imageUrl = '/images/pexels-ketut-subiyanto-4559683.jpg';
              
              // Handle image data - can be nested or flat
              if (attrs.image) {
                const imgData = attrs.image;
                if (imgData?.data) {
                  const nestedData = imgData.data;
                  if (Array.isArray(nestedData) && nestedData.length > 0) {
                    const img = nestedData[0];
                    imageUrl = getStrapiImageUrl(img.attributes?.url || img.url);
                  } else if (nestedData?.attributes?.url) {
                    imageUrl = getStrapiImageUrl(nestedData.attributes.url);
                  } else if (nestedData?.url) {
                    imageUrl = getStrapiImageUrl(nestedData.url);
                  }
                } else if (imgData?.attributes?.url) {
                  imageUrl = getStrapiImageUrl(imgData.attributes.url);
                } else if (imgData?.url) {
                  imageUrl = getStrapiImageUrl(imgData.url);
                } else if (typeof imgData === 'string') {
                  imageUrl = imgData;
                }
              }
              
              // Data is flat (Strapi v5) - use t directly, attrs is just a fallback
              const testimonial = {
                name: t.name || attrs.name || 'Unknown',
                role: t.role || t.company || attrs.role || attrs.company || '',
                text: t.text || attrs.text || '',
                image: imageUrl,
                company: t.company || attrs.company || '',
                rating: t.rating || attrs.rating || 5
              };
              
              // Debug: log the raw data
              console.log('[TestimonialsFromAPI] Raw testimonial:', {
                raw: t,
                attrs: attrs,
                converted: testimonial
              });
              
              return testimonial;
            });
            
            const unique = converted.filter((t: any, index: number, self: any[]) => 
              index === self.findIndex((tt: any) => 
                tt.name.toLowerCase() === t.name.toLowerCase() &&
                tt.text.toLowerCase() === t.text.toLowerCase()
              )
            );
            
            const shuffled = [...unique];
            for (let i = shuffled.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            const selected = shuffled.slice(0, Math.min(6, shuffled.length));
            console.log('[TestimonialsFromAPI] Setting testimonials:', selected.length);
            setTestimonials(selected);
          } else {
            console.log('[TestimonialsFromAPI] No testimonials in response');
          }
        } else {
          console.log('[TestimonialsFromAPI] Response not OK:', response.status);
        }
      } catch (error) {
        console.error('[TestimonialsFromAPI] Fetch failed:', error);
      }
    };
    
    fetchTestimonials();
  }, []);

  console.log('[TestimonialsFromAPI] Render - testimonials count:', testimonials.length);
  
  // Always render something for debugging - show loading state or empty message
  if (testimonials.length === 0) {
    // Return a placeholder to verify component is rendering
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-slate)' }}>
        <p>Loading testimonials...</p>
      </div>
    );
  }

  return <TestimonialsGrid testimonials={testimonials} />;
}
