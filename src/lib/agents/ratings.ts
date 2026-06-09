'use server'

import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'

/**
 * Scrapes Trustpilot public HTML to extract rating and review count
 */
export async function scrapeTrustpilotRating(username: string): Promise<{ rating: number; reviewCount: number } | null> {
  try {
    const cleanUsername = username.trim().toLowerCase();
    const url = `https://www.trustpilot.com/review/${cleanUsername}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 }, // Cache fetch for 1 hour
    });

    if (!response.ok) {
      console.warn(`[Ratings Sync] Trustpilot page returned status ${response.status} for ${cleanUsername}`);
      return null;
    }

    const html = await response.text();

    // 1. Try JSON-LD Parsing (standard for SEO schema snippets)
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1].trim());
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item.aggregateRating) {
            const rating = parseFloat(item.aggregateRating.ratingValue);
            const reviewCount = parseInt(item.aggregateRating.reviewCount, 10);
            if (!isNaN(rating) && !isNaN(reviewCount)) {
              return { rating, reviewCount };
            }
          }
        }
      } catch {
        // Parse error for script tags that are not JSON-LD
      }
    }

    // 2. Fallback to Microdata metadata tags
    const ratingMeta = html.match(/itemprop="ratingValue"[^>]*content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]*itemprop="ratingValue"/i);
    const countMeta = html.match(/itemprop="reviewCount"[^>]*content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]*itemprop="reviewCount"/i);
    
    if (ratingMeta && countMeta) {
      const rating = parseFloat(ratingMeta[1]);
      const reviewCount = parseInt(countMeta[1], 10);
      if (!isNaN(rating) && !isNaN(reviewCount)) {
        return { rating, reviewCount };
      }
    }

    return null;
  } catch (error) {
    console.error(`[Ratings Sync] Exception scraping Trustpilot for ${username}:`, error);
    return null;
  }
}

/**
 * Scrapes allAgents public HTML to extract rating and review count
 */
export async function scrapeAllagentsRating(username: string): Promise<{ rating: number; reviewCount: number } | null> {
  try {
    const cleanUsername = username.trim().toLowerCase();
    const url = `https://www.allagents.co.uk/${cleanUsername}/`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`[Ratings Sync] allAgents page returned status ${response.status} for ${cleanUsername}`);
      return null;
    }

    const html = await response.text();

    // 1. Try JSON-LD Parsing
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1].trim());
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item.aggregateRating) {
            const rating = parseFloat(item.aggregateRating.ratingValue);
            const reviewCount = parseInt(item.aggregateRating.reviewCount, 10);
            if (!isNaN(rating) && !isNaN(reviewCount)) {
              return { rating, reviewCount };
            }
          }
        }
      } catch {}
    }

    // 2. Try standard microdata attributes
    const ratingMeta = html.match(/itemprop="ratingValue"[^>]*content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]*itemprop="ratingValue"/i);
    const countMeta = html.match(/itemprop="reviewCount"[^>]*content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]*itemprop="reviewCount"/i);
    
    if (ratingMeta && countMeta) {
      const rating = parseFloat(ratingMeta[1]);
      const reviewCount = parseInt(countMeta[1], 10);
      if (!isNaN(rating) && !isNaN(reviewCount)) {
        return { rating, reviewCount };
      }
    }

    // 3. Fallback: Parse common HTML rating metrics tags on allAgents
    const scoreMatch = html.match(/class="[^"]*score[^"]*"[^>]*>([\d.]+)</i) || html.match(/class="[^"]*rating[^"]*"[^>]*>([\d.]+)</i);
    const countMatch = html.match(/([\d,]+) reviews/i) || html.match(/>([\d,]+) customer reviews</i);
    if (scoreMatch && countMatch) {
      const rating = parseFloat(scoreMatch[1]);
      const reviewCount = parseInt(countMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(rating) && !isNaN(reviewCount)) {
        return { rating, reviewCount };
      }
    }

    return null;
  } catch (error) {
    console.error(`[Ratings Sync] Exception scraping allAgents for ${username}:`, error);
    return null;
  }
}

/**
 * Fetches Google Place details if a Place ID and Google Places API Key are configured
 */
export async function fetchGoogleRating(placeId: string): Promise<{ rating: number; reviewCount: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    // If no key is set, fail silently so we rely on manual entry values
    return null;
  }

  try {
    const cleanPlaceId = placeId.trim();
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${cleanPlaceId}&fields=rating,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.result) {
      const rating = parseFloat(data.result.rating);
      const reviewCount = parseInt(data.result.user_ratings_total, 10);
      if (!isNaN(rating) && !isNaN(reviewCount)) {
        return { rating, reviewCount };
      }
    }
    return null;
  } catch (error) {
    console.error(`[Ratings Sync] Exception querying Google Places API for place_id ${placeId}:`, error);
    return null;
  }
}

/**
 * Server Action: Synchronizes ratings for a given agent.
 * Scrapes Trustpilot, allAgents, and queries Google Places if configured.
 * Updates the database record with the new values.
 */
export async function syncAgentRatings(agentId: string) {
  try {
    const supabase = await createSupabaseServerClient()

    // Fetch the agent settings from the database
    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single()

    if (fetchError || !agent) {
      return { error: 'Agent profile not found in database.' }
    }

    const updates: Record<string, string | number | null | undefined> = {
      ratings_last_synced_at: new Date().toISOString()
    }

    let trustpilotStatus: 'skipped' | 'success' | 'failed' = 'skipped'
    let allagentsStatus: 'skipped' | 'success' | 'failed' = 'skipped'
    let googleStatus: 'skipped' | 'success' | 'failed' = 'skipped'

    // 1. Sync Trustpilot
    if (agent.trustpilot_username) {
      const trustpilot = await scrapeTrustpilotRating(agent.trustpilot_username)
      if (trustpilot) {
        updates.trustpilot_rating = trustpilot.rating
        updates.trustpilot_review_count = trustpilot.reviewCount
        trustpilotStatus = 'success'
      } else {
        trustpilotStatus = 'failed'
      }
    }

    // 2. Sync allAgents
    if (agent.allagents_username) {
      const allagents = await scrapeAllagentsRating(agent.allagents_username)
      if (allagents) {
        updates.allagents_rating = allagents.rating
        updates.allagents_review_count = allagents.reviewCount
        allagentsStatus = 'success'
      } else {
        allagentsStatus = 'failed'
      }
    }

    // 3. Sync Google Places
    if (agent.google_place_id) {
      const google = await fetchGoogleRating(agent.google_place_id)
      if (google) {
        updates.google_rating = google.rating
        updates.google_review_count = google.reviewCount
        googleStatus = 'success'
      } else {
        googleStatus = 'failed'
      }
    }

    // Update database record
    const { error: updateError } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', agentId)

    if (updateError) {
      console.error('[Ratings Sync] Database update failed:', updateError)
      return { error: 'Failed to update database with synchronized ratings.' }
    }

    // Revalidate paths to refresh profile views
    revalidatePath(`/agents/${agentId}`)
    revalidatePath('/agents')
    revalidatePath('/find-an-agent')

    // Determine warnings
    const warnings: string[] = []
    if (trustpilotStatus === 'failed') warnings.push('Trustpilot')
    if (allagentsStatus === 'failed') warnings.push('allAgents')
    if (googleStatus === 'failed') warnings.push('Google Reviews')

    if (warnings.length > 0) {
      return {
        success: true,
        warning: true,
        message: `Sync completed with warnings. Could not auto-sync: ${warnings.join(', ')}. Please use manual overrides for these platforms.`
      }
    }

    return { success: true, message: 'Ratings synchronized successfully.' }
  } catch (error) {
    console.error('[Ratings Sync] Server action exception:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during sync.'
    return { error: message }
  }
}
