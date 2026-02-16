import { getTeamMembers, getStrapiImageUrl } from '@/lib/strapi-cms';
import TeamSection from './TeamSection';

const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || 'geldgeregeld';

interface TeamSectionServerProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
}

export default async function TeamSectionServer({
  title,
  subtitle,
  backgroundColor
}: TeamSectionServerProps) {
  const isDev = process.env.NODE_ENV === 'development';
  
  // Fetch team members from Strapi (no fallback).
  const teamMembers = await getTeamMembers(SITE_ID, {
    next: { revalidate: 60 }, // Cache for 1 minute (reduced for faster updates)
  });

  if (isDev) {
    console.log('[TeamSectionServer] Fetched team members:', teamMembers.length);
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
      const aOrder = aMember ? (((aMember.attributes || aMember) as any).order || 0) : 999;
      const bOrder = bMember ? (((bMember.attributes || bMember) as any).order || 0) : 999;
      return aOrder - bOrder;
    });
  }
  
  // No fallback: require Strapi data.
  if (members.length === 0) {
    throw new Error('[TeamSectionServer] No team members returned from Strapi (no fallback enabled).');
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
