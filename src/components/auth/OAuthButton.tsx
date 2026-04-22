"use client"

import { Button } from "@/components/ui/button"

interface OAuthButtonProps {
  provider: "google" | "yahoo" | "microsoft" | "apple" | "facebook"
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: "signin" | "signup"
}

const providerConfig = {
  google: {
    name: "Google",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  yahoo: {
    name: "Yahoo",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#6001D2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        <path fill="#FF7900" d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12h20z"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Y!</text>
      </svg>
    ),
  },
  microsoft: {
    name: "Microsoft",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="2" fill="#F25022"/>
        <rect x="2" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
        <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
        <rect x="12.5" y="2" width="9.5" height="9.5" fill="#FFB900"/>
      </svg>
    ),
  },
  apple: {
    name: "Apple",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#000000" d="M17.05 20.28c-.98.95-2.05.88-3.08.43-1.09-.46-2.09-.48-3.24 0-1.44.62-2.66.44-4.02-1.31C2.54 15.97 3.04 9.27 7.72 9.03c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.2 4.36zm-2.28-13.92c.07-1.23-.9-2.26-2.03-2.36-1.14.11-1.99 1.35-1.92 2.58.07 1.23.9 2.26 2.03 2.36 1.14-.11 1.99-1.35 1.92-2.58z"/>
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
}

export default function OAuthButton({ 
  provider, 
  onClick, 
  disabled = false, 
  loading = false, 
  type = "signin" 
}: OAuthButtonProps) {
  const config = providerConfig[provider]
  const actionText = type === "signin" ? "Continue with" : "Sign up with"
  
  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full gap-2"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {config.icon}
      {actionText} {config.name}
    </Button>
  )
}
