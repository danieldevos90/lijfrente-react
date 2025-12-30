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
    email: 'erik@geldgeregeld.nl',
    linkedin: 'https://linkedin.com/in/erikdevos',
  },
  {
    name: 'Jan Dijkerman',
    role: 'Mede-oprichter & CFO',
    bio: 'Jan brengt uitgebreide expertise in risicomanagement en financiële analyse. Zijn focus ligt op het ontwikkelen van innovatieve financieringsoplossingen die perfect aansluiten bij de behoeften van moderne ondernemers.',
    email: 'jan@geldgeregeld.nl',
    linkedin: 'https://linkedin.com/in/jandijkerman',
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
      next: { revalidate: 3600 } // Cache for 1 hour
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
    members = teamMembers.map((member: any) => {
      const memberData = member.attributes || member;
      
      // Extract image URL from Strapi structure
      let imageUrl: string | undefined;
      if (memberData.image?.data?.attributes?.url) {
        imageUrl = memberData.image.data.attributes.url;
      }
      
      return {
        name: memberData.name || '',
        role: memberData.role || '',
        bio: memberData.bio || '',
        imageUrl: imageUrl,
        email: memberData.email,
        linkedin: memberData.linkedin,
      };
    }).filter((member: any) => member.name); // Filter out invalid members
  }
  
  // Use fallback if no members from Strapi
  if (members.length === 0) {
    if (isDev) {
      console.log('[TeamSectionServer] No members from Strapi, using fallback data');
    }
    members = FALLBACK_TEAM_MEMBERS;
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
