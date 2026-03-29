import { Shield, Zap, Lock, BadgeCheck } from 'lucide-react';
import { ContentSection, SectionHeader, FeatureGrid } from '@/components/common';

export default function HowWereDifferent() {
  const features = [
    {
      icon: BadgeCheck,
      title: 'Verified Agents Only',
      description: 'Every agent on our platform is thoroughly vetted, licensed, and verified before receiving leads. We only work with professionals who meet our strict standards.',
    },
    {
      icon: Zap,
      title: 'Intelligent Matching',
      description: 'Our smart algorithm connects you with the most suitable local agents in under 2 minutes. No more browsing endless listings or making countless calls.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'We never sell your data. Your details are only shared with agents you choose to connect with. You stay in control of your information at all times.',
    },
    {
      icon: Shield,
      title: 'Free to Use',
      description: 'Property owners submit for free — no hidden fees, no obligations. Only pay your chosen agent when you decide to work with them.',
    },
  ];

  return (
    <ContentSection variant="gray" maxWidth="xl">
      <SectionHeader
        title="How We're Different"
        description="EstateFlow isn't just another property portal. We've built something better."
      />
      <FeatureGrid features={features} columns={2} variant="card" iconColor="amber" />
    </ContentSection>
  );
}
