# EstateFlow - Website Context

## Project Overview

**EstateFlow** is a comprehensive real estate platform built with Next.js 16.2.1 that connects property sellers and buyers with verified real estate agents across the UK. The platform serves as a marketplace where property owners can find the right agents to handle their real estate transactions, featuring advanced filtering, multi-step property submission, and OAuth authentication.

## Recent Major Updates (April 2026)

### Authentication System Overhaul
- **OAuth Integration**: Added support for Google, Yahoo, Microsoft, Apple, and Facebook OAuth providers
- **Reusable Components**: Created `OAuthButton.tsx`, `OAuthButtonsGroup.tsx`, and `AuthForm.tsx` for consistent authentication across all forms
- **Consolidated Forms**: Replaced duplicate authentication forms with unified `AuthForm` component handling sign-in/sign-up for both agents and clients
- **Files Updated**: 
  - `src/app/agent-login/page.tsx`
  - `src/components/auth/simple-agent-signin.tsx`
  - `src/components/auth/simple-client-signin.tsx`
  - `src/components/auth/simple-agent-signup.tsx`
  - `src/components/auth/simple-client-signup.tsx`

### Sell Property Form Refactoring
- **Multi-step Form**: Enhanced navigation and user experience
- **Step 1**: Removed redundant Next/Back buttons - users select from 3 options only
- **Step 4**: Eliminated duplicate navigation buttons, keeping only bottom navigation
- **Step 5**: Removed promotional bullet points and optimized button placement
- **Navigation Logic**: Centralized navigation with conditional rendering based on current step
- **File**: `src/app/submit-property/page.tsx`

### Browse Agents Enhancement
- **Browse All Functionality**: Added "Browse All Agents" button that displays all 16 static agents in a simple page format
- **Agent Card Improvements**: Repositioned "View Profile" button to prevent name truncation
- **State Management**: Added `showAllAgents` state for toggle between category and all-agents view
- **Files**: `src/app/agents/page.tsx`, `src/components/agents/AgentCard.tsx`

### Bug Fixes & Optimizations
- **React Error Fix**: Resolved `flex-shrink-0` boolean attribute error in AgentDashboard
- **Component Reusability**: Enhanced component reuse across authentication flows
- **UI Consistency**: Standardized button styles and navigation patterns

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
|-- src/
|   |-- app/                          # Next.js App Router pages
|   |   |-- page.tsx                 # Homepage
|   |   |-- layout.tsx               # Root layout
|   |   |-- globals.css              # Global styles
|   |   |-- (auth)/                  # Authentication routes
|   |   |   |-- sign-in/
|   |   |   |-- sign-up/
|   |   |   |-- agent-login/
|   |   |   `-- join-as-agent/
|   |   |-- agents/                  # Browse agents page
|   |   |-- agent-dashboard/         # Agent dashboard
|   |   |-- submit-property/         # Multi-step property submission
|   |   |-- find-an-agent/           # Agent finding page
|   |   |-- pricing/                 # Pricing page
|   |   |-- about/                   # About page
|   |   |-- contact/                 # Contact page
|   |   |-- privacy/                 # Privacy policy
|   |   |-- terms/                   # Terms of service
|   |   `-- join/                    # Join page
|   |-- components/                  # Reusable components
|   |   |-- ui/                      # shadcn/ui components (27 files)
|   |   |   |-- button.tsx
|   |   |   |-- card.tsx
|   |   |   |-- input.tsx
|   |   |   |-- tabs.tsx
|   |   |   |-- badge.tsx
|   |   |   |-- avatar.tsx
|   |   |   |-- dialog.tsx
|   |   |   |-- select.tsx
|   |   |   |-- checkbox.tsx
|   |   |   |-- form.tsx
|   |   |   |-- separator.tsx
|   |   |   |-- alert.tsx
|   |   |   `-- ... (custom UI components)
|   |   |-- auth/                    # Authentication components
|   |   |   |-- OAuthButton.tsx      # Reusable OAuth button
|   |   |   |-- OAuthButtonsGroup.tsx # OAuth buttons group
|   |   |   |-- AuthForm.tsx          # Unified auth form
|   |   |   |-- simple-agent-signin.tsx
|   |   |   |-- simple-client-signin.tsx
|   |   |   |-- simple-agent-signup.tsx
|   |   |   |-- simple-client-signup.tsx
|   |   |   `-- simple-forgot-password.tsx
|   |   |-- layout/                  # Layout components
|   |   |   |-- Header.tsx
|   |   |   `-- Footer.tsx
|   |   |-- home/                    # Homepage sections (11 files)
|   |   |   |-- Hero.tsx
|   |   |   |-- HowItWorks.tsx
|   |   |   |-- StatsBar.tsx
|   |   |   |-- FeaturedAgents.tsx
|   |   |   |-- Testimonials.tsx
|   |   |   |-- WhyEstateFlow.tsx
|   |   |   |-- AgentCTABanner.tsx
|   |   |   |-- AgentFilterTabs.tsx
|   |   |   |-- TestimonialSlider.tsx
|   |   |   `-- AvatarStack.tsx
|   |   |-- agents/                  # Agent-related components
|   |   |   `-- AgentCard.tsx        # Agent display card
|   |   |-- common/                  # Shared components (9 files)
|   |   |   |-- SectionHeader.tsx
|   |   |   |-- FeatureGrid.tsx
|   |   |   |-- PageHero.tsx
|   |   |   |-- ContentSection.tsx
|   |   |   |-- DualCTA.tsx
|   |   |   |-- StatsSection.tsx
|   |   |   |-- LegalSection.tsx
|   |   |   `-- LegalPageLayout.tsx
|   |   |-- contact/                 # Contact page components (6 files)
|   |   |-- about/                   # About page components (6 files)
|   |   |-- privacy/                 # Privacy content
|   |   |-- terms/                   # Terms content
|   |   `-- logo.tsx                 # Logo component
|   |-- data/                        # Static data
|   |   |-- agents.ts                # Agent data (16 agents)
|   |   |-- testimonials.ts
|   |   `-- stats.ts
|   |-- types/                       # TypeScript definitions
|   |   |-- agent.ts                 # Agent interface
|   |   `-- testimonial.ts
|   |-- lib/                         # Utility functions
|   |   |-- constants.ts             # Route constants
|   |   |-- utils/                   # Utility functions
|   |   `-- getInitials.ts           # Initials helper
|   `-- hooks/                       # Custom hooks
|-- public/                         # Static assets
|-- design.md                       # Design system documentation
|-- context.md                      # Project context (this file)
`-- components.json                 # shadcn/ui configuration

## Theme & Design System

### Color Palette
- **Navy Primary**: `text-navy`, `bg-navy` - Main brand color
- **Gold Accent**: `text-gold`, `bg-gold` - Secondary accent color
- **Surface Background**: `bg-surface` - Light gray background for sections
- **Text Secondary**: `text-text-secondary` - Muted text color
- **Text Muted**: `text-text-muted` - Very muted text color
- **Border Color**: `border-ef-border` - Custom border color
- Uses CSS custom properties for theming
- Supports dark mode via `next-themes`

### Typography
- **Primary Font**: Inter (Google Fonts)
- Font variables: `--font-inter`, `--font-geist-mono`
- Responsive typography using Tailwind
- **Headings**: `text-navy`, `font-semibold`, responsive sizing
- **Body text**: `text-text-secondary`
- **Labels**: SectionLabel component

### Component Architecture
- **shadcn/ui** component library with "base-ui" primitives
- Component variants using `class-variance-authority`
- Consistent spacing and design tokens
- **Custom UI Components**:
  - `SectionLabel.tsx` - Consistent section labels
  - `GoldDivider.tsx` - Gold accent divider
  - `AvatarStack.tsx` - User avatar stacks
  - `StarRating.tsx` - Star rating display
  - `StatCard.tsx` - Statistics display cards

### Design Patterns
- **Section Header Pattern**: SectionLabel + H2 + GoldDivider + description
- **Background Alternation**: `bg-surface` and `bg-white` alternating
- **Button Styles**: 
  - Primary: `bg-navy text-gold hover:bg-navy/90`
  - Outline: `border-navy text-navy hover:bg-navy hover:text-gold`
  - Gold: `bg-gold text-navy hover:bg-gold/90`
- **Card Styles**: `border-ef-border shadow-none` (default), `bg-white/5 border-white/10` (glass)

## Key Features & Pages

### Homepage Sections
- **Hero**: Main landing section with property pills and CTAs
- **HowItWorks**: 3-step process explanation with numbered cards
- **StatsBar**: Platform statistics (16 agents, 4.5+ rating, 2,000+ properties)
- **FeaturedAgents**: Agent showcase with filtering tabs
- **Testimonials**: Customer reviews with slider
- **WhyEstateFlow**: Value proposition with feature grid
- **AgentCTABanner**: Call-to-action for agents with pricing card

### Authentication System
- **OAuth Providers**: Google, Yahoo, Microsoft, Apple, Facebook
- **Unified Auth Forms**: Single `AuthForm` component for all auth scenarios
- **User Types**: Agent and Client authentication
- **Form Types**: Sign-in and Sign-up flows
- **Reusable Components**: `OAuthButton`, `OAuthButtonsGroup`, `AuthForm`

### Property Submission System
- **Multi-step Form**: 6-step property submission process
- **Step 1**: Intent selection (Renting, Selling, Letting & Selling)
- **Step 2**: Postcode input based on intent
- **Step 3**: Property types and bedroom counts
- **Step 4**: Financial details (budget, sale value, timeline)
- **Step 5**: Personal information collection
- **Step 6**: Submission confirmation
- **Smart Navigation**: Contextual Back/Next buttons

### Agent System
- **Agent Tiers**: Local (4 agents), Regional (8 agents), Nationwide (4 agents)
- **Browse All View**: Comprehensive view of all 16 agents
- **Verification System**: Verified agent badges
- **Specializations**: Property type expertise (Residential, Commercial, Luxury, etc.)
- **Coverage Areas**: Geographic service areas (postcodes, cities, regions)
- **Performance Metrics**: Rating, reviews, leads handled, response time
- **Agent Cards**: Optimized layout with View Profile buttons

### Additional Pages
- **Agent Dashboard**: Agent profile and performance management
- **Pricing**: Service pricing information
- **About**: Company information and story
- **Contact**: Contact form and information
- **Privacy**: Privacy policy content
- **Terms**: Terms of service content
- **Find Agent**: Agent search and filtering

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
- **Type safety**: All components use TypeScript with strict typing
- **Path aliases**: `@/components`, `@/lib`, `@/types`, etc.
- **Feature-based grouping**: Components grouped by feature (home, agents, auth, etc.)
- **UI Components**: shadcn/ui components in `/components/ui` (27 components)
- **Custom Components**: Business logic components in feature folders

### shadcn/ui Component Usage
- **Extensive Usage**: 27 shadcn/ui components actively used
- **Base UI Primitives**: Using @base-ui/react for accessibility
- **Component Variants**: Using `class-variance-authority` for styling variants
- **Custom Styling**: Tailwind classes with consistent design tokens
- **Reusable Patterns**: Consistent component patterns across the app

### Component Reusability & Optimization
- **OAuth System**: Unified `OAuthButton`, `OAuthButtonsGroup`, `AuthForm` components
- **Authentication Consolidation**: Single `AuthForm` handles all auth scenarios
- **Consistent UI Patterns**: Section headers, cards, buttons follow standardized patterns
- **No Code Duplication**: Eliminated duplicate authentication forms
- **Component Composition**: Building complex UI from simple, reusable components

### Performance Optimizations
- **Dynamic imports**: Below-the-fold components loaded dynamically
- **Loading states**: Proper loading indicators and skeleton states
- **Image optimization**: Using Next.js Image component with proper sizing
- **Code splitting**: Automatic with Next.js App Router
- **Bundle Optimization**: Tree shaking and proper imports

### Component Patterns
- **Server Components**: Default for better performance (static content)
- **Client Components**: Only when interactivity needed (forms, state)
- **Compound Components**: For complex UI patterns (auth forms, multi-step forms)
- **Props Destructuring**: Consistent prop handling with TypeScript interfaces
- **Custom Hooks**: Reusable state logic where appropriate

### Styling Conventions
- **Utility-first**: Tailwind CSS classes with consistent naming
- **Component Variants**: Using `class-variance-authority` for button/card variants
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Dark Mode Support**: CSS custom properties with theme switching
- **Design Tokens**: Consistent spacing, colors, and typography

### State Management
- **Server State**: Static data in `/data` directory (agents, testimonials, stats)
- **Client State**: React hooks for form state and UI interactions
- **Form Handling**: Controlled components with proper validation
- **Navigation State**: URL-based state management where appropriate

### Error Handling & Debugging
- **React Error Boundaries**: Proper error handling for components
- **Console Error Fixes**: Proactive fixing of React warnings (e.g., flex-shrink-0 boolean)
- **Type Safety**: Strict TypeScript to catch errors at compile time
- **Component Props**: Proper typing and default values

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
