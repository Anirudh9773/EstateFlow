import { Mail } from 'lucide-react';

export default function ContactHero() {
  return (
    <section className="bg-[#14141E] border-b border-white/10 text-white py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
          Get in Touch with EstateFlow
        </h1>
        <p className="text-base md:text-lg text-text-secondary mb-6 leading-relaxed max-w-3xl mx-auto px-4">
          Whether you&apos;re a property owner, buyer, or estate agent — we&apos;re here to help. 
          Reach out and our team will get back to you within 24 hours.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs md:text-sm">
          <Mail className="w-3.5 h-3.5 text-gold" />
          <span className="text-[#B8B5AE]">Average response time: under 2 hours</span>
        </div>
      </div>
    </section>
  );
}
