# Ticket 26 (v3): Agent–Client Property Engagement Workflow — Dual Mode + Cancellation

**Type:** New Feature (structural — touches both dashboards, DB schema, and RLS)
**Supersedes:** v1 (Direct-only) and v2 (added Open Pool mode). This is the canonical version — the coworker should build from this file alone, not cross-reference v1/v2.
**Status:** ⚠️ Requires developer sign-off before implementation. Coupled to Ticket 15 (dashboard redesign). Do not start until Section 10's open questions are answered — several directly change what gets built.

---

## 1. Two Supported Engagement Modes

- **Mode A — Direct Request:** Client picks one specific agent from the directory; that agent accepts/declines.
- **Mode B — Open Pool (first-to-accept):** Client's submission goes to multiple matched agents (same location/tier filtering the Agent Directory already uses). First to accept wins; the rest auto-close.

Both modes share the same `property_engagements` table and status pipeline.

## 2. Where Mode Gets Chosen

Client picks the mode as a wizard step ("Choose a specific agent" vs. "Get matched — first to respond takes it"). Keep this behind a config flag so the developer can restrict to one mode at launch without a rebuild — see Open Question 1.

---

## 3. Data Model (Supabase / Postgres)

Table: `property_engagements`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `property_id` | uuid, FK → `properties.id` | |
| `client_id` | uuid, FK → `profiles.id` | |
| `agent_id` | uuid, FK → `profiles.id` | |
| `status` | enum: `pending`, `accepted`, `declined`, `withdrawn`, `expired`, `cancelled`, `completed` | see revised semantics below |
| `engagement_mode` | enum: `direct`, `open_pool` | set at creation |
| `cancelled_by` | enum: `client`, `agent`, nullable | **new** — only set when `status = 'cancelled'` |
| `cancellation_reason` | text, nullable | **new** — free text; consider an optional preset dropdown (see UI section) feeding into this field |
| `decline_reason`, `requested_at`, `responded_at`, `notes`, `created_at`, `updated_at` | unchanged | |

**Revised status semantics — this matters, don't conflate these two:**
- `withdrawn` = client pulls a **still-pending** request, before any agent accepted. No reason required, low-stakes.
- `cancelled` = **either party** ends an **already-accepted** engagement. Requires a reason, is a bigger deal, and needs its own audit trail via `cancelled_by` + `cancellation_reason`.

Do not reuse `withdrawn` for post-acceptance cancellation — they need to be queryable and displayable separately (a client backing out of a request they haven't heard back on yet is routine; cancelling an agent who already accepted is a signal worth tracking).

**Concurrency guard (unchanged from v2, still load-bearing):**
```sql
CREATE UNIQUE INDEX one_accepted_engagement_per_property
ON property_engagements (property_id)
WHERE status = 'accepted';
```
Because this index only applies while `status = 'accepted'`, moving a row to `cancelled` automatically frees the property up for a new engagement — no extra cleanup logic needed there.

---

## 4. Matching Logic for Mode B

Unchanged from v2: reuse the existing Agent Directory location/tier filter, cap pool size (placeholder: 5, confirm in Open Questions).

---

## 5. State Machine (Revised)

```
pending ──accept──> accepted ──complete──> completed
   │                    │
   ├──decline(agent)──> declined
   │                    │
   ├──withdraw(client, pre-accept only)──> withdrawn
   │                    │
   └──expire(system, Mode B sibling)──> expired
                         │
                         └──cancel(client OR agent, post-accept)──> cancelled
```

- `pending → accepted`: agent only, protected by the unique index.
- `pending → declined`: agent only.
- `pending → withdrawn`: client only, **only while still `pending`**.
- `pending → expired`: system-triggered, Mode B only.
- `accepted → completed`: agent only.
- **`accepted → cancelled`: client OR agent, with `cancelled_by` and `cancellation_reason` recorded.** This is the new transition.

---

## 6. Post-Acceptance Cancellation (New)

### User stories
- **As a client**, after an agent accepts, if I'm unhappy with them (rating, unresponsive, bad vibe from a call, whatever) I want to end the engagement and go find a different agent, without it looking like the property listing itself was withdrawn.
- **As an agent**, if I accept a property and then realize it's not a good fit (out of my depth, client is unresponsive, property doesn't match what I can sell), I want a clean way to back out rather than just going silent.

### What happens on cancellation
1. Row moves `accepted → cancelled`, with `cancelled_by` and a reason recorded.
2. The property becomes available again — client is prompted to either pick a new agent (Mode A) or re-enter the matching pool (Mode B). This is a **new** engagement row, not a reopened old one; history of the cancelled engagement stays intact for audit purposes.
3. The other party gets notified. If the client cancelled, the agent is told the engagement ended (and ideally the reason, if the client provided one, phrased non-punitively — see Open Question 4 on whether raw reasons should be shown verbatim to the agent). If the agent cancelled, the client is told and prompted to select a new agent.
4. Client dashboard should not show the property as "unhandled" with no explanation — it should clearly say something like "Your previous agent is no longer engaged with this property" plus a clear next step.

### Reason capture
Give both client and agent a short preset list plus free text, e.g. for clients: "Unresponsive," "Found a different way to sell/buy," "Concerns after viewing agent profile/reviews," "Other." Keep this optional-but-encouraged rather than a hard requirement that blocks cancellation — don't let reason-capture become a wall that stops someone from leaving when they want to leave.

---

## 7. UI Requirements

### Client Dashboard
- Mode A pending: unchanged (single agent, awaiting response).
- Mode B pending: "N agents notified — waiting for the first response."
- **Accepted state (either mode):** show the agent's card as before, plus a clearly visible but not overly prominent "This isn't working out — end engagement" action. This should require a confirm step (not a one-tap accidental action) and offer the preset/free-text reason picker from Section 6.
- **Post-cancellation state:** "No agent currently assigned" with a prominent CTA to restart (choose an agent / rejoin the pool).

### Agent Dashboard
- Pending Requests: unchanged from v2 (mode indicator, race-condition handling).
- **Active Engagements:** add a symmetric "End this engagement" action alongside whatever "mark as completed" control exists, with the same confirm + reason pattern.
- If the *client* cancels on the agent, the agent's Active Engagements list should reflect this promptly (moves out of "active," into a "past engagements" history view) rather than silently vanishing — agents should be able to see their own cancellation history for their own records.

---

## 8. Notifications

- New: notify the non-cancelling party when a `cancelled` transition happens, in addition to the existing accept/decline/pool-loss notifications from v1/v2.
- Keep the tone of client-initiated cancellation notifications to the agent neutral/factual, not exposing potentially harsh reason text verbatim by default — see Open Question 4.

---

## 9. Edge Cases

Carried over from v1/v2 (timeout, all-decline, withdraw-with-multiple-pending, pool-size-vs-availability), plus:

- **Cancel immediately after accept** (e.g., within minutes): should be allowed technically; whether it should be discouraged/rate-limited is a business question, not a technical one — see Open Question 3.
- **Cancel after work has already started** (e.g., agent has been actively engaging for weeks): the schema doesn't distinguish "just accepted" from "long-running accepted" — if the business wants different handling for late-stage cancellations (e.g., near a sale), that's out of scope for this ticket and should be raised separately once "completed"/contract semantics (Open Question, carried from v1) are settled.
- **Repeat cancellations by the same client or same agent:** the data is there to compute a cancellation rate per user, but do not build any reputation/rating consequence from it without explicit confirmation — see Open Question 2.

---

## 10. Open Questions — confirm with developer before building

**Carried over, still unanswered:** response timeout for pending (v1), "completed"/contract semantics (v1), whether client contact info is already exposed elsewhere (v1), Mode B phasing/launch scope (v2), pool size cap (v2), whether losing Mode B agents get notified (v2), mode-switching after a decline (v2).

**New, from this round:**
1. **Cooling-off / minimum notice:** should there be any restriction on how soon after accepting an agent can be cancelled (either direction), or is it unrestricted? This ticket assumes unrestricted unless told otherwise.
2. **Reputation consequences:** should a high cancellation rate (by either client or agent) surface anywhere — agent's tier, an internal admin flag, a visible rating impact? Explicitly do not build this without confirmation; it's easy to add later once the raw data (`cancelled_by`, `cancellation_reason`, timestamps) exists.
3. **Rate limiting:** should there be a cap on how many times a client can cancel-and-restart for the same property, to prevent thrashing an agent's queue? Assume no cap unless specified.
4. **Reason visibility:** when a client cancels and gives a reason (e.g., "concerns after viewing agent profile/reviews"), should the agent see that reason verbatim, a softened/generic version, or nothing at all? This affects whether `cancellation_reason` needs a separate agent-facing display transform.

Do not build the reason-capture UI or notification copy until Q4 is answered — it directly determines what agents are shown.

---

## 11. Acceptance Criteria

All criteria from v1 and v2, plus:

- [ ] `cancelled`, `cancelled_by`, `cancellation_reason` added to schema via migration.
- [ ] Client can cancel an `accepted` engagement from their dashboard, with confirm step and reason capture; row moves to `cancelled`, property becomes available for a new engagement.
- [ ] Agent can cancel an `accepted` engagement symmetrically.
- [ ] Cancelling does **not** delete history — cancelled rows remain queryable for both parties' "past engagements" views.
- [ ] The partial unique index correctly allows a **new** `accepted` row for a property after a prior one is `cancelled` (verify this doesn't require manual index/data cleanup).
- [ ] Client dashboard clearly distinguishes "no agent yet" (never had one) from "agent cancelled" (had one, no longer does) — these should not look identical to the client.
- [ ] Notifications fire correctly for both cancellation directions.
- [ ] Screenshot evidence for this section includes: client-initiated cancellation end-to-end, agent-initiated cancellation end-to-end, and confirmation that a new engagement can be created for the same property afterward.
