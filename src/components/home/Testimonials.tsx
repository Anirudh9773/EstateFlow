import type { Testimonial } from '@/types/testimonial'
import { SectionLabel, GoldDivider } from '@/components/ui'
import TestimonialSlider from './TestimonialSlider'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>WHAT SELLERS SAY</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mt-3">
            Trusted by thousands of property owners
          </h2>
          <GoldDivider className="mx-auto mt-5" />
        </div>

        <div className="relative px-12">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
