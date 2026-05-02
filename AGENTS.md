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
- **Authentication**: Supabase Auth with OAuth (Google, Microsoft, X/Twitter)
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
- OAuth Integration for 3 providers (Google, Microsoft, X/Twitter)
- Reusable components: `OAuthButton`, `OAuthButtonsGroup`, `AuthForm`
- Consolidated authentication forms (eliminated duplicates)
- Unified `AuthForm` component for all auth scenarios
- Google OAuth fully implemented and ready for configuration

#### Role-Based User Profiles
- Automatic profile creation in dedicated tables (clients/agents)
- Database trigger-based profile creation (or manual via service role key)
- Row Level Security (RLS) policies for data protection
- Agent-specific professional fields (agency, license, experience)
- Public agent profile browsing for marketplace functionality

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
- Fixed form input visibility (added borders to all inputs)

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
- `src/lib/auth/actions.ts` - Server actions (signUp, signIn, signOut, signInWithOAuth, getUser)
- `src/lib/auth/useUser.ts` - Client hook for user state
- `src/middleware.ts` - Route protection
- `src/app/auth/callback/route.ts` - OAuth callback handler

**Environment Variables** (configure in `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Get these values from**: Supabase Dashboard → Settings → API

**Database Schema**:
- `public.clients` - Client user profiles
- `public.agents` - Agent user profiles with professional fields
- Automatic profile creation via database trigger or manual creation
- Row Level Security (RLS) policies for data protection

### User Types
- **Client**: Property owners/seekers (stored in `public.clients` table)
- **Agent**: Real estate professionals (stored in `public.agents` table)

### OAuth Providers
- **Google** - ✅ Fully implemented (requires Supabase configuration)
- **Microsoft** - ⏳ Code ready (requires Supabase configuration)
- **X (Twitter)** - ⏳ Code ready (requires Supabase configuration)

### Profile Creation Methods
1. **Database Trigger** (Recommended for production):
   - Automatic profile creation when user signs up
   - Requires special permissions on `auth.users` table
   - See `SUPABASE_DATABASE_SETUP.md` for setup

2. **Manual Creation** (Works everywhere):
   - Profile created via server action using service role key
   - No special permissions required
   - Fallback method if trigger fails
   - See `QUICK_FIX_GUIDE.md` for implementation

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
- See `SUPABASE_DATABASE_SETUP.md` for complete database schema and setup instructions
- See `GOOGLE_OAUTH_SETUP.md` for Google OAuth configuration (step-by-step)
- See `OAUTH_IMPLEMENTATION_SUMMARY.md` for OAuth implementation details
- See `QUICK_FIX_GUIDE.md` for quick database setup without triggers
- See `MIGRATION_TROUBLESHOOTING.md` for database migration issues
- See `E2E_TESTING_GUIDE.md` for comprehensive testing instructions

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

### Form Input Styling (IMPORTANT)
1. **ALL input fields MUST have visible borders**: `border border-slate-300`
2. **Focus states**: `focus:border-navy focus:ring-2 focus:ring-navy/20`
3. **Checkboxes MUST have borders**: `border-2 border-slate-300`
4. **Checked state**: `data-[state=checked]:bg-navy data-[state=checked]:border-navy`
5. **Follow design.md** for complete form styling patterns

**Example Input**:
```tsx
<Input
  type="email"
  className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
/>
```

**Example Checkbox**:
```tsx
<Checkbox
  className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
/>
```

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

## 🗄️ Database Setup & Profile Management

### Profile Tables Schema

**clients table**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users, unique)
- `full_name` (TEXT, not null)
- `email` (TEXT, not null)
- `phone` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

**agents table**:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users, unique)
- `full_name` (TEXT, not null)
- `email` (TEXT, not null)
- `phone` (TEXT, nullable)
- `agency_name` (TEXT, nullable)
- `license_number` (TEXT, nullable)
- `area_of_operation` (TEXT, nullable)
- `years_experience` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### Profile Creation Methods

**Method 1: Database Trigger (Recommended for Production)**
- Automatic profile creation when user signs up
- Trigger function reads `user_metadata` and creates appropriate profile
- Requires special permissions on `auth.users` table
- See `SUPABASE_DATABASE_SETUP.md` for complete setup

**Method 2: Manual Creation (Works Everywhere)**
- Profile created via server action using service role key
- No special permissions required
- Implemented in `src/lib/auth/actions.ts` (signUp function)
- Fallback method if trigger fails
- See `QUICK_FIX_GUIDE.md` for 3-step setup

### Row Level Security (RLS) Policies

**clients table**:
- Users can SELECT their own profile
- Users can UPDATE their own profile
- Users can INSERT their own profile (for manual creation)

**agents table**:
- Users can SELECT their own profile
- Users can UPDATE their own profile
- Users can INSERT their own profile (for manual creation)
- Public can SELECT all agent profiles (for browsing)

**RLS Setup**: Run `supabase/migrations/002_enable_rls_policies.sql` in Supabase Dashboard

### Database Setup Steps

**Quick Setup (No Trigger)**:
1. Run `supabase/migrations/001_create_profile_tables_and_trigger.sql` (creates tables)
2. Run INSERT policy SQL from `QUICK_FIX_GUIDE.md`
3. Restart dev server
4. Test sign-up

**Full Setup (With Trigger)**:
1. Run `supabase/migrations/001_create_profile_tables_and_trigger.sql`
2. Run `supabase/migrations/002_enable_rls_policies.sql`
3. Test sign-up
4. If trigger fails, follow `MIGRATION_TROUBLESHOOTING.md`

### Testing Database Setup

**Verify Tables**:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('clients', 'agents');
```

**Verify RLS Policies**:
```sql
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE tablename IN ('clients', 'agents');
```

**Test Profile Creation**:
1. Sign up as client at `/sign-up/client`
2. Check `public.clients` table for new record
3. Sign up as agent at `/sign-up/agent`
4. Check `public.agents` table for new record

**Comprehensive Testing**: See `E2E_TESTING_GUIDE.md` for complete test suite

---

## 🧪 Testing & Quality

### Before Committing
1. **RUN** `pnpm lint` - fix all errors
2. **CHECK** TypeScript errors: `pnpm build`
3. **TEST** in browser - all user flows
4. **VERIFY** responsive design (mobile, tablet, desktop)
5. **CHECK** console for errors/warnings
6. **TEST** authentication flows (sign-up, sign-in, OAuth)
7. **VERIFY** profile creation in database

### Code Quality Checklist
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No console errors in browser
- [ ] Responsive design works
- [ ] Forms validate properly
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Accessibility considerations (ARIA labels, keyboard nav)
- [ ] Database profiles created correctly
- [ ] RLS policies working as expected

### End-to-End Testing

**Comprehensive Test Suite**: See `E2E_TESTING_GUIDE.md` for complete testing instructions

**Key Test Scenarios**:
1. Client email/password sign-up → profile in clients table → sign-in → home redirect
2. Agent email/password sign-up → profile in agents table → sign-in → dashboard redirect
3. Client OAuth sign-up → profile in clients table → sign-in → home redirect
4. Agent OAuth sign-up → profile in agents table → sign-in → dashboard redirect
5. Duplicate email prevention
6. RLS policies (own profile access only, public agent browsing)
7. Form validations (email, password, required fields)
8. Error handling (invalid credentials, network errors, weak passwords)

**Quick Test**:
```bash
# 1. Sign up as client
# Navigate to /sign-up/client, fill form, submit

# 2. Verify in Supabase Dashboard
# Check auth.users for user with user_type='client'
# Check public.clients for profile record

# 3. Sign in
# Navigate to /sign-in, enter credentials
# Verify redirect to homepage

# 4. Repeat for agent
# Navigate to /sign-up/agent, fill form, submit
# Verify profile in public.agents
# Sign in and verify redirect to /agent-dashboard
```

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

**Client Metadata**:
```typescript
interface ClientMetadata {
  user_type: 'client'
  full_name: string
  phone?: string
  email: string
}
```

**Agent Metadata**:
```typescript
interface AgentMetadata {
  user_type: 'agent'
  full_name: string
  phone?: string
  email: string
  agency_name?: string
  license_number?: string
  area_of_operation?: string
  years_experience?: string
}
```

**Profile Tables**:
- `public.clients` - Stores client profiles (id, user_id, full_name, email, phone, created_at, updated_at)
- `public.agents` - Stores agent profiles with additional fields (agency_name, license_number, area_of_operation, years_experience)

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
2. **OAuth** - Social login (Google, Microsoft, X/Twitter)

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

**Current Implementation**:
- **Header**: Dropdown menus for "Sign In" and "Sign Up" buttons
  - Sign In dropdown: "As Client" and "As Agent" options (both go to `/sign-in`)
  - Sign Up dropdown: "As Client" (→ `/sign-up/client`) and "As Agent" (→ `/sign-up/agent`)
- **Sign-In Page**: Unified form without tabs (backend handles user type detection)
- **Sign-Up Pages**: Separate pages for clients and agents
- **Backend Logic**: Checks `user_metadata.user_type` and redirects accordingly

**Documentation**: See `AUTH_FLOW_UPDATE.md` and `UNIFIED_SIGNIN_UPDATE.md` for complete details

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

**Providers**: Google, Microsoft, X (Twitter)

**Implementation Status**: 
- ✅ Google OAuth - Fully implemented (requires Supabase configuration)
- ⏳ Microsoft OAuth - Code ready (requires Supabase configuration)
- ⏳ X (Twitter) OAuth - Code ready (requires Supabase configuration)

**Components**:
- `OAuthButton.tsx` - Single provider button with loading states
- `OAuthButtonsGroup.tsx` - All providers grouped
- `AuthForm.tsx` - Unified form with OAuth integration
- `src/app/auth/callback/route.ts` - OAuth callback handler

**OAuth Flow**:
1. User clicks OAuth button (e.g., "Continue with Google")
2. `signInWithOAuth(provider, userType?)` server action called
3. User redirected to provider's OAuth consent screen
4. After authorization, provider redirects to `/auth/callback?code=...&user_type=...`
5. Callback route exchanges code for session
6. User metadata updated with user_type (if provided)
7. User redirected based on user_type:
   - `agent` → `/agent-dashboard`
   - `client` or no type → `/` (homepage)

**User Type Detection**:
- Sign-up pages pass user_type to OAuth flow
- Sign-in page detects user_type from existing metadata
- Callback route handles metadata updates and redirects

**Rules**:
- Always show OAuth options below email/password
- Use consistent provider icons and colors
- Handle OAuth errors gracefully
- Show loading states during OAuth flow
- Redirect to appropriate page based on user_type

**Setup Guide**: See `GOOGLE_OAUTH_SETUP.md` for complete Google OAuth configuration
**Implementation Details**: See `OAUTH_IMPLEMENTATION_SUMMARY.md` for technical details

---

## 🐛 Common Issues & Solutions

### Issue: Profile Not Created After Sign-Up

**Symptoms**: User created in `auth.users` but no profile in `clients` or `agents` table

**Diagnosis Steps**:
1. Check if user exists in Supabase Dashboard → Authentication → Users
2. Click on user and verify `user_metadata` contains `user_type`, `full_name`, `email`, `phone`
3. Check if INSERT policy exists:
   ```sql
   SELECT tablename, policyname, cmd 
   FROM pg_policies 
   WHERE tablename IN ('clients', 'agents');
   ```
4. Check server logs for errors like "Error creating client profile"

**Solutions**:

**Solution 1: Missing INSERT Policy** (Most Common)
```sql
-- Add INSERT policies
CREATE POLICY "Users can insert own client profile"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own agent profile"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Solution 2: Missing Service Role Key**
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Get from Supabase Dashboard → Settings → API → service_role key
- Restart dev server after adding

**Solution 3: Manually Create Profile for Existing User**
```sql
-- Get user_id
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'user@example.com';

-- Create profile manually
INSERT INTO public.clients (user_id, full_name, email, phone)
VALUES ('USER_ID_HERE', 'Full Name', 'email@example.com', 'phone');
```

**Solution 4: Create Profiles for All Users Without Profiles**
```sql
-- Automatically create profiles for users missing them
INSERT INTO public.clients (user_id, full_name, email, phone)
SELECT 
  u.id,
  u.raw_user_meta_data->>'full_name',
  u.email,
  u.raw_user_meta_data->>'phone'
FROM auth.users u
LEFT JOIN public.clients c ON u.id = c.user_id
WHERE c.user_id IS NULL
  AND u.raw_user_meta_data->>'user_type' = 'client';
```

---

### Issue: Email Rate Limit Exceeded

**Symptoms**: Error message "email rate limit exceeded" when signing up

**Cause**: Supabase limits confirmation emails sent in a short period (anti-spam protection)

**Solutions**:

**Solution 1: Disable Email Confirmations** (Recommended for Development)

1. Go to Supabase Dashboard → Authentication → Providers
2. Click on "Email" provider to expand settings
3. Scroll down to find "Enable email confirmations" or "Confirm email" toggle
4. Turn it **OFF** (disable it)
5. Click **Save** button
6. Try signing up again - should work instantly!

**Solution 2: Wait for Rate Limit Reset**
- Rate limit resets after 1 hour
- Wait and try again later

**Solution 3: Use Existing Test Users**
- Go to Supabase Dashboard → Authentication → Users
- Sign in with users you already created
- Or delete test users to free up emails

**Solution 4: Use Email Plus Trick** (Gmail)
- Instead of: `user@gmail.com`
- Use: `user+test1@gmail.com` or `user+test2@gmail.com`
- Gmail treats these as the same inbox
- Supabase sees them as different emails

**Important Notes**:
- **Development**: Keep email confirmations OFF for faster testing
- **Production**: Turn email confirmations back ON for security
- **Location**: Authentication → Providers → Email → Scroll down to find the toggle

---

### Issue: Can't Access Sign-In/Sign-Up Pages (Redirects to Homepage)

**Symptoms**: Clicking "Sign In" or "Sign Up" redirects to homepage

**Cause**: You're already signed in. Middleware redirects authenticated users away from auth pages.

**Solutions**:

**Solution 1: Clear Browser Cookies**
1. Open Developer Tools (F12)
2. Go to Application tab → Cookies → `http://localhost:3000`
3. Delete all cookies (especially ones starting with `sb-`)
4. Refresh page

**Solution 2: Clear Cookies via Console**
```javascript
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
location.reload();
```

**Solution 3: Add Sign-Out Functionality**
- Use the `SignOutButton` component in your header
- Or navigate to a protected route and sign out from there

---

### Issue: Can't Access Sign-In/Sign-Up Pages (Redirects to Homepage)

**Symptoms**: Clicking "Sign In" or "Sign Up" redirects to homepage

**Cause**: You're already signed in. Middleware redirects authenticated users away from auth pages.

**Solutions**:

**Solution 1: Clear Browser Cookies**
1. Open Developer Tools (F12)
2. Go to Application tab → Cookies → `http://localhost:3000`
3. Delete all cookies (especially ones starting with `sb-`)
4. Refresh page

**Solution 2: Clear Cookies via Console**
```javascript
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
location.reload();
```

**Solution 3: Add Sign-Out Functionality**
- Use the `SignOutButton` component in your header
- Or navigate to a protected route and sign out from there

---

### Issue: Permission Denied for Table (agents/clients)

**Symptoms**: Error "Failed to create profile: permission denied for table agents" or "permission denied for table clients"

**Error Code**: PostgreSQL error 42501 (insufficient_privilege)

**Root Cause**: Database permissions issue - either RLS policies are blocking inserts OR the service_role/authenticated role lacks table-level permissions

**Quick Fix**: See `START_HERE.md` → Choose your preferred guide style

**Complete Solution (3 Steps)**:

1. **Disable RLS temporarily** to test if it's the issue:
   ```sql
   ALTER TABLE public.agents DISABLE ROW LEVEL SECURITY;
   ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
   ```
   - Try signing up as agent
   - If it works → RLS was the issue, proceed to step 2
   - If it still fails → Permission issue, run step 3 first

2. **Grant table-level permissions** (required even with RLS disabled):
   ```sql
   GRANT ALL PRIVILEGES ON TABLE public.agents TO service_role;
   GRANT ALL PRIVILEGES ON TABLE public.clients TO service_role;
   GRANT ALL PRIVILEGES ON TABLE public.agents TO authenticated;
   GRANT ALL PRIVILEGES ON TABLE public.clients TO authenticated;
   GRANT USAGE ON SCHEMA public TO service_role;
   GRANT USAGE ON SCHEMA public TO authenticated;
   ```

3. **Re-enable RLS with correct policies**:
   - Run the complete script from `supabase/fix_agent_signup.sql`
   - This properly secures your database with RLS + correct policies
   - See `FIX_SUMMARY.md` for step-by-step instructions

**Verification**:
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('agents', 'clients');

-- Check permissions
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('agents', 'clients') AND grantee IN ('service_role', 'authenticated');

-- Check policies (if RLS enabled)
SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename IN ('clients', 'agents');
```

**Detailed Guides**:
- `START_HERE.md` - Choose your learning style (visual, checklist, quick, detailed)
- `FIX_SUMMARY.md` - Quick 3-step solution (5 minutes)
- `VISUAL_FIX_GUIDE.md` - Step-by-step with visual diagrams
- `CHECKLIST.md` - Checkbox-style guide
- `AGENT_SIGNUP_FIX_GUIDE.md` - Complete troubleshooting guide
- `SUPABASE_NAVIGATION_GUIDE.md` - How to navigate Supabase Dashboard
- `supabase/README.md` - About the SQL scripts

**SQL Scripts**:
- `supabase/fix_agent_signup.sql` - Complete fix with RLS properly configured
- `supabase/quick_fix_disable_rls.sql` - Quick test (disable RLS temporarily)

---

### Debugging Profile Creation Issues

If profiles are not being created after sign-up, follow these diagnostic steps:

**Step 1: Check if User Exists in Authentication**
1. Go to Supabase Dashboard → Authentication → Users
2. Look for your newly created user
3. If user doesn't exist, sign-up failed completely - check browser console and server logs

**Step 2: Verify User Metadata**
1. Click on the user in Authentication → Users
2. Check the `user_metadata` field (or `raw_user_meta_data` in Raw JSON view)
3. It should contain:
   ```json
   {
     "user_type": "client",
     "full_name": "Your Name",
     "email": "your@email.com",
     "phone": "your phone"
   }
   ```

**Step 3: Check RLS Policies**
Run this query in SQL Editor:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('clients', 'agents');
```

You should see policies for SELECT, UPDATE, and INSERT.

**Step 4: Check Server Logs**
Look at your terminal where `pnpm dev` is running for errors like:
- "Error creating client profile"
- "Error creating agent profile"
- PostgreSQL errors

**Step 5: Manually Test Profile Creation**
```sql
-- Get the user_id of your newly created user
SELECT id, email, raw_user_meta_data 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;

-- Try to manually insert a profile (replace USER_ID_HERE with actual ID)
INSERT INTO public.clients (user_id, full_name, email, phone)
VALUES (
  'USER_ID_HERE',
  'Test User',
  'test@example.com',
  '1234567890'
);
```

If manual insert fails, check the error message - it's likely an RLS policy issue.

**Step 6: Verify Service Role Key**
1. Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
2. Get from Supabase Dashboard → Settings → API → "Legacy anon, service_role API keys" tab
3. Copy the `service_role` key (NOT the anon key)
4. Update `.env.local` and restart dev server

---

### Database Maintenance Tasks

**Check if Tables Exist**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('clients', 'agents');
```

**View All Clients**:
```sql
SELECT * FROM public.clients ORDER BY created_at DESC;
```

**View All Agents**:
```sql
SELECT * FROM public.agents ORDER BY created_at DESC;
```

**Check User Metadata**:
```sql
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'user@example.com';
```

**Find Duplicate Profiles**:
```sql
-- Find duplicates
SELECT user_id, COUNT(*) 
FROM public.clients 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- Remove duplicates (keep first)
DELETE FROM public.clients 
WHERE id NOT IN (
  SELECT MIN(id) FROM public.clients GROUP BY user_id
);
```

**Manually Create Profile for Existing User**:
```sql
-- For client
INSERT INTO public.clients (user_id, full_name, email, phone)
SELECT id, raw_user_meta_data->>'full_name', email, raw_user_meta_data->>'phone'
FROM auth.users
WHERE email = 'client@example.com';

-- For agent
INSERT INTO public.agents (
  user_id, full_name, email, phone,
  agency_name, license_number, area_of_operation, years_experience
)
SELECT 
  id, 
  raw_user_meta_data->>'full_name', 
  email, 
  raw_user_meta_data->>'phone',
  raw_user_meta_data->>'agency_name',
  raw_user_meta_data->>'license_number',
  raw_user_meta_data->>'area_of_operation',
  raw_user_meta_data->>'years_experience'
FROM auth.users
WHERE email = 'agent@example.com';
```

---

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
- `design.md` - Design system, component patterns, styling guidelines, and form input styling
- `README.md` - Project overview and setup instructions

### Database & Authentication Documentation
- `SUPABASE_DATABASE_SETUP.md` - Complete database schema, profile tables, triggers, and RLS policies
- `QUICK_FIX_GUIDE.md` - Quick database setup without triggers (3 simple steps)
- `MIGRATION_TROUBLESHOOTING.md` - Database migration issues and solutions
- `GOOGLE_OAUTH_SETUP.md` - Step-by-step Google OAuth configuration guide
- `OAUTH_IMPLEMENTATION_SUMMARY.md` - OAuth implementation details and technical flow
- `E2E_TESTING_GUIDE.md` - Comprehensive end-to-end testing instructions

### Legacy Authentication Documentation (Deprecated)
- `AUTH_FLOW_UPDATE.md` - Authentication flow overview (see OAUTH_IMPLEMENTATION_SUMMARY.md instead)
- `UNIFIED_SIGNIN_UPDATE.md` - Unified sign-in page structure (see OAUTH_IMPLEMENTATION_SUMMARY.md instead)
- `HEADER_UPDATE_SUMMARY.md` - Header authentication UI/UX changes (deprecated)

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
12. **Form inputs MUST have borders** - Follow design.md form styling patterns
13. **Checkboxes MUST be visible** - Use `border-2 border-slate-300` class
10. **Read SUPABASE_SETUP.md** - Before touching auth code

---

## 📞 Need Help?

1. Check this file first (AGENTS.md)
2. Read `context.md` for complete project flow and all pages
3. **Database Setup Issues?** → Read `QUICK_FIX_GUIDE.md` (3 simple steps)
4. **Migration Errors?** → Read `MIGRATION_TROUBLESHOOTING.md`
5. **OAuth Setup?** → Read `GOOGLE_OAUTH_SETUP.md` (step-by-step)
6. **Testing?** → Read `E2E_TESTING_GUIDE.md` (comprehensive test suite)
7. Read `SUPABASE_DATABASE_SETUP.md` for complete database schema
8. Read `design.md` for design patterns and styling
9. Check `node_modules/next/dist/docs/` for Next.js APIs
10. Search official documentation
11. Ask for clarification if unclear

---

**Last Updated**: April 24, 2026
**Version**: 2.1.0
**Maintainer**: EstateFlow Development Team

**Recent Changes**:
- Added Google OAuth implementation (fully functional)
- Added role-based user profiles with dedicated tables
- Added database setup guides (trigger-based and manual)
- Added comprehensive testing guide
- Added troubleshooting documentation
- Updated form input styling (visible borders)
- **Added complete RLS troubleshooting guides** (permission denied errors)
- **Added email rate limit solutions** (disable confirmations for development)
- **Created comprehensive fix documentation** (7 guides + 2 SQL scripts)

---

*This document is the single source of truth for AI agents working on EstateFlow. Keep it updated as the project evolves.*