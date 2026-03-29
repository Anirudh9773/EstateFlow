import { DualCTA } from '@/components/common';

export default function AboutCTA() {
  return (
    <DualCTA
      leftSection={{
        title: 'Ready to Find Your Perfect Agent?',
        description: 'Submit your property details and get matched with verified local agents in under 2 minutes. It\'s free, with no obligations.',
        buttonText: 'Submit Your Property',
        buttonHref: '/submit-property',
        buttonVariant: 'primary',
      }}
      rightSection={{
        title: 'Are You an Estate Agent?',
        description: 'Join 1,200+ verified agents receiving qualified leads directly to your inbox. Hyper-local targeting, instant notifications.',
        buttonText: 'Join EstateFlow',
        buttonHref: '/agents/join',
        buttonVariant: 'secondary',
      }}
      footerText="EstateFlow Ltd. • Registered in England and Wales • Connecting property owners with verified UK estate agents since 2021"
    />
  );
}
