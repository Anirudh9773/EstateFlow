# EstateFlow

A modern, responsive real estate platform that connects property owners with verified real estate agents across the UK. Built with Next.js, TypeScript, and Tailwind CSS.

## Overview

EstateFlow is a comprehensive property platform designed to streamline the process of connecting homeowners with qualified real estate professionals. The platform features advanced filtering, agent verification, pricing transparency, and powerful dashboard tools for agents.

## Key Features

### For Homeowners & Property Seekers
- **Advanced Agent Search**: Filter agents by location, specialisation, ratings, and response time
- **Verified Agent Profiles**: Browse detailed profiles of 1,200+ verified agents
- **Transparent Pricing**: Clear pricing tiers with no hidden fees
- **Property Submission**: Easy property listing with intelligent agent matching
- **Mobile-First Design**: Fully responsive across all devices

### For Real Estate Agents
- **Professional Dashboard**: Comprehensive lead management and analytics
- **Lead Generation**: Access to qualified, verified leads in your coverage area
- **Performance Analytics**: Track conversion rates, response times, and revenue
- **Property Management**: Organize and track all your listings in one place
- **Flexible Pricing Plans**: Tiered subscription plans based on coverage area

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library with shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Authentication pages
    find-an-agent/        # Agent search and filtering
    pricing/              # Pricing information
    agent-dashboard/      # Agent management dashboard
    agent-login/          # Agent authentication
    page.tsx              # Homepage
  components/
    agents/               # Agent-specific components
    auth/                 # Authentication components
    common/               # Reusable UI components
    home/                 # Homepage components
    layout/               # Layout components
  data/                  # Mock data and constants
  lib/                   # Utility functions and constants
  types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd estateflow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages & Features

### Homepage
- Hero section with property search
- How it works overview
- Featured agents with filtering
- Statistics and testimonials
- Agent call-to-action

### Find Agent Page (`/find-an-agent`)
- Advanced search with real-time filtering
- Filter by location, specialisation, and sorting options
- Responsive agent card grid layout
- Detailed agent profiles with ratings and reviews

### Pricing Page (`/pricing`)
- Client pricing tiers (Free, Professional, Enterprise)
- Agent pricing overview with detailed breakdowns
- FAQ section with common questions
- Interactive pricing cards with hover effects

### Agent Dashboard (`/agent-dashboard`)
- Overview with key metrics and performance stats
- Lead management with priority and status tracking
- Property listings management with analytics
- Performance analytics and conversion tracking
- Profile settings and account management

### Agent Login (`/agent-login`)
- Professional authentication interface
- Split-screen design with agent benefits
- Form validation and error handling
- Google sign-in integration

## Design System

### Color Palette
- **Navy**: Primary brand color (`--color-navy`)
- **Gold**: Accent color (`--color-gold`)
- **Amber**: Client/primary actions
- **Emerald**: Agent/secondary actions
- **Surface**: Light backgrounds

### Responsive Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 640px+
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

### Component Patterns
- Mobile-first responsive design
- Consistent spacing and typography
- Interactive hover states and transitions
- Accessible form controls and navigation

## Development

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

### Styling Approach
- Tailwind CSS utility classes
- CSS custom properties for theme colors
- Responsive design patterns
- Consistent component spacing

### State Management
- React hooks for local state
- Context API for global state
- Server components for data fetching

## Deployment

### Vercel (Recommended)
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
```

### Other Platforms
The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean
- Railway
- Self-hosted VPS

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common questions

---

**EstateFlow** - Where properties meet the right agent.
