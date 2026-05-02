'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Testimonial } from '@/types/testimonial'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/ui'
import { getInitials } from '@/lib/utils/getInitials'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface TestimonialSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination-custom',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
        className="!pb-12"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <Card className="border-ef-border shadow-none p-6 sm:p-8 h-full">
              {/* Quote text */}
              <p className="text-text-secondary leading-relaxed text-sm mb-6">
                {testimonial.quote}
              </p>

              <Separator className="bg-ef-border mb-5" />

              {/* Author info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                  />
                  <AvatarFallback className="bg-navy text-gold text-xs">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-navy font-medium text-sm truncate">{testimonial.name}</div>
                  <div className="text-text-muted text-xs truncate">{testimonial.location}</div>
                </div>
                <StarRating rating={testimonial.rating} size="sm" className="ml-auto flex-shrink-0" />
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Hidden on mobile, shown on sm+ */}
      <button
        className="swiper-button-prev-custom hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 md:-translate-x-6 z-10 w-10 h-10 rounded-full bg-white border border-ef-border hover:border-gold hover:bg-gold/5 transition-all duration-150 items-center justify-center group disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        aria-label="Previous testimonial"
      >
        <svg
          className="w-5 h-5 text-navy group-hover:text-gold transition-colors duration-150"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="swiper-button-next-custom hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 md:translate-x-6 z-10 w-10 h-10 rounded-full bg-white border border-ef-border hover:border-gold hover:bg-gold/5 transition-all duration-150 items-center justify-center group disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        aria-label="Next testimonial"
      >
        <svg
          className="w-5 h-5 text-navy group-hover:text-gold transition-colors duration-150"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Custom Pagination Dots */}
      <div className="swiper-pagination-custom flex items-center justify-center gap-2 mt-6 sm:mt-8" />
    </div>
  )
}
