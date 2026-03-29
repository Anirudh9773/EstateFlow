import { Users, TrendingUp, Star, MapPin } from 'lucide-react';
import { StatsSection } from '@/components/common';

export default function AboutStats() {
  const stats = [
    {
      icon: Users,
      value: '1,200+',
      label: 'Verified Estate Agents',
      description: 'Thoroughly vetted and licensed professionals across the UK',
    },
    {
      icon: TrendingUp,
      value: '8,500+',
      label: 'Successful Matches',
      description: 'Property owners connected with their ideal local agents',
    },
    {
      icon: Star,
      value: '98%',
      label: 'Satisfaction Rate',
      description: 'Property owners who would recommend EstateFlow',
    },
    {
      icon: MapPin,
      value: '48',
      label: 'UK Cities Covered',
      description: 'From London to Edinburgh, Manchester to Cardiff',
    },
  ];

  return (
    <StatsSection
      title="EstateFlow by the Numbers"
      subtitle="Our growth reflects the trust property owners and agents place in us every day."
      stats={stats}
      variant="dark"
      columns={4}
    />
  );
}
