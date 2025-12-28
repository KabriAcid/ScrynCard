# ScrynCard Pitch Deck

## 1. Title & Vision
- ScrynCard: Secure, scalable citizen assistance via smart scratch cards
- Vision: Transparent distribution, fraud‑aware payouts, data‑driven oversight

## 2. Problem & Opportunity
- Manual aid distribution is leaky, slow, and hard to audit
- Citizens lack simple, offline‑friendly redemption pathways
- Leaders need trusted reporting and fraud signals

## 3. Solution Overview
- End‑to‑end platform: card orders → distribution → citizen redemption → payouts
- Real‑time dashboards for politicians and admins
- Fraud detection signals and review flows

## 4. How It Works (Flow)
1) Politician places card order (batches, denominations)
2) Cards printed & distributed (codes + checksums)
3) Citizen redeems card (bank details, validation)
4) Payout queued and monitored (fraud flags, status)
5) Analytics & audit trails across roles

## 5. Citizen Experience
- Clear redemption flow and bank validation
- Mobile‑friendly, low friction forms
- Status feedback: Pending → Processing → Completed/Failed

## 6. Politician Portal
- Orders dashboard with totals, fees, statuses
- New order workflow (denominations, quantities, summary)
- Order details + payment breakdown

## 7. Redemptions & Payouts
- Redemption stats: totals, completed payouts, trends
- Table view: citizen, card code, amount, bank, status

## 8. Admin Dashboard
- KPIs: orders, redemptions, active programs
- Entity management (politicians, orders, redemptions)

## 9. Analytics
- Charts: distribution, redemption rate, revenue
- Segmentation by state/LGA, timeframe

## 10. Fraud & Risk Center
- Pending reviews, risk levels, flags
- Case decisions: approved/rejected, audit trail

## 11. Security & Compliance
- JWT sessions, cookie handling, password hashing
- Token rotation and card code safeguards
- Immutable logging and review workflows

## 12. Technical Architecture
- React + Vite + Tailwind
- State: Zustand stores (auth, politician, admin)
- Mock services/data for demo fidelity

## 13. Business Model
- Service fee (e.g., 10–15%) + printing costs
- Tiered analytics & fraud tooling for admins

## 14. Go‑to‑Market
- Pilot with regional programs
- Partnerships with banks and verified print vendors

## 15. Roadmap
- Real APIs & payouts
- Stronger fraud scoring and ML signals
- Offline redemption kiosks

## 16. Ask & Next Steps
- Pilot sponsorship, rollout partners, and initial budgets
- Timeline to production with phased testing

---

## Brand Color Palette (RGB)
Light theme (from CSS HSL tokens in `src/index.css`):
- Background: rgb(220, 250, 220) — hsl(120, 73%, 92%)
- Foreground: rgb(15, 61, 15) — hsl(120, 60%, 15%)
- Card: rgb(233, 252, 233) — hsl(120, 73%, 95%)
- Primary: rgb(34, 135, 34) — hsl(120, 60%, 33%)
- Primary foreground: rgb(233, 252, 233) — hsl(120, 73%, 95%)
- Secondary: rgb(201, 232, 201) — hsl(120, 40%, 85%)
- Secondary foreground: rgb(15, 61, 15) — hsl(120, 60%, 15%)
- Muted: rgb(212, 237, 212) — hsl(120, 40%, 88%)
- Muted foreground: rgb(86, 144, 86) — hsl(120, 25%, 45%)
- Accent (teal): rgb(0, 128, 128) — hsl(180, 100%, 25%)
- Accent foreground: rgb(229, 255, 255) — hsl(180, 100%, 95%)
- Destructive (red): rgb(239, 68, 68) — hsl(0, 84.2%, 60.2%)
- Destructive foreground: rgb(250, 250, 250) — hsl(0, 0%, 98%)
- Border: rgb(189, 219, 189) — hsl(120, 30%, 80%)
- Input: rgb(205, 228, 205) — hsl(120, 30%, 85%)
- Ring: rgb(34, 135, 34) — hsl(120, 60%, 33%)
- Charts:
  - Chart‑1: rgb(34, 135, 34) — hsl(120, 60%, 33%)
  - Chart‑2: rgb(0, 128, 128) — hsl(180, 100%, 25%)
  - Chart‑3: rgb(94, 186, 94) — hsl(120, 40%, 55%)
  - Chart‑4: rgb(57, 172, 172) — hsl(180, 50%, 45%)
  - Chart‑5: rgb(139, 192, 139) — hsl(120, 30%, 65%)
- Sidebar:
  - Background: rgb(233, 252, 233) — hsl(120, 73%, 95%)
  - Foreground: rgb(15, 61, 15) — hsl(120, 60%, 15%)

Dark theme:
- Background: hsl(120, 15%, 5%)
- Foreground: hsl(120, 20%, 95%)
- Primary: hsl(120, 60%, 40%)
- Accent: hsl(180, 100%, 35%)
- Destructive: hsl(0, 63%, 40%)
- (Use Tailwind `hsl(var(--...))` mapping; RGB can be derived similarly.)

---

## Slide Order & Page Notes
1. Title & Vision — brand hero, one‑liner value
2. Problem & Opportunity — 3 bullets + stat
3. Solution Overview — architecture diagram
4. How It Works — numbered flow
5. Citizen Experience — redemption screenshots
6. Politician Portal — orders, new order, details
7. Redemptions & Payouts — stats + table
8. Admin Dashboard — KPIs + entities
9. Analytics — charts examples
10. Fraud & Risk — case list & decision flow
11. Security & Compliance — key practices
12. Technical Architecture — stack & modules
13. Business Model — fees, tiers
14. Go‑to‑Market — pilot plan
15. Roadmap — phased milestones
16. Ask & Next Steps — partnerships, budget

> Tip: Use consistent card layouts, pulse skeletons for demo flow, and the primary/accent palette to unify slides.
