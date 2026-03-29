import { PageHero } from '@/components/common';

export default function AboutHero() {
  const stats = [
    { value: '1,200+', label: 'Verified Agents' },
    { value: '8,500+', label: 'Happy Property Owners' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <PageHero
      title="Connecting Property Owners with the Right Agents"
      description="EstateFlow is the UK's trusted property matching platform, connecting motivated sellers and buyers with verified, local estate agents — fast, targeted, and fully managed."
      stats={stats}
    />
  );
}
