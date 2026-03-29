export default function ContactTrustBar() {
  const stats = [
    '1,200+ Verified Agents',
    '8,500+ Leads Matched',
    '98% Satisfaction Rate',
    '48 Cities Covered',
  ];

  return (
    <section className="bg-slate-900 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-slate-300 text-xs sm:text-sm md:text-base font-medium">
                {stat}
              </span>
              {index < stats.length - 1 && (
                <span className="hidden sm:block text-slate-600">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
