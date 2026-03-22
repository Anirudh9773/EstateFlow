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
        spaceBetween={24}
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
            <Card className="border-ef-border shadow-none p-8 h-full">
              {/* Opening quote */}
              <div className="text-6xl leading-none text-gold/20 font-serif mb-4 select-none">
                "
              </div>

              {/* Quote text */}
              <p className="text-text-secondary leading-relaxed text-sm mb-6">
                {testimonial.quote}
              </p>

              <Separator className="bg-ef-border mb-5" />

              {/* Author info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                  />
                  <AvatarFallback className="bg-navy text-gold text-xs">
                    {getInitials(testimonial.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-navy font-medium text-sm">{testimonial.name}</div>
                  <div className="text-text-muted text-xs">{testimonial.location}</div>
                </div>
                <StarRating rating={testimonial.rating} size="sm" className="ml-auto" />
              </div>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-ef-border hover:border-gold hover:bg-gold/5 transition-all duration-150 flex items-center justify-center group disabled:opacity-30 disabled:cursor-not-allowed"
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
        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white border border-ef-border hover:border-gold hover:bg-gold/5 transition-all duration-150 flex items-center justify-center group disabled:opacity-30 disabled:cursor-not-allowed"
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
      <div className="swiper-pagination-custom flex items-center justify-center gap-2 mt-8" />
    </div>
  )
}
