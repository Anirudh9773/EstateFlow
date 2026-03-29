import { ContentSection, SectionHeader } from '@/components/common';

export default function OurStory() {
  return (
    <ContentSection variant="white" maxWidth="lg">
      <SectionHeader title="Our Story" />
      
      <div className="prose prose-lg max-w-none text-slate-700">
        <p className="text-lg leading-relaxed mb-6">
          EstateFlow was founded in 2021 by a team of property professionals and technologists 
          who saw a fundamental problem in the UK property market: the disconnect between 
          property owners and the right estate agents.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          After years of working in the industry, our founders witnessed countless sellers 
          struggling to find trustworthy local agents, while excellent agents struggled to 
          reach motivated clients in their area. The traditional model was broken — relying 
          on word of mouth, outdated directories, and generic online searches that left both 
          sides frustrated.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          We knew there had to be a better way. So we built EstateFlow: a platform that uses 
          intelligent technology to create perfect matches between property owners and verified 
          local agents. No more guesswork, no more wasted time, and no more uncertainty.
        </p>
        
        <p className="text-lg leading-relaxed mb-6">
          Since launching, we've grown to serve 48 cities across the UK, working with over 
          1,200 verified agents and helping more than 8,500 property owners find their ideal 
          agent match. Our 98% satisfaction rate speaks to the quality of connections we create.
        </p>
        
        <p className="text-lg leading-relaxed">
          Today, EstateFlow Ltd. is proud to be modernising the UK property market, one 
          connection at a time. We're building a future where finding the right estate agent 
          is simple, transparent, and stress-free for everyone involved.
        </p>
      </div>
    </ContentSection>
  );
}
