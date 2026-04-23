# EstateFlow - AI Agent Guidelines & Project Context

> **Critical Context Document**: This file provides comprehensive guidelines for AI agents working on the EstateFlow project. Read this FIRST before making any code changes.

---

## 🚨 CRITICAL FRAMEWORK RULES

### Next.js 16.2.1 - Breaking Changes Alert

**⚠️ THIS IS NOT THE NEXT.JS YOU KNOW**

This project uses Next.js 16.2.1 with significant breaking changes from previous versions. APIs, conventions, and file structure differ from your training data.

**MANDATORY RULES:**
1. **ALWAYS** check `node_modules/next/dist/docs/` for current API documentation before writing code
2. **NEVER** assume APIs work the same as Next.js 13/14
3. **HEED** all deprecation notices and warnings
4. **READ** the official Next.js 16 migration guide before making routing or data fetching changes
5. **TEST** all changes thoroughly - breaking changes are common

**Key Changes to Watch:**
- App Router conventions may have changed
- Server/Client component boundaries
- Metadata API changes
- Route handlers and middleware
- Cookie and header handling (especially for Supabase)

---

## 📋 Project Overview

**EstateFlow** is a modern real estate platform connecting property owners with verified real estate agents across the UK.

### Business Model
- **Marketplace Platform**: Connects property sellers/buyers with verified agents
- **Geographic Coverage**: UK-wide with local, regional, and nationwide agents
- **User Types**: Clients (property owners/seekers) and Agents (real estate professionals)
- **Key Value**: Advanced filtering, verified agents, transparent pricing

### Tech Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui (27 components) with @base-ui/react primitives
- **Authentication**: Supabase Auth with OAuth (Google, Yahoo, Microsoft, Apple, Facebook)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Carousels**: Swiper
- **Notifications**: Sonner (toast)
- **State**: React hooks + Server Components
- **Deployment**: Vercel (recommended)

### Package Manager
- **ALWAYS use `pnpm`** - This project uses pnpm, not npm or yarn
- Commands: `pnpm install`, `pnpm dev`, `pnpm build`

### Recent Major Updates (April 2026)

#### Authentication System Overhaul
- OAuth Integration for 5 providers (Google, Yahoo, Microsoft, Apple, Facebook)
- Reusable components: `OAuthButton`, `OAuthButtonsGroup`, `AuthForm`
- Consolidated authentication forms (eliminated duplicates)
- Unified `AuthForm` component for all auth scenarios

#### Property Submission Enhancement
- Multi-step form with improved navigation
- Conditional rendering based on user intent
- Optimized button placement and UX

#### Agent Browsing Enhancement
- "Browse All Agents" functionality
- Agent card improvements (no text truncation)
- Toggle between category and all-agents view

#### Bug Fixes
- Fixed React `flex-shrink-0` boolean attribute error
- Enhanced component reusability
- Standardized UI patterns

---

## 🏗️ Project Structure

```
estateflow/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Homepage (Hero, HowItWorks, Stats, Agents, etc.)
│   │   ├── layout.tsx                # Root layout with Header/Footer
│   │   ├── globals.css               # Global styles & CSS variables
│   │   │
│   │   ├── (auth)/                   # Auth route group (shared layout)
│   │   │   ├── layout.tsx            # Auth layout (split-screen design)
│   │   │   ├── sign-in/              # Client sign-in page
│   │   │   ├── sign-up/              # Sign-up routes
│   │   │   │   ├── client/           # Client registration
│   │   │   │   └── agent/            # Agent registration
│   │   │   └── forgot-password/      # Password reset
│   │   │
│   │   ├── agents/                   # Browse all agents (16 agents)
│   │   ├── find-an-agent/            # Agent search with filters
│   │   ├── submit-property/          # Multi-step property submission (6 steps)
│   │   │
│   │   ├── agent-dashboard/          # Agent management dashboard (protected)
│   │   ├── agent-login/              # Agent authentication
│   │   ├── agent-pricing/            # Agent pricing plans
│   │   ├── join-as-agent/            # Agent onboarding
│   │   │
│   │   ├── pricing/                  # Client pricing information
│   │   ├── about/                    # About EstateFlow
│   │   ├── contact/                  # Contact form & info
│   │   ├── privacy/                  # Privacy policy
│   │   ├── terms/                    # Terms of service
│   │   └── join/                     # General join page
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components (27 files)
│   │   │   ├── button.tsx            # Button variants
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── input.tsx             # Form input
│   │   │   ├── form.tsx              # Form components
│   │   │   ├── dialog.tsx            # Modal dialogs
│   │   │   ├── select.tsx            # Select dropdown
│   │   │   ├── checkbox.tsx          # Checkbox input
│   │   │   ├── tabs.tsx              # Tab navigation
│   │   │   ├── badge.tsx             # Badge component
│   │   │   ├── avatar.tsx            # Avatar component
│   │   │   ├── separator.tsx         # Divider line
│   │   │   ├── alert.tsx             # Alert messages
│   │   │   ├── SectionLabel.tsx      # Custom section label
│   │   │   ├── GoldDivider.tsx       # Gold accent divider
│   │   │   ├── AvatarStack.tsx       # Stacked avatars
│   │   │   ├── StarRating.tsx        # Star rating display
│   │   │   └── ... (14+ more)
│   │   │
│   │   ├── auth/                     # Authentication components
│   │   │   ├── OAuthButton.tsx       # Single OAuth provider button
│   │   │   ├── OAuthButtonsGroup.tsx # All OAuth buttons
│   │   │   ├── AuthForm.tsx          # Unified auth form
│   │   │   ├── simple-client-signin.tsx
│   │   │   ├── simple-client-signup.tsx
│   │   │   ├── simple-agent-signin.tsx
│   │   │   ├── simple-agent-signup.tsx
│   │   │   ├── simple-forgot-password.tsx
│   │   │   ├── SignOutButton.tsx     # Sign-out button
│   │   │   └── auth-left-panel.tsx   # Auth page left panel
│   │   │
│   │   ├── home/                     # Homepage sections (11 files)
│   │   │   ├── Hero.tsx              # Main hero with property pills
│   │   │   ├── HowItWorks.tsx        # 3-step process
│   │   │   ├── StatsBar.tsx          # Platform statistics
│   │   │   ├── FeaturedAgents.tsx    # Agent showcase
│   │   │   ├── AgentFilterTabs.tsx   # Agent tier filters
│   │   │   ├── Testimonials.tsx      # Customer reviews
│   │   │   ├── TestimonialSlider.tsx # Review carousel
│   │   │   ├── WhyEstateFlow.tsx     # Value proposition
│   │   │   ├── AgentCTABanner.tsx    # Agent call-to-action
│   │   │   └── ... (2 more)
│   │   │
│   │   ├── agents/                   # Agent components
│   │   │   └── AgentCard.tsx         # Agent display card
│   │   │
│   │   ├── common/                   # Shared components (9 files)
│   │   │   ├── SectionHeader.tsx     # Reusable section header
│   │   │   ├── FeatureGrid.tsx       # Feature grid layout
│   │   │   ├── PageHero.tsx          # Page hero section
│   │   │   ├── ContentSection.tsx    # Content section wrapper
│   │   │   ├── DualCTA.tsx           # Dual call-to-action
│   │   │   ├── StatsSection.tsx      # Statistics section
│   │   │   ├── LegalSection.tsx      # Legal content section
│   │   │   └── LegalPageLayout.tsx   # Legal page layout
│   │   │
│   │   ├── contact/                  # Contact page (6 files)
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ContactHero.tsx
│   │   │   ├── ContactInfoCards.tsx
│   │   │   └── ... (3 more)
│   │   │
│   │   ├── about/                    # About page (6 files)
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx            # Site header/navigation
│   │   │   └── Footer.tsx            # Site footer
│   │   ├── privacy/                  # Privacy content
│   │   ├── terms/                    # Terms content
│   │   └── logo.tsx                  # Logo component
│   │
│   ├── lib/
│   │   ├── supabaseClient.ts         # Browser Supabase client
│   │   ├── supabaseServer.ts         # Server Supabase client
│   │   ├── auth/
│   │   │   ├── actions.ts            # Server actions (signUp, signIn, signOut)
│   │   │   └── useUser.ts            # Client hook for user state
│   │   ├── utils/                    # Utility functions
│   │   │   └── cn.ts                 # Class name utility
│   │   ├── constants.ts              # Route constants
│   │   └── getInitials.ts            # Get user initials
│   │
│   ├── data/                         # Static data
│   │   ├── agents.ts                 # 16 agent profiles (4 local, 8 regional, 4 nationwide)
│   │   ├── testimonials.ts           # Customer reviews
│   │   └── stats.ts                  # Platform statistics
│   │
│   ├── types/                        # TypeScript definitions
│   │   ├── agent.ts                  # Agent interface
│   │   └── testimonial.ts            # Testimonial interface
│   │
│   ├── hooks/                        # Custom React hooks
│   └── middleware.ts                 # Route protection & auth
│
├── public/                           # Static assets
│   ├── images/
│   │   └── properties/               # Property images
│   └── *.svg                         # Icon files
│
├── .env.local                        # Environment variables (Supabase)
├── AGENTS.md                         # This file - AI agent guidelines
├── SUPABASE_SETUP.md                 # Supabase auth & database setup
├── OAUTH_IMPLEMENTATION_PLAN.md      # OAuth social login implementation
├── design.md                         # Design system
├── context.md                        # Detailed project context & flow
├── README.md                         # Project overview
├── components.json                   # shadcn/ui configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind configuration
└── package.json                      # Dependencies & scripts

```

### Page Routes & Purpose

#### Public Pages
- `/` - Homepage (Hero, How It Works, Featured Agents, Testimonials)
- `/agents` - Browse all 16 agents with tier filtering
- `/find-an-agent` - Advanced agent search with filters
- `/pricing` - Client pricing information
- `/agent-pricing` - Agent subscription plans
- `/about` - Company information and story
- `/contact` - Contact form and information
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/join` - General join/signup page
- `/join-as-agent` - Agent onboarding information

#### Authentication Pages (Route Group)
- `/sign-in` - Client sign-in (email/password + OAuth)
- `/sign-up/client` - Client registration
- `/sign-up/agent` - Agent registration
- `/agent-login` - Agent authentication
- `/forgot-password` - Password reset

#### Protected Pages (Require Authentication)
- `/agent-dashboard` - Agent management dashboard
- `/submit-property` - Multi-step property submission form

#### API Routes
- `/auth/callback` - OAuth callback handler (to be implemented)

---

## 🔐 Authentication System

### Supabase Integration

**Status**: ✅ Fully Configured

**Files**:
- `src/lib/supabaseClient.ts` - Browser client (use `createSupabaseClient()`)
- `src/lib/supabaseServer.ts` - Server client (use `createSupabaseServerClient()`)
- `src/lib/auth/actions.ts` - Server actions (signUp, signIn, signOut, getUser)
- `src/lib/auth/useUser.ts` - Client hook for user state
- `src/middleware.ts` - Route protection

**Environment Variables** (already configured in `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://cdzhgwptfwwyubrdcbsa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Types
- **Client**: Property owners/seekers
- **Agent**: Real estate professionals

### OAuth Providers
- Google
- Yahoo
- Microsoft
- Apple
- Facebook

### Protected Routes (via middleware)
- `/agent-dashboard/*` - Requires authentication
- `/submit-property/*` - Requires authentication
- Authenticated users redirected away from `/sign-in` and `/sign-up/*`

### Authentication Components
- `OAuthButton.tsx` - Reusable OAuth button
- `OAuthButtonsGroup.tsx` - Group of OAuth buttons
- `AuthForm.tsx` - Unified auth form (handles all scenarios)
- `simple-client-signin.tsx` - Client sign-in form
- `simple-client-signup.tsx` - Client sign-up form
- `simple-agent-signin.tsx` - Agent sign-in form
- `simple-agent-signup.tsx` - Agent sign-up form
- `SignOutButton.tsx` - Sign-out button

**IMPORTANT**: 
- See `SUPABASE_SETUP.md` for database schema and setup instructions
- See `OAUTH_IMPLEMENTATION_PLAN.md` for OAuth social authentication implementation

---

## 🎨 Design System

### Color Palette
```css
--color-navy: Primary brand color (dark blue)
--color-gold: Accent color (gold)
--color-surface: Light gray background
--color-text-secondary: Muted text
--color-text-muted: Very muted text
--color-ef-border: Custom border color
```

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: `text-navy`, `font-semibold`, responsive sizing
- **Body**: `text-text-secondary`
- **Labels**: Use `SectionLabel` component

### Component Patterns

#### Section Header Pattern (ALWAYS USE THIS)
```tsx
<div className="text-center">
  <SectionLabel>LABEL TEXT</SectionLabel>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mt-3">
    Section Title
  </h2>
  <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-3" />
  <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg">
    Optional description
  </p>
</div>
```

#### Background Alternation
- Alternate between `bg-surface` and `bg-white` for sections
- Use `bg-navy` for CTA sections

#### Button Styles
```tsx
// Primary
<Button className="bg-navy text-gold hover:bg-navy/90">

// Outline
<Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-gold">

// Gold
<Button className="bg-gold text-navy hover:bg-gold/90">
```

#### Card Styles
```tsx
// Default
<Card className="border-ef-border shadow-none">

// Glass effect
<Card className="bg-white/5 border-white/10">
```

### Spacing Standards
- Section padding: `py-16 sm:py-20` (standard), `py-20` (large)
- Container: `max-w-7xl mx-auto px-4 sm:px-6`
- Grid gaps: `gap-6 sm:gap-8`

### Responsive Breakpoints
- **Mobile**: 0-640px (default)
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

**RULE**: Always use mobile-first responsive design

---

## 📝 Coding Standards & Best Practices

### TypeScript Rules
1. **ALWAYS** use TypeScript with strict mode
2. **NEVER** use `any` type - use proper types or `unknown`
3. **ALWAYS** define interfaces for component props
4. **USE** type imports: `import type { NextConfig } from "next"`

### Component Rules

#### Server vs Client Components
```tsx
// Server Component (DEFAULT - no directive needed)
export default function ServerComponent() {
  // Can fetch data directly
  // Cannot use hooks or browser APIs
}

// Client Component (EXPLICIT directive required)
"use client"
export default function ClientComponent() {
  // Can use hooks, state, browser APIs
  // Cannot directly fetch on server
}
```

**RULES**:
- **DEFAULT to Server Components** - only use Client when needed
- Use Client Components for: forms, interactivity, hooks, browser APIs
- Use Server Components for: static content, data fetching, SEO

#### Component Structure
```tsx
// 1. Imports
import { Button } from '@/components/ui/button'
import type { Agent } from '@/types/agent'

// 2. Type definitions
interface MyComponentProps {
  title: string
  agents: Agent[]
}

// 3. Component
export default function MyComponent({ title, agents }: MyComponentProps) {
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### File Naming Conventions
- **Components**: PascalCase - `AgentCard.tsx`, `Hero.tsx`
- **Utilities**: camelCase - `getInitials.ts`, `constants.ts`
- **Types**: camelCase - `agent.ts`, `testimonial.ts`
- **Pages**: lowercase - `page.tsx`, `layout.tsx`

### Import Rules
1. **ALWAYS** use path aliases: `@/components`, `@/lib`, `@/types`
2. **NEVER** use relative imports for shared code: `../../components` ❌
3. **GROUP** imports: external → internal → types
4. **USE** named exports for utilities, default for components

### Styling Rules
1. **USE** Tailwind utility classes (utility-first approach)
2. **AVOID** custom CSS unless absolutely necessary
3. **USE** `cn()` utility for conditional classes:
   ```tsx
   import { cn } from '@/lib/utils'
   <div className={cn("base-class", condition && "conditional-class")} />
   ```
4. **FOLLOW** design system colors and spacing
5. **USE** responsive classes: `text-base sm:text-lg md:text-xl`

### State Management Rules
1. **USE** React hooks for local state
2. **USE** Server Components for data fetching
3. **USE** Server Actions for mutations (see `src/lib/auth/actions.ts`)
4. **AVOID** global state unless necessary
5. **USE** URL state for filters and pagination

### Form Handling
1. **USE** React Hook Form for complex forms
2. **USE** Zod for validation
3. **USE** Server Actions for form submission
4. **ALWAYS** show loading states
5. **ALWAYS** handle errors gracefully

---

## 🔒 Security & Privacy Rules

### Authentication
1. **NEVER** expose service role key in client code
2. **ALWAYS** use server actions for sensitive operations
3. **VALIDATE** all user input on server side
4. **USE** middleware for route protection
5. **IMPLEMENT** CSRF protection for forms

### Data Handling
1. **NEVER** log sensitive user data
2. **SANITIZE** all user inputs
3. **USE** environment variables for secrets
4. **IMPLEMENT** rate limiting for API routes
5. **FOLLOW** GDPR compliance for user data

### Supabase Security
1. **USE** Row Level Security (RLS) policies
2. **NEVER** bypass RLS with service role key in client
3. **VALIDATE** user permissions on server
4. **USE** `createSupabaseServerClient()` for server operations
5. **USE** `createSupabaseClient()` for client operations

---

## 🚀 Performance Rules

### Image Optimization
1. **ALWAYS** use Next.js `<Image>` component
2. **SPECIFY** width and height
3. **USE** `priority` for above-the-fold images
4. **OPTIMIZE** image formats (WebP, AVIF)
5. **LAZY LOAD** below-the-fold images

### Code Splitting
1. **USE** dynamic imports for heavy components:
   ```tsx
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```
2. **SPLIT** routes automatically with App Router
3. **AVOID** importing entire libraries (use tree-shaking)

### Bundle Size
1. **CHECK** bundle size regularly
2. **AVOID** large dependencies
3. **USE** `pnpm why <package>` to check dependencies
4. **REMOVE** unused imports and code

---

## 🧪 Testing & Quality

### Before Committing
1. **RUN** `pnpm lint` - fix all errors
2. **CHECK** TypeScript errors: `pnpm build`
3. **TEST** in browser - all user flows
4. **VERIFY** responsive design (mobile, tablet, desktop)
5. **CHECK** console for errors/warnings

### Code Quality Checklist
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No console errors in browser
- [ ] Responsive design works
- [ ] Forms validate properly
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Accessibility considerations (ARIA labels, keyboard nav)

---

## 📊 Data Models

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

### User Metadata (Supabase)
```typescript
interface UserMetadata {
  full_name: string
  phone?: string
  user_type: 'client' | 'agent'
}
```

---

## 🎯 Feature-Specific Guidelines

### Homepage Flow & Sections

**Route**: `/` (page.tsx)

**Section Order** (top to bottom):
1. **Hero** - Main landing with property pills, CTAs, and avatar stack
2. **HowItWorks** - 3-step process (Submit → Match → Connect)
3. **StatsBar** - Platform statistics (16 agents, 4.5+ rating, 2,000+ properties)
4. **FeaturedAgents** - Agent showcase with tier filtering (Local/Regional/Nationwide)
5. **Testimonials** - Customer reviews with Swiper carousel
6. **WhyEstateFlow** - 6 value propositions in 2-column grid
7. **AgentCTABanner** - Call-to-action for agents with pricing card

**Key Components**:
- All sections use consistent `SectionLabel + H2 + GoldDivider` pattern
- Background alternates: `bg-surface` → `bg-white` → `bg-surface` → etc.
- Mobile-first responsive design
- Lazy loading for below-the-fold content

### Multi-Step Property Submission Form

**Route**: `/submit-property` (protected route)

**Location**: `src/app/submit-property/page.tsx`

**Steps**:
1. **Intent Selection** - User selects: Renting, Selling, or Letting & Selling
   - No Next/Back buttons - direct selection advances
   - Cards with icons and descriptions
   
2. **Postcode Input** - Conditional based on intent
   - Different prompts for different intents
   - Validation required
   
3. **Property Details** - Property types and bedroom counts
   - Multiple property type selection
   - Bedroom count selection
   
4. **Financial Details** - Budget, sale value, timeline
   - Conditional fields based on intent
   - Only bottom navigation buttons
   
5. **Personal Information** - Name, email, phone
   - No promotional content
   - Clean form only
   
6. **Confirmation** - Success message and next steps

**Navigation Rules**:
- Step 1: No buttons - user selects option
- Steps 2-5: Back + Next buttons at bottom
- Step 6: Finish button
- Conditional rendering based on `currentStep`
- Validation before proceeding

**State Management**:
- Local state for form data
- Step tracking with `currentStep`
- Intent-based conditional logic

### Agent System

**Routes**: 
- `/agents` - Browse all agents
- `/find-an-agent` - Advanced search
- `/agent-dashboard` - Agent management (protected)

**Agent Tiers**:
- **Local**: 4 agents (single postcode/city coverage)
- **Regional**: 8 agents (multiple cities/counties)
- **Nationwide**: 4 agents (entire UK coverage)

**Total Agents**: 16 static agents in `src/data/agents.ts`

**Agent Data Structure**:
```typescript
interface Agent {
  id: string
  name: string
  agency: string
  location: string
  postcode: string
  avatar: string
  bio: string
  specialisations: string[]        // e.g., ["Residential", "Luxury"]
  coverageAreas: string[]          // e.g., ["London", "SW1A"]
  tier: 'local' | 'regional' | 'nationwide'
  rating: number                   // 0-5
  reviewCount: number
  leadsHandled: number
  yearsExperience: number
  responseTime: string             // e.g., "< 2 hours"
  verified: boolean
  featured: boolean
  commission: number               // percentage
  fee: string                      // e.g., "£2,500"
}
```

**Components**:
- `AgentCard.tsx` - Individual agent display
  - Shows avatar, name, agency, location
  - Rating, reviews, response time
  - Verification badge
  - "View Profile" button (positioned to prevent truncation)
  
- `AgentFilterTabs.tsx` - Filter by tier
  - Tabs: All, Local, Regional, Nationwide
  - Updates displayed agents on selection
  
- `FeaturedAgents.tsx` - Homepage agent showcase
  - Shows filtered agents based on selected tier
  - Grid layout (responsive)

**Rules**:
- Always show verification badge for verified agents
- Display tier-appropriate coverage areas
- Show response time and rating prominently
- "View Profile" button should not cause text truncation
- Use consistent card styling

### Authentication Flow

**User Types**:
- **Client**: Property owners/seekers
- **Agent**: Real estate professionals

**Authentication Methods**:
1. **Email/Password** - Traditional authentication
2. **OAuth** - Social login (Google, Microsoft, Facebook, Apple)

**Routes**:
- `/sign-in` - Client sign-in
- `/sign-up/client` - Client registration
- `/sign-up/agent` - Agent registration  
- `/agent-login` - Agent authentication
- `/forgot-password` - Password reset

**Components**:
- `simple-client-signin.tsx` - Client sign-in form
- `simple-client-signup.tsx` - Client sign-up form
- `simple-agent-signin.tsx` - Agent sign-in form
- `simple-agent-signup.tsx` - Agent sign-up form
- `OAuthButton.tsx` - Single provider button
- `OAuthButtonsGroup.tsx` - All OAuth buttons
- `AuthForm.tsx` - Unified auth form (handles all scenarios)
- `SignOutButton.tsx` - Sign-out button

**Auth Flow**:
1. User enters credentials or clicks OAuth button
2. Form validates input
3. Server action called (`signIn`, `signUp`, or `signInWithOAuth`)
4. Supabase handles authentication
5. User redirected to home or dashboard
6. Middleware protects routes

**User Metadata**:
```typescript
{
  full_name: string
  phone?: string
  user_type: 'client' | 'agent'
}
```

**Protected Routes** (via middleware):
- `/agent-dashboard/*` - Requires authentication
- `/submit-property/*` - Requires authentication
- Authenticated users redirected away from `/sign-in` and `/sign-up/*`

### OAuth Authentication

**Providers**: Google, Yahoo, Microsoft, Apple, Facebook

**Implementation Status**: 
- ✅ UI Components Ready
- ⏳ OAuth Integration Pending (see `OAUTH_IMPLEMENTATION_PLAN.md`)

**Components**:
- `OAuthButton.tsx` - Single provider button
- `OAuthButtonsGroup.tsx` - All providers
- `AuthForm.tsx` - Unified form with OAuth

**Rules**:
- Always show OAuth options below email/password
- Use consistent provider icons and colors
- Handle OAuth errors gracefully
- Redirect to appropriate page after auth

**Implementation Guide**: See `OAUTH_IMPLEMENTATION_PLAN.md` for complete OAuth setup instructions

---

## 🐛 Common Issues & Solutions

### Issue: Supabase Cookie Errors
**Solution**: Ensure middleware properly handles cookies with `setAll()` method

### Issue: TypeScript Errors with Supabase
**Solution**: Use proper type imports from `@supabase/supabase-js`

### Issue: Hydration Errors
**Solution**: Ensure server and client render the same initial HTML

### Issue: Image Optimization Errors
**Solution**: Add remote patterns to `next.config.ts`

### Issue: Build Errors
**Solution**: Check for client-only code in server components

---

## 📚 Documentation References

### Internal Docs
- `context.md` - **READ FIRST** - Complete project flow, pages, features, and recent updates
- `AGENTS.md` - This file - AI agent guidelines and coding standards
- `SUPABASE_SETUP.md` - Supabase configuration, database schema, and authentication usage
- `OAUTH_IMPLEMENTATION_PLAN.md` - Complete OAuth social authentication implementation guide
- `design.md` - Design system, component patterns, and styling guidelines
- `README.md` - Project overview and setup instructions

### External Docs
- [Next.js 16 Docs](https://nextjs.org/docs) - Framework documentation
- [Supabase Docs](https://supabase.com/docs) - Auth and database
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TypeScript](https://www.typescriptlang.org/docs/) - Language reference

---

## ✅ AI Agent Checklist

Before making ANY changes, verify:

- [ ] I have read this entire AGENTS.md file
- [ ] I have read context.md to understand project flow and all pages
- [ ] I understand this is Next.js 16.2.1 with breaking changes
- [ ] I have checked `node_modules/next/dist/docs/` for current APIs
- [ ] I understand the authentication system (Supabase)
- [ ] I know the difference between Server and Client Components
- [ ] I understand the homepage section flow
- [ ] I understand the multi-step property submission form
- [ ] I understand the agent tier system (Local/Regional/Nationwide)
- [ ] I will follow the design system patterns
- [ ] I will use TypeScript strictly
- [ ] I will test my changes thoroughly
- [ ] I will use `pnpm` for package management
- [ ] I will follow the coding standards above

---

## 🚨 CRITICAL REMINDERS

1. **Next.js 16.2.1 is DIFFERENT** - Always check docs first
2. **Use pnpm** - Not npm or yarn
3. **Server Components by default** - Only use "use client" when needed
4. **Supabase is configured** - Use existing clients and actions
5. **Follow design system** - Use SectionLabel, GoldDivider, color palette
6. **TypeScript strict mode** - No `any` types
7. **Mobile-first responsive** - Test all breakpoints
8. **Security first** - Never expose secrets, validate inputs
9. **Performance matters** - Optimize images, code split, lazy load
10. **Read SUPABASE_SETUP.md** - Before touching auth code
11. **Read OAUTH_IMPLEMENTATION_PLAN.md** - Before implementing OAuth
10. **Read SUPABASE_SETUP.md** - Before touching auth code

---

## 📞 Need Help?

1. Check this file first (AGENTS.md)
2. Read `context.md` for complete project flow and all pages
3. Read `SUPABASE_SETUP.md` for Supabase auth setup and database schema
4. Read `OAUTH_IMPLEMENTATION_PLAN.md` for OAuth social login implementation
5. Read `design.md` for design patterns and styling
6. Check `node_modules/next/dist/docs/` for Next.js APIs
7. Search official documentation
8. Ask for clarification if unclear

---

**Last Updated**: April 23, 2026
**Version**: 2.0.0
**Maintainer**: EstateFlow Development Team

---

*This document is the single source of truth for AI agents working on EstateFlow. Keep it updated as the project evolves.*