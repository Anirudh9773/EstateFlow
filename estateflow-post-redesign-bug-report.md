# EstateFlow — Post-Redesign QA Report & Fix Brief

**Context:** We redesigned EstateFlow (`https://estate-flow-seven.vercel.app/`) to move from the old light/cream corporate look to a dark, luxury "gold-on-charcoal" theme, inspired by a reference design (Astoria Elite Estates — dark navy/black backgrounds, gold accents, serif headings, glass panels). The redesign was applied to the homepage, but a full pass across the rest of the site turned up **30 screenshots worth of issues**, grouped below into 3 root-cause categories plus a page-by-page checklist.

Every screenshot referenced below is included in the `images/` folder that ships alongside this file, named to match the numbers used here.

---

## Root cause #1 (most common): Text color = background color ("invisible text" bug)

This is the same underlying bug showing up on many different pages/components: a text element is being rendered using a color token that is the same as (or nearly the same as) its background color, so the text is only readable when hovered, selected, or highlighted. This is **not 12 separate bugs** — it's most likely one or two shared CSS variables (e.g. a "muted text" or "heading" color token) that got set to a dark value on a dark background somewhere in the global theme/tailwind config, and every component inheriting that token is now broken.

**Where it shows up:**

| # | Page | What's invisible | Screenshot |
|---|------|-------------------|------------|
| 1 | Agent profile page | Agent name "Oliver Hartley", stat numbers (340, 15, <2 hours, 4.9) all invisible until hover | `01-agent-profile-invisible-text.png` |
| 2 | Find an Agent (hero) | "Connect with verified property experts" heading invisible | `02-agents-page-heading-invisible.png` |
| 3 | Sign In page | "Welcome back" heading invisible | `03-signin-heading-invisible.png` |
| 4 | Find an Agent (list) | "All Agents" section heading invisible | `04-all-agents-heading-invisible.png` |
| 5 | Client Pricing page | Plan titles (Basic/Professional/Enterprise) and prices (£49/£149/Custom) invisible | `05-client-pricing-titles-invisible.png` |
| 6 | Checkout page | "Payment Processing Coming Soon" title invisible | `06-checkout-title-invisible.png` |
| 13 | Sign Up page | "Create a Client Account" heading invisible | `13-signup-heading-invisible.png` |
| 15 | Agent Dashboard → Overview | Stat numbers (Active Leads: 12, Properties Listed: 8, Response Rate: 94%, Avg Response Time: 1.8h) invisible | `15-agent-dashboard-overview-stats-invisible.png` |
| 17 | Agent Dashboard → Leads & Inquiries | All client-name rows in the table are invisible against the dark row background | `17-leads-table-bad-hover-effect.png`, `18-leads-table-rows-invisible.png` |
| 21 | Agent Pricing (marketing) page | Plan titles (Local/City/State/National Agent) and prices (£29/£79/£149/£299) invisible | `21-agent-pricing-plans-titles-invisible.png` |
| 22 | Agent Pricing → Compare Plans table | "Compare All Plans" heading + entire left "Feature" column + row labels invisible | `22-compare-plans-table-invisible.png` |
| 24 | Client Dashboard → Overview | Stat values ("2" properties submitted, "Active" agent matches, "<24 hrs" match time) invisible | `24-client-dashboard-overview-stats-invisible.png` |
| 26 | Client Dashboard → Account Settings | Input field values (Full Name, Phone Number) are typed but invisible — text color matches input background | `26-client-account-settings-text-invisible.png` |
| 27 | Submit Property modal — Step 1/5 | Heading "Find The Best Real Estate Agent For You" + all 4 option labels (Renting/Letting/Selling/Letting & Selling) + the 3 checklist lines are invisible | `27-submit-property-step1-text-invisible.png` |
| 28 | Submit Property modal — Step 2/5 | Heading + postcode input placeholder/typed text invisible (confirmed live: typed text disappears as you type) | `28-submit-property-step2-input-text-invisible.png` |
| 29 | Submit Property modal — Last Step | Heading "Personal Information" + phone number field text + "Submit & Find Agents" button label all invisible | `29-submit-property-laststep-text-invisible.png` |
| 30 | Contact page — sidebar cards | The actual email/phone/address detail text under "EMAIL US" / "PRIVACY & LEGAL" / "CALL US" / "OUR OFFICE" labels is invisible | `30-contact-page-sidebar-labels-invisible.png` |

**Fix instructions for this category:**
1. Audit every place a dark-on-dark or gold-on-gold text color is being applied — this is very likely one shared Tailwind class or CSS variable (e.g. a "heading" or "value" text color token defaulting to something like the card background color instead of white/off-white).
2. Do **not** patch each page's text color individually — trace it back to the shared token/class first, since the same bug is repeating identically across at least 15 different components. Fix the token, then spot-check every page in the table above to confirm.
3. Pay special attention to: page `<h1>`/`<h2>` headings on dark hero bands, stat/metric numbers inside dark cards, table row text, and form input `value`/typed text color inside dark-themed inputs.
4. After fixing, re-check contrast — text should be off-white (`#F5F3EE`-ish) or gold on dark backgrounds, never a color close to the background itself.

---

## Root cause #2: Broken/invisible hover states

Separate from root cause #1, some interactive elements are fine at rest but break specifically **on hover** — a hover style is swapping the text/icon color to something invisible against the hover background, or hiding content entirely.

| # | Where | What happens | Screenshot |
|---|-------|---------------|------------|
| 14 | Sign Up page → "Sign up with Google" button | On hover, the Google icon + "Sign up with Google" text both disappear | `14-signup-google-button-hover-bug.png` |
| 17 | Agent Dashboard → Leads & Inquiries table | Hovering a row shows a large blank white tooltip-like box with no readable content over the row ("BAD HOVER EFFECT") | `17-leads-table-bad-hover-effect.png` |
| 18 | Agent Dashboard → Leads & Inquiries table | Only the currently-hovered row becomes readable; all other rows stay invisible (should just be a subtle row highlight, not an all-or-nothing visibility toggle) | `18-leads-table-rows-invisible.png` |

**Fix instructions for this category:**
1. Find the hover-state CSS for buttons/table rows in these components and check whether the `:hover` text/icon color is being set to match the hover background color (same root issue as category 1, but specifically triggered by `:hover`).
2. The Leads & Inquiries table hover should be a **simple background highlight on the row**, not a mechanism that hides/reveals text — right now it looks like text visibility is being controlled by something that only resolves on hover (e.g. a text color with very low opacity that isn't actually meant to be permanent).
3. Test all interactive elements (buttons, table rows, cards) in both light and dark themed sections for this same issue — it may exist elsewhere that wasn't caught in these screenshots.

---

## Root cause #3: Pages/components never updated to the new dark/gold theme

These pages still use the **old light/cream or plain navy design** and were not touched during the redesign, so the site currently looks inconsistent — some pages look like the new Astoria-inspired dark/gold design, others still look like the old EstateFlow theme.

| # | Page | Current state | Screenshot |
|---|------|----------------|------------|
| 9 | About Us | Hero uses a plain navy gradient (not the dark charcoal + gold system used elsewhere), body sections are still plain white/light-gray with the old serif-less heading style | `09-about-page-old-theme.png` |
| 10 | Contact | Hero uses the same plain navy gradient, form section below is on an old cream/light background instead of the dark theme | `10-contact-page-old-theme.png` |
| 11 | Privacy Policy | Same plain navy hero band, white body with unstyled default headings/icons — not restyled at all | `11-privacy-page-old-theme.png` |
| 12 | Terms of Service | Same as above — not restyled | `12-terms-page-old-theme.png` |
| 8, 23 | FAQ sections (client pricing & agent pricing) | FAQ accordion is still on a plain white background with default black/gray text — doesn't match the dark theme used in the rest of the page above it | `08-pricing-faq-light-theme.png`, `23-agent-pricing-faq-theme-mismatch.png` |
| 16 | Agent Dashboard → Property Listings | Listing cards sit on a plain white background — clashes with the dark sidebar/nav right next to it | `16-agent-dashboard-listings-theme-mismatch.png` |

**Fix instructions for this category:**
1. Apply the same dark background + gold accent + serif heading system already used on the Home, Agents, and Pricing hero sections to: About, Contact, Privacy Policy, and Terms of Service hero bands **and** their body content sections.
2. Decide and apply consistently: should FAQ accordions and dashboard data tables/cards stay on a light background for readability (common pattern even in dark-themed sites), or should they also go fully dark? Recommendation: keep dense data tables (leads, listings, analytics) on light backgrounds for scanability, but make sure the *surrounding* page (headers, sidebar, section titles) is fully dark and consistent — right now it's a mix of both without a clear pattern.
3. Whatever pattern is chosen, apply it uniformly across every page — right now About/Contact/Privacy/Terms all use one look, Home/Agents/Pricing use another, and the dashboards mix both.

---

## Other one-off issues (not part of the categories above)

| # | Where | Issue | Screenshot |
|---|-------|-------|------------|
| 1, 20 | Agent profile page & Settings & Profile page | There's an empty dark rounded button/badge with no visible label (circled in the screenshot) — looks like a component rendering with no text/icon content at all, not just an invisible-text issue | `01-agent-profile-invisible-text.png`, `20-settings-profile-empty-button.png` |

**Fix instructions:** Check what these empty elements are supposed to render (likely a badge or secondary action button) — they may be missing a prop/label rather than having a color contrast issue.

---

## Reference material

- **Target design direction:** dark charcoal/navy background, warm gold accent, serif headings, glass-panel search bars — see the reference screenshot and prior design brief already shared for the homepage redesign.
- **Live site to test against:** `https://estate-flow-seven.vercel.app/`
- **Pages confirmed already working correctly** (use these as the reference for "what good looks like" on this site): Agent Pricing cards for-reference (`07-agent-pricing-cards-forreference.png`), Analytics page (`19-analytics-page-reference-ok.png`), My Submitted Properties (`25-my-submitted-properties-reference-ok.png`).

## What I need from you
1. Go through Root Cause #1 first — this is a single shared bug causing the majority of the issues, so fixing the underlying text-color token should resolve ~15 of the 30 screenshots at once.
2. Fix the two hover-state bugs in Root Cause #2.
3. Restyle the four untouched pages (About, Contact, Privacy, Terms) plus the FAQ sections and dashboard listings page to match the rest of the site, per Root Cause #3.
4. Fix the two empty-button instances.
5. Once done, re-screenshot every page in this report so we can confirm each item is resolved.
