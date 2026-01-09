import { getTeamMembers, getStrapiImageUrl } from '@/lib/strapi-cms';
import TeamSection from './TeamSection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

interface TeamSectionServerProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
}

// Fallback team members data (used if Strapi is unavailable)
const FALLBACK_TEAM_MEMBERS = [
  {
    name: 'Erik de Vos',
    role: 'Oprichter & CEO',
    bio: 'Met meer dan 15 jaar ervaring in de financiële sector heeft Erik een diepgaand begrip van de uitdagingen waar MKB-ondernemers mee te maken hebben. Zijn visie is om zakelijke financiering toegankelijk, transparant en snel te maken voor elke ondernemer.',
    email: 'info@geldgeregeld.nl',
    linkedin: 'https://www.linkedin.com/in/erik-de-vos-425ab120/',
    imageUrl: '/images/Erik.jpeg',
  },
  {
    name: 'Jan Dijkerman',
    role: 'Mede-oprichter & Consultant',
    bio: 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
    email: 'info@geldgeregeld.nl',
    linkedin: 'https://www.linkedin.com/in/jan-dijkerman-b3a771393/',
    imageUrl: '/images/Jan.jpeg',
  },
];

export default async function TeamSectionServer({
  title,
  subtitle,
  backgroundColor
}: TeamSectionServerProps) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Fetch team members from Strapi
  let teamMembers = [];
  let useFallback = false;
  
  try {
    teamMembers = await getTeamMembers(SITE_ID, {
      next: { revalidate: 60 } // Cache for 1 minute (reduced for faster updates)
    });
    
    if (isDev) {
      console.log('[TeamSectionServer] Fetched team members:', teamMembers.length);
    }
  } catch (error) {
    if (isDev) {
      console.warn('[TeamSectionServer] Failed to fetch from Strapi, using fallback:', error);
    }
    useFallback = true;
  }

  // Transform Strapi data to component format
  let members: any[] = [];
  
  if (teamMembers.length > 0) {
    if (isDev) {
      console.log('[TeamSectionServer] Raw team members count:', teamMembers.length);
      console.log('[TeamSectionServer] First member sample:', JSON.stringify(teamMembers[0], null, 2).substring(0, 500));
    }
    
    members = teamMembers.map((member: any) => {
      // Handle both Strapi v4 (nested) and v5 (flat) structures
      const memberData = member.attributes || member;
      
      // Extract image URL from Strapi structure (handle different formats)
      let imageUrl: string | undefined;
      const image = memberData.image;
      
      if (image) {
        // Strapi v5: image is flat with url directly (most common)
        if (image.url) {
          imageUrl = image.url;
        }
        // Strapi v4: image.data.attributes.url
        else if (image.data?.attributes?.url) {
          imageUrl = image.data.attributes.url;
        }
        // Alternative v4 structure: image.data.url
        else if (image.data?.url) {
          imageUrl = image.data.url;
        }
        // Another alternative: image.attributes.url
        else if (image.attributes?.url) {
          imageUrl = image.attributes.url;
        }
        
        if (isDev && imageUrl) {
          console.log(`[TeamSectionServer] Extracted image URL for ${memberData.name}: ${imageUrl}`);
        }
      }
      
      // Image URL from Strapi should already be absolute, but ensure it is
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = getStrapiImageUrl(imageUrl);
      }
      
      // Format role: convert "mede-oprichter/consultant" to "Mede-oprichter & Consultant"
      let formattedRole = memberData.role || '';
      if (formattedRole.toLowerCase().includes('mede-oprichter/consultant') || 
          formattedRole.toLowerCase().includes('mede-oprichter')) {
        formattedRole = formattedRole
          .replace(/mede-oprichter\/consultant/gi, 'Mede-oprichter & Consultant')
          .replace(/mede-oprichter/gi, 'Mede-oprichter');
      }
      
      const transformedMember = {
        name: memberData.name || '',
        role: formattedRole,
        bio: memberData.bio || '',
        imageUrl: imageUrl,
        email: memberData.email || '',
        linkedin: memberData.linkedin || '',
      };
      
      if (isDev) {
        console.log('[TeamSectionServer] Transformed member:', transformedMember.name, {
          hasImage: !!imageUrl,
          imageUrl: imageUrl,
          email: transformedMember.email,
          linkedin: transformedMember.linkedin,
        });
      }
      
      return transformedMember;
    }).filter((member: any) => member.name); // Filter out invalid members
    
    // Remove duplicates by name (keep the best one)
    const seen = new Map<string, any>();
    members.forEach(member => {
      const existing = seen.get(member.name);
      if (!existing) {
        seen.set(member.name, member);
      } else {
        // Prefer member with:
        // 1. info@geldgeregeld.nl email (highest priority)
        // 2. Image URL
        // 3. LinkedIn URL
        const existingIsInfoEmail = existing.email === 'info@geldgeregeld.nl';
        const memberIsInfoEmail = member.email === 'info@geldgeregeld.nl';
        
        if (memberIsInfoEmail && !existingIsInfoEmail) {
          seen.set(member.name, member);
        } else if (!memberIsInfoEmail && existingIsInfoEmail) {
          // Keep existing
        } else {
          // Both have same email priority, check other fields
          const existingScore = (existing.imageUrl ? 3 : 0) + (existing.linkedin ? 1 : 0);
          const memberScore = (member.imageUrl ? 3 : 0) + (member.linkedin ? 1 : 0);
          if (memberScore > existingScore) {
            seen.set(member.name, member);
          }
        }
      }
    });
    members = Array.from(seen.values());
    
    // Sort by order if available
    members.sort((a, b) => {
      const aMember = teamMembers.find((m: any) => {
        const mData = m.attributes || m;
        return mData.name === a.name;
      });
      const bMember = teamMembers.find((m: any) => {
        const mData = m.attributes || m;
        return mData.name === b.name;
      });
      const aOrder = aMember ? ((aMember.attributes || aMember).order || 0) : 999;
      const bOrder = bMember ? ((bMember.attributes || bMember).order || 0) : 999;
      return aOrder - bOrder;
    });
  }
  
  // Use fallback if no members from Strapi
  if (members.length === 0) {
    if (isDev) {
      console.log('[TeamSectionServer] No members from Strapi, using fallback data');
      console.log('[TeamSectionServer] Team members fetched:', teamMembers.length);
    }
    members = FALLBACK_TEAM_MEMBERS;
  } else if (isDev) {
    console.log('[TeamSectionServer] Successfully transformed', members.length, 'members from Strapi');
  }

  // Always render the section (even with fallback data)
  return (
    <TeamSection
      title={title}
      subtitle={subtitle}
      members={members}
      backgroundColor={backgroundColor}
    />
  );
}
