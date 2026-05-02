import type { Testimonial } from '@/types/testimonial'
import { SectionLabel, GoldDivider } from '@/components/ui'
import TestimonialSlider from './TestimonialSlider'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="bg-white py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel>WHAT SELLERS SAY</SectionLabel>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mt-3">
            Trusted by thousands of property owners
          </h2>
          <GoldDivider className="mx-auto mt-4 sm:mt-5" />
        </div>

        <div className="relative px-0 sm:px-8 md:px-12">
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
