import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md'
  className?: string
}

export default function StarRating({ rating, size = 'md', className }: StarRatingProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn(starSize, star <= rating ? 'text-gold fill-gold' : 'text-gold/20')}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 1.5L12.5 6.5L18 7.5L14 11.5L15 17L10 14.5L5 17L6 11.5L2 7.5L7.5 6.5L10 1.5Z" />
        </svg>
      ))}
    </div>
  )
}
