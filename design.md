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
- **Border:** Custom border color (`border-ef-border`)

## Form Input Styling

### Input Fields (Email, Password, Text, etc.)
- **Border**: `border border-slate-300` (visible border matching theme)
- **Focus State**: `focus:border-navy focus:ring-2 focus:ring-navy/20`
- **Hover State**: `hover:border-slate-400`
- **Disabled State**: `disabled:bg-slate-50 disabled:text-slate-500`
- **Padding**: `px-3 py-2` or `px-4 py-2` for larger inputs
- **Border Radius**: `rounded-lg` or `rounded-md`
- **Background**: `bg-white`

### Checkbox Styling
- **Border**: `border-2 border-slate-300` (visible border)
- **Checked State**: `data-[state=checked]:bg-navy data-[state=checked]:border-navy`
- **Focus State**: `focus:ring-2 focus:ring-navy/20`
- **Size**: `h-4 w-4` or `h-5 w-5`
- **Border Radius**: `rounded` or `rounded-sm`

### Select/Dropdown Styling
- **Border**: `border border-slate-300`
- **Focus State**: `focus:border-navy focus:ring-2 focus:ring-navy/20`
- **Background**: `bg-white`
- **Padding**: `px-3 py-2`

### Radio Button Styling
- **Border**: `border-2 border-slate-300`
- **Checked State**: `data-[state=checked]:border-navy`
- **Focus State**: `focus:ring-2 focus:ring-navy/20`

### Textarea Styling
- **Border**: `border border-slate-300`
- **Focus State**: `focus:border-navy focus:ring-2 focus:ring-navy/20`
- **Min Height**: `min-h-[100px]`
- **Resize**: `resize-y` or `resize-none`

### Form Field Pattern
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-slate-900">
    Field Label
  </label>
  <Input
    type="text"
    placeholder="Enter value"
    className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
  />
</div>
```

### Checkbox Pattern
```tsx
<div className="flex items-center gap-2">
  <Checkbox
    id="checkbox-id"
    className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
  />
  <label htmlFor="checkbox-id" className="text-sm">
    Checkbox Label
  </label>
</div>
```

### OAuth Button Styling

OAuth buttons for social authentication (Google, Microsoft, X/Twitter):

- **Border**: `border-2 border-slate-300` (visible 2px border)
- **Background**: `bg-white` (white background)
- **Hover**: `hover:bg-slate-50 hover:border-slate-400`
- **Height**: `h-11` (44px for better touch targets)
- **Text**: `text-slate-700 font-medium`
- **Layout**: Icon on left, text centered, full width
- **Spacing**: `space-y-3` between buttons in group
- **Loading State**: Disabled with spinner icon
- **Focus State**: `focus:ring-2 focus:ring-navy/20`

#### OAuth Button Pattern
```tsx
<Button 
  type="button" 
  variant="outline" 
  className="w-full gap-2 h-11 border-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-medium"
  disabled={isLoading}
>
  {isLoading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <ProviderIcon className="h-5 w-5" />
  )}
  <span className="flex-1 text-left">Continue with Provider</span>
</Button>
```

#### OAuth Buttons Group Pattern
```tsx
<div className="space-y-3">
  <OAuthButton provider="google" type="signin" onLoading={setIsLoading} />
  <OAuthButton provider="microsoft" type="signin" onLoading={setIsLoading} />
  <OAuthButton provider="twitter" type="signin" onLoading={setIsLoading} />
</div>

{/* Or use the group component */}
<OAuthButtonsGroup type="signin" />
```

#### OAuth Button Component Usage
```tsx
// In sign-in page
<OAuthButton 
  provider="google" 
  type="signin"  // No user type for sign-in
  onLoading={setIsLoading}
/>

// In client sign-up page
<OAuthButton 
  provider="google" 
  type="signup" 
  userType="client"  // Specify user type for sign-up
  onLoading={setIsLoading}
/>

// In agent sign-up page
<OAuthButton 
  provider="google" 
  type="signup" 
  userType="agent"  // Specify user type for sign-up
  onLoading={setIsLoading}
/>
```

### Authentication Form Layout

Authentication forms follow a consistent split-screen layout pattern:

#### Layout Structure
- **Left Panel**: Branding and value proposition (40% width on desktop)
- **Right Panel**: Form content (60% width on desktop)
- **Mobile**: Stacked layout (left panel hidden or minimal)

#### Form Container Pattern
```tsx
<div className="min-h-screen flex">
  {/* Left Panel - Branding */}
  <div className="hidden lg:flex lg:w-2/5 bg-navy text-white p-12 flex-col justify-between">
    <div>
      <Logo />
      <h1 className="text-3xl font-bold mt-8">Welcome to EstateFlow</h1>
      <p className="text-lg mt-4 text-white/80">
        Connect with verified real estate agents across the UK
      </p>
    </div>
    {/* Features list or testimonials */}
  </div>

  {/* Right Panel - Form */}
  <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
    <div className="w-full max-w-md space-y-8">
      {/* Form content */}
    </div>
  </div>
</div>
```

#### Form Content Pattern
```tsx
<div className="space-y-6">
  {/* Header */}
  <div className="text-center">
    <h2 className="text-2xl font-bold text-navy">Sign In</h2>
    <p className="text-sm text-slate-600 mt-2">
      Enter your credentials to continue
    </p>
  </div>

  {/* OAuth Buttons */}
  <div className="space-y-3">
    <OAuthButtonsGroup type="signin" />
  </div>

  {/* Divider */}
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-300" />
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-white text-slate-500">Or continue with email</span>
    </div>
  </div>

  {/* Email/Password Form */}
  <form className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-900">Email</label>
      <Input 
        type="email" 
        className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-900">Password</label>
      <Input 
        type="password" 
        className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
      />
    </div>
    <Button type="submit" className="w-full bg-navy text-gold hover:bg-navy/90">
      Sign In
    </Button>
  </form>

  {/* Footer Links */}
  <div className="text-center text-sm">
    <p className="text-slate-600">
      Don't have an account?{' '}
      <Link href="/sign-up/client" className="text-navy font-medium hover:underline">
        Sign up
      </Link>
    </p>
  </div>
</div>
```

#### Loading States
```tsx
// Button loading state
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Signing in...
    </>
  ) : (
    'Sign In'
  )}
</Button>

// OAuth button loading state
<OAuthButton 
  provider="google" 
  type="signin" 
  onLoading={setIsLoading}
  disabled={isLoading}
/>
```

#### Error Display Pattern
```tsx
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

#### Success Message Pattern
```tsx
{success && (
  <Alert className="border-green-200 bg-green-50 text-green-800">
    <CheckCircle className="h-4 w-4" />
    <AlertDescription>{success}</AlertDescription>
  </Alert>
)}
```

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
