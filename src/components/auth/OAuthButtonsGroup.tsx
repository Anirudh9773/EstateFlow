"use client"

import OAuthButton from "./OAuthButton"

interface OAuthButtonsGroupProps {
  onOAuthClick?: (provider: string) => void
  disabled?: boolean
  loading?: boolean
  type?: "signin" | "signup"
  providers?: ("google" | "microsoft" | "twitter")[]
}

const defaultProviders: Array<"google" | "microsoft" | "twitter"> = [
  "google",
  "microsoft",
  "twitter"
]

export default function OAuthButtonsGroup({ 
  onOAuthClick, 
  disabled = false, 
  loading = false, 
  type = "signin",
  providers = defaultProviders 
}: OAuthButtonsGroupProps) {
  
  const handleProviderClick = (provider: string) => {
    if (onOAuthClick) {
      onOAuthClick(provider)
    } else {
      // Default behavior - log the provider click
      console.log(`${type} with ${provider}`)
    }
  }
  
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <OAuthButton
          key={provider}
          provider={provider}
          onClick={() => handleProviderClick(provider)}
          disabled={disabled}
          loading={loading}
          type={type}
        />
      ))}
    </div>
  )
}
