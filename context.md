# EstateFlow - Website Context

## Project Overview

**EstateFlow** is a real estate platform built with Next.js 16.2.1 that connects property sellers and buyers with verified real estate agents across the UK. The platform serves as a marketplace where property owners can find the right agents to handle their real estate transactions.

## Technology Stack

### Core Framework
- **Next.js 16.2.1** (App Router)
- **React 19.2.4**
- **TypeScript** for type safety

### Styling & UI
- **Tailwind CSS v4** for styling
- **shadcn/ui** components with "base-nova" style
- **Lucide React** for icons
- **next-themes** for dark mode support
- **tw-animate-css** for animations

### Additional Libraries
- **Swiper** for carousels
- **Sonner** for toast notifications
- **class-variance-authority** for component variants
- **clsx** and **tailwind-merge** for conditional styling

## Project Structure

```
estateflow/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Header, Footer
│   │   ├── home/           # Homepage sections
│   │   ├── agents/         # Agent-related components
│   │   ├── common/         # Shared components
│   │   └── about/          # About page components
│   ├── data/              # Static data
│   │   ├── agents.ts      # Agent data
│   │   ├── testimonials.ts
│   │   └── stats.ts
│   ├── types/             # TypeScript definitions
│   │   └── agent.ts       # Agent interface
│   └── lib/               # Utility functions
├── public/                # Static assets
└── components.json        # shadcn/ui configuration
```

## Theme & Design System

### Color Palette
- Uses CSS custom properties for theming
- Supports dark mode via `next-themes`
- Base color: Neutral with CSS variables
- Primary accent colors defined in CSS variables

### Typography
- **Primary Font**: Inter (Google Fonts)
- Font variables: `--font-inter`, `--font-geist-mono`
- Responsive typography using Tailwind

### Component Architecture
- **shadcn/ui** component library with custom "base-nova" style
- Component variants using `class-variance-authority`
- Consistent spacing and design tokens

## Key Features & Pages

### Homepage Sections
- **Hero**: Main landing section
- **HowItWorks**: Process explanation
- **StatsBar**: Platform statistics
- **FeaturedAgents**: Agent showcase with filtering
- **Testimonials**: Customer reviews
- **WhyEstateFlow**: Value proposition
- **AgentCTABanner**: Call-to-action for agents

### Agent System
- **Agent Tiers**: Local, Regional, Nationwide
- **Verification System**: Verified agent badges
- **Specializations**: Property type expertise
- **Coverage Areas**: Geographic service areas
- **Performance Metrics**: Rating, reviews, leads handled

## Data Models

### Agent Interface
```typescript
interface Agent {
  id: string
  name: string
  agency: string
  location: string
  postcode: string
  avatar: string
  bio: string
  specialisations: string[]
  coverageAreas: string[]
  tier: 'local' | 'regional' | 'nationwide'
  rating: number
  reviewCount: number
  leadsHandled: number
  yearsExperience: number
  responseTime: string
  verified: boolean
  featured: boolean
  commission: number
  fee: string
}
```

## Coding Practices & Guidelines

### File Organization
- **Component-first approach**: Reusable components in `/components`
- **Type safety**: All components use TypeScript
- **Path aliases**: `@/components`, `@/lib`, `@/types`, etc.
- **Feature-based grouping**: Components grouped by feature (home, agents, etc.)

### Performance Optimizations
- **Dynamic imports**: Below-the-fold components loaded dynamically
- **Loading states**: Skeleton components for better UX
- **Image optimization**: Using Next.js Image component
- **Code splitting**: Automatic with Next.js

### Component Patterns
- **Server Components**: Default for better performance
- **Client Components**: Only when interactivity needed
- **Compound Components**: For complex UI patterns
- **Props destructuring**: Consistent prop handling

### Styling Conventions
- **Utility-first**: Tailwind CSS classes
- **Component variants**: Using `class-variance-authority`
- **Responsive design**: Mobile-first approach
- **Dark mode**: CSS custom properties with theme switching

### State Management
- **Server state**: Static data in `/data` directory
- **Client state**: React hooks and context
- **Form handling**: Controlled components

## Development Workflow

### Available Scripts
- `pnpm dev` - Development server
- `pnpm run build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - ESLint checking

### Development Server
- Runs on `http://localhost:3000`
- Hot reload enabled
- TypeScript checking

## SEO & Metadata

### Page Structure
- **Metadata**: SEO titles and descriptions
- **Semantic HTML**: Proper heading hierarchy
- **Accessibility**: ARIA labels and keyboard navigation

### Performance
- **Core Web Vitals**: Optimized for performance
- **Loading strategy**: Critical content first
- **Bundle optimization**: Tree shaking and code splitting

## Deployment

### Target Platform
- **Vercel**: Recommended for Next.js apps
- **Environment variables**: For configuration
- **Build optimization**: Production-ready builds

## Brand Guidelines

### Voice & Tone
- **Professional**: Real estate industry language
- **Trustworthy**: Emphasis on verification and reliability
- **Helpful**: Clear guidance for users
- **Modern**: Contemporary design and UX

### Key Messaging
- "Where properties meet the right agent"
- Focus on verified, experienced agents
- Emphasis on coverage areas and specializations
- Trust through ratings and reviews

## Future Considerations

### Scalability
- **Database integration**: For dynamic agent data
- **User authentication**: Agent and client accounts
- **Search functionality**: Advanced filtering
- **Booking system**: Agent appointment scheduling

### Features to Add
- **Agent dashboard**: Profile management
- **Property listings**: Integration with MLS
- **Review system**: Client feedback
- **Analytics**: Performance tracking

---

*This context file serves as a comprehensive guide for AI assistants and developers working on the EstateFlow platform. It contains essential information about the project structure, coding standards, and business logic to ensure consistency and quality in development.*
