import { Mail } from 'lucide-react';

export default function ContactHero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Get in Touch with EstateFlow
        </h1>
        <p className="text-xl text-slate-300 mb-6 leading-relaxed max-w-3xl mx-auto">
          Whether you're a property owner, buyer, or estate agent — we're here to help. 
          Reach out and our team will get back to you within 24 hours.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
          <Mail className="w-4 h-4 text-amber-400" />
          <span className="text-slate-200">Average response time: under 2 hours</span>
        </div>
      </div>
    </section>
  );
}
