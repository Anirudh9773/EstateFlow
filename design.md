# EstateFlow Design System

## Page Structure Pattern
```tsx
export default function PageName() {
  return (
    <main>
      <Section1 />
      <Section2 />
      <Section3 />
    </main>
  )
}
```

## Section Components

### 1. Hero Section
**File:** `Hero.tsx`
**Background:** `bg-surface`
**Structure:** 2-column grid (7:5 ratio)
**Key Elements:**
- SectionLabel at top
- H1 title with `text-navy` and responsive sizing
- GoldDivider component
- Description paragraph with `text-text-secondary`
- Button pair (primary + outline)
- AvatarStack with user count
- Right column: Property pills grid with rotation effects

### 2. How It Works Section
**File:** `HowItWorks.tsx`
**Background:** `bg-white`
**Structure:** Centered header + 3-column grid
**Key Elements:**
- SectionLabel + H2 + GoldDivider
- Numbered step cards with circular badges
- Arrow connectors between cards (desktop only)
- Card component with `border-ef-border`

### 3. Stats Bar Section
**File:** `StatsBar.tsx`
**Background:** `bg-navy`
**Structure:** 4-column grid with vertical separators
**Key Elements:**
- StatCard components (light variant)
- Vertical separators between stats
- Responsive grid (2 cols mobile, 4 cols desktop)

### 4. Featured Agents Section
**File:** `FeaturedAgents.tsx`
**Background:** `bg-surface`
**Structure:** Centered header + filter tabs + CTA
**Key Elements:**
- SectionLabel + H2 + GoldDivider
- AgentFilterTabs component
- Outline button CTA at bottom

### 5. Testimonials Section
**File:** `Testimonials.tsx`
**Background:** `bg-white`
**Structure:** Centered header + slider
**Key Elements:**
- SectionLabel + H2 + GoldDivider
- TestimonialSlider component
- Extra horizontal padding for slider

### 6. Why EstateFlow Section
**File:** `WhyEstateFlow.tsx`
**Background:** `bg-surface`
**Structure:** Centered header + 2-column feature grid
**Key Elements:**
- SectionLabel + H2 + GoldDivider
- Icon + title + description pattern
- 6 features in 2-column layout

### 7. Agent CTA Banner
**File:** `AgentCTABanner.tsx`
**Background:** `bg-navy`
**Structure:** 2-column grid (7:5 ratio)
**Key Elements:**
- Left: SectionLabel + H2 + description + bullet list
- Right: Pricing card with features
- Glassmorphism card effect

## Common Design Patterns

### Section Header Pattern
```tsx
<div className="text-center">
  <SectionLabel>LABEL TEXT</SectionLabel>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-navy mt-3">
    Section Title
  </h2>
  <GoldDivider className="mx-auto mt-4 sm:mt-5 mb-3" />
  <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg">
    Optional description text
  </p>
</div>
```

### Background Colors
- `bg-surface` - Light gray background
- `bg-white` - White background  
- `bg-navy` - Dark navy background

### Typography
- **Headings:** `text-navy`, `font-semibold`, responsive sizing
- **Body text:** `text-text-secondary`
- **Labels:** SectionLabel component
- **Muted text:** `text-text-muted`

### Spacing
- Section padding: `py-16 sm:py-20` (standard), `py-20` (large)
- Container: `max-w-7xl mx-auto px-4 sm:px-6`
- Grid gaps: `gap-6 sm:gap-8`

### Button Styles
- **Primary:** `bg-navy text-gold hover:bg-navy/90`
- **Outline:** `border-navy text-navy hover:bg-navy hover:text-gold`
- **Gold:** `bg-gold text-navy hover:bg-gold/90`

### Card Styles
- **Default:** `border-ef-border shadow-none`
- **Glass:** `bg-white/5 border-white/10`

## Color Palette
- **Navy:** Primary dark color (`text-navy`, `bg-navy`)
- **Gold:** Accent color (`text-gold`, `bg-gold`)
- **Surface:** Light background (`bg-surface`)
- **Text Secondary:** Muted text (`text-text-secondary`)
- **Text Muted:** Very muted text (`text-text-muted`)

## Responsive Breakpoints
- Mobile: Default styles
- sm: `640px`
- md: `768px`
- lg: `1024px`

## Component Imports
```tsx
import { SectionLabel, GoldDivider } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
```

## Usage Guidelines
1. Always use consistent section structure with proper backgrounds
2. Maintain spacing patterns for visual rhythm
3. Use responsive typography and grid systems
4. Apply consistent color scheme throughout
5. Include proper semantic HTML structure
6. Add section IDs for navigation where appropriate
