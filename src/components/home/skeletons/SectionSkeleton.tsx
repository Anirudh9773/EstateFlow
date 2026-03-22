export default function SectionSkeleton() {
  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-ef-border rounded w-64 mx-auto mb-4" />
          <div className="h-4 bg-ef-border rounded w-96 mx-auto" />
        </div>
      </div>
    </section>
  )
}
