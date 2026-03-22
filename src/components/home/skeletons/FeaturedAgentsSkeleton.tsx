export default function FeaturedAgentsSkeleton() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-ef-border rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-ef-border rounded w-96 mx-auto mb-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-ef-border rounded-md p-6">
                <div className="h-14 w-14 bg-ef-border rounded-full mb-4" />
                <div className="h-4 bg-ef-border rounded w-3/4 mb-2" />
                <div className="h-3 bg-ef-border rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
