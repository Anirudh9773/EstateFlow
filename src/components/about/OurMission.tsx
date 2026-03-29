import { ContentSection, SectionHeader } from '@/components/common';

export default function OurMission() {
  return (
    <ContentSection variant="white" maxWidth="lg">
      <SectionHeader title="Our Mission" />
      
      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-xl leading-relaxed mb-6">
          At EstateFlow, we believe that selling or buying a property shouldn't be complicated, 
          stressful, or uncertain. Our mission is simple: to simplify the property journey for 
          everyone involved.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          For property owners, we remove the guesswork from finding the right estate agent. 
          No more endless phone calls, no more comparing dozens of agents online, and no more 
          wondering if you've made the right choice.
        </p>
        
        <p className="text-lg leading-relaxed">
          For estate agents, we deliver what matters most: qualified, motivated leads from 
          property owners in their local area who are ready to move forward. No wasted time, 
          no cold calling — just genuine opportunities to grow their business.
        </p>
      </div>
    </ContentSection>
  );
}
