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
  // Fetch team members from Strapi
  let teamMembers = [];
  try {
    teamMembers = await getTeamMembers(SITE_ID, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
  } catch (error) {
    // Silently fail - component will show empty state
  }

  // Transform Strapi data to component format
  const members = teamMembers.map((member: any) => {
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

  // If no members from Strapi, return null (component handles empty state)
  if (members.length === 0) {
    return null;
  }

  return (
    <TeamSection
      title={title}
      subtitle={subtitle}
      members={members}
      backgroundColor={backgroundColor}
    />
  );
}
