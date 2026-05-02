import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import OurMission from '@/components/about/OurMission';
import HowWereDifferent from '@/components/about/HowWereDifferent';
import OurStory from '@/components/about/OurStory';
import AboutStats from '@/components/about/AboutStats';
import AboutCTA from '@/components/about/AboutCTA';

export const metadata: Metadata = {
  title: 'About Us | EstateFlow - Connecting Property Owners with Verified UK Agents',
  description: 'Learn how EstateFlow is transforming the UK property market by connecting motivated sellers and buyers with verified local estate agents in under 2 minutes.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <OurMission />
      <HowWereDifferent />
      <OurStory />
      <AboutStats />
      <AboutStats />
      <AboutCTA />
    </main>
  );
}
