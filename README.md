1. User Flow

User clicks on a post link (from Reddit or Bluesky).

They land on a simple landing page with a form:

Input: email + Bluesky handle

CTA: “Get my SkyScore™”

Backend retrieves or simulates activity data for that handle.

A SkyScore is calculated and mapped to a persona/archetype (e.g., “The Connector,” “The Creator”).

A shareable image card is generated:

Avatar

Score (0–100)

Archetype name

SkyLume branding

The image + score are sent via email to the user.

Email encourages the user to share on Bluesky and invite friends.

2. Technical Scope (MVP)
Frontend (Landing Page)

Framework: React / SvelteKit (or even Carrd for ultra-fast MVP).

Form: email + handle submission.

Styling: Tailwind for clean UI.

Backend

Language: Node.js or Python.

Responsibilities:

Receive form submission

Store email + handle in database (Postgres / SQLite / Firebase)

Calculate SkyScore (simple heuristic formula)

Generate personalized image (PNG/JPEG)

Trigger email delivery

SkyScore Formula (MVP Version)

For now, use mock values or randomization (since real API integration may be complex). Example formula:

SkyScore = 50 + Random(-20 to +20)
Archetype = based on score range:
  80+  -> “Influencer”
  60–79 -> “Connector”
  40–59 -> “Explorer”
  <40  -> “Rookie”


(Later, integrate real Bluesky API data: posts count, likes, reposts, follower growth, etc.)

Image Generation

Library: node-canvas (Node.js) or Pillow (Python).

Output: PNG card with avatar, SkyScore, archetype, and branding.

Email Delivery

Service: Brevo (Sendinblue), Mailgun, or Resend.

Email #1: SkyScore + shareable image + CTA “Share on Bluesky.”

(Optional) Email #2: leaderboard/top scores → drives virality.

3. Hosting

Frontend: Vercel / Netlify (quick deploy).

Backend + DB: Railway / Render / Fly.io.

Image generation: same backend, as serverless function or container.

4. Validation Metrics

CTR: compare clicks from SkyScore posts vs. standard posts.

Email captures: # of signups vs. impressions.

Shares: # of users posting their SkyScore image on Bluesky.

5. Timeline (MVP)

Day 1–2: Landing page + form + DB.

Day 2–3: Score formula + image generation.

Day 3–4: Email automation + deployment.

Day 5: Test viral loop with real users.

✅ Deliverable: A working MVP where users can input their handle, get a SkyScore + image, and receive it by email with a share button.
🎯 Goal: Validate if this drives more clicks and signups compared to regular posts.