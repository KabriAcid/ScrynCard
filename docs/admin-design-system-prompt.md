# Scryn Admin Portal Design System – AI Builder Guide (Code‑Free)

## Project Overview

Scryn is a political scratch‑card disbursement platform connecting politicians and citizens. The current `src/app` directory contains the Politician Portal (their operational dashboard) and citizen redemption flows. This document defines the separate, top‑level Admin Portal under `/admin`, which governs the entire platform — managing politicians and their dashboards, campaigns and card batches, global redemptions, citizens, fraud/risk, analytics, roles/permissions, notifications, and audit.

The Admin Portal is not used by politicians; it is the platform’s highest access level for administrators. It must strictly reuse the existing design system and components so nothing is reinvented.

Scope confirmation:
- Politician Portal (already exists in `src/app`): for individual politicians and their teams.
- Citizen Redemption (already exists): public flow for scratch‑card redemption.
- Admin Portal (to build now in `/admin`): centralized control plane across all politicians and citizens.

## Brand Identity & Visual Language

### Color Philosophy

The platform uses a **forest green** color scheme that evokes:

- **Trust and stability** (essential for financial transactions)
- **Growth and prosperity** (aligned with community development)
- **Nigerian heritage** (connection to the national flag)
- **Environmental consciousness** (sustainable political engagement)

### Primary Colors

- **Primary Green**: Forest green (#228B22 equivalent) - Main brand color for CTAs, active states, and primary actions
- **Teal Accent**: Vibrant teal for secondary CTAs and highlights - adds energy and modernity
- **Light Green**: Soft green tints for secondary elements, hover states, and subtle backgrounds
- **Neutral Grays**: Muted foreground colors for body text and descriptions

### Semantic Colors

- **Success Green**: Bright green for completed actions, successful transactions
- **Warning Yellow**: Amber/yellow for pending states, cautionary alerts
- **Error Red**: Coral red for failed transactions, destructive actions, fraud alerts
- **Info Blue**: Soft blue for informational messages (use sparingly)

### Dark Mode Support

All pages must support both light and dark themes with proper contrast ratios. Dark mode uses darker green tones with adjusted opacity for backgrounds while maintaining readability.

## Typography System

### Font Family

**Plus Jakarta Sans** - A modern, friendly sans-serif that conveys professionalism while remaining approachable. This font works well for both dashboard interfaces and public-facing pages.

### Hierarchy Rules

1. **Page Titles**: Extra large, bold - Used for main dashboard headings (e.g., "Dashboard", "Redemptions")
2. **Section Titles**: Large, bold - Used for major sections within a page (e.g., "Recent Activity", "Analytics Overview")
3. **Card Titles**: Small, medium weight - Used for KPI card headers and smaller component titles
4. **Body Text**: Small, regular weight - Standard readable text for descriptions and content
5. **Muted Text**: Small, regular weight with reduced opacity - Used for secondary information, timestamps, helper text
6. **Labels**: Extra small, medium weight - Form labels, table headers, badges

### Text Colors

- Primary text: High contrast foreground color
- Secondary text: Muted foreground with reduced opacity
- Links: Primary green with hover state
- Disabled: Very light gray with low opacity

## Layout Architecture

### Dashboard Structure (Admin Portal)

The admin dashboard follows a **sidebar + main content** layout pattern:

1. **Left Sidebar** (Desktop only, 220px on medium screens, 280px on large screens):

   - Logo at top
   - Primary navigation links with icons
   - User profile section at bottom
   - Sticky positioning for always-visible navigation

2. **Mobile Navigation**:

   - Hamburger menu button in top-left
   - Slide-out sheet overlay with same navigation items
   - Automatically closes on route change for better UX

3. **Top Header Bar**:

   - Sticky positioning (stays visible on scroll)
   - Backdrop blur effect for modern glass-morphism look
   - Left: Mobile menu button (mobile only)
   - Center: Search bar (desktop) / Search icon (mobile)
   - Right: Notifications bell icon with badge + User avatar dropdown

4. **Main Content Area**:
   - Semi-transparent background (80% opacity) for subtle layering
   - Consistent padding (smaller on mobile, larger on desktop)
   - Vertical spacing between sections using gap utilities

### Grid Systems

- **KPI Cards**: 4-column grid on large screens, 2-column on medium, 1-column on mobile
- **Two-Column Layouts**: Side-by-side on large screens, stacked on mobile
- **Three-Column Layouts**: 3 columns on large screens, 2 on medium, 1 on mobile

### Spacing Scale

- Small gap: Used between related items within a component
- Medium gap: Used between cards and sections within a page
- Large gap: Used between major page sections
- Padding follows same scale for internal spacing

## Component Patterns & Standards

### 1. KPI/Statistics Cards

**Purpose**: Display key metrics at a glance with icon, value, and description

**Structure**:

- Card container with subtle background
- Header row with metric name (left) and icon (right)
- Large, bold value display
- Small muted text description showing change or context (e.g., "+20% from last month")

**Icon Guidelines**:

- Use 4x4 size in muted foreground color
- Choose icons that clearly represent the metric:
  - Wallet icon for financial totals
  - CreditCard for card-related stats
  - Users for citizen counts
  - AlertTriangle for warnings/fraud
  - Gift for redemptions
  - CheckCircle for success metrics

**Best Practices**:

- Keep metric names short (2-4 words)
- Use currency formatting for monetary values (₦ symbol)
- Show relative changes with + or - indicators
- Use color coding sparingly (only for critical alerts)

### 2. Data Tables

**Purpose**: Display structured data with sorting, filtering, and actions

**Structure**:

- Wrapped in Card component with title and description in header
- Table with clearly defined headers
- Row data with consistent cell alignment
- Action buttons in rightmost column
- Optional footer for pagination or "View All" link

**Column Types**:

- **Index/Serial Number**: Right-aligned, medium weight
- **Date/Time**: Consistent format (YYYY-MM-DD or localized)
- **Names/Text**: Left-aligned, regular weight
- **Currency**: Right-aligned with ₦ symbol and thousand separators
- **Status**: Badge component with color coding
- **Actions**: Buttons (outline variant for view, destructive for delete)

**Status Badge Colors**:

- Green: Completed, Successful, Active
- Yellow: Pending, In Progress, Warning
- Red: Failed, Rejected, Cancelled, Fraud Alert
- Gray: Draft, Inactive, Archived

**Responsive Behavior**:

- Use horizontal scroll on mobile (with hidden scrollbar for clean look)
- Add whitespace-nowrap to prevent text wrapping
- Consider card-based view for very small screens as alternative

### 3. Charts & Data Visualization

**Purpose**: Present analytics and trends visually

**Chart Types to Use**:

- **Pie/Donut Charts**: Party affiliation distribution, category breakdowns
- **Bar Charts**: Comparisons, rankings, categorical data
- **Line Charts**: Trends over time, redemption rates
- **Area Charts**: Cumulative data, stacked comparisons

**Chart Design Rules**:

- Wrap in Card component with descriptive title
- Set consistent height (350px is standard)
- Use brand colors for data series
- Add interactive tooltips on hover
- Include legend when showing multiple data series
- Provide summary statistics below or beside chart

**Interactive Features**:

- Hoverable elements with detailed tooltips
- Clickable legend items to toggle data series
- Center annotations for key insights (e.g., total count in donut center)
- Responsive sizing that adapts to container width

### 4. Forms & Data Entry

**Purpose**: Collect user input for orders, redemptions, profile updates

**Multi-Step Form Pattern**:

- Visual step indicator at top showing progress
- Icons representing each step
- Completed steps marked with checkmark
- Current step highlighted in primary color
- Future steps shown in muted gray

**Form Field Guidelines**:

- Clear, descriptive labels above each field
- Placeholder text as examples, not instructions
- Validation messages below field (red for errors, green for success)
- Required fields marked with asterisk or indicator
- Group related fields together with proper spacing

**Input Types**:

- Text inputs for names, emails, etc.
- Select dropdowns for predefined options
- Date pickers for date selection
- Number inputs with increment/decrement buttons
- Textareas for longer content (descriptions, notes)
- Radio groups for exclusive choices
- Checkboxes for multiple selections

**Form Actions**:

- Primary button for submit (right-aligned)
- Secondary/Ghost button for cancel (left of submit)
- "Back" button for multi-step forms (left-aligned)
- Disable submit until form is valid
- Show loading state during submission

### 5. Navigation System

**Purpose**: Enable users to move between dashboard sections

**Desktop Sidebar Navigation**:

- List of navigation items with icon and label
- Current page highlighted with background color and primary text
- Hover state with primary color text
- Smooth transitions between states
- Logical ordering (Dashboard first, logout last)

**Navigation Icons**:

- LayoutDashboard for main dashboard
- Gift for redemptions
- BarChart3 for analysis/analytics
- ShieldCheck for fraud detection
- Settings for configuration
- HelpCircle for support/help

**Mobile Navigation**:

- Sheet/drawer that slides from left
- Same navigation items as desktop
- Closes automatically on link click
- Overlay backdrop to focus attention

**Breadcrumbs** (optional for nested pages):

- Show hierarchy: Dashboard > Redemptions > Details
- Links for navigation back to parent pages
- Current page shown as text (not clickable)

### 6. Header/Topbar Components

**Search Bar**:

- Prominent position in center of header (desktop)
- Icon-only button on mobile that opens dialog
- Keyboard shortcut hint (⌘K) visible on desktop
- Modal dialog for full search experience
- Categorized results (Pages, Actions, etc.)
- Icon-based result items for visual scanning
- Auto-close on result selection

**Notifications Menu**:

- Bell icon with badge showing unread count
- Dropdown menu with scrollable notification list
- Color-coded icons by notification type (success, warning, info)
- Timestamp for each notification
- "Mark as read" functionality (both individual and all)
- Remove/dismiss option on hover
- Empty state when no notifications
- "View All" link at bottom

**User Menu**:

- Avatar with subtle ring effect
- Dropdown showing user name, role/party, and email
- Grouped menu items:
  - Profile and account settings
  - Billing/subscription (with Pro badge if applicable)
  - Theme switcher (Light/Dark/System in submenu)
  - Privacy and security
  - Help and support
  - Logout (at bottom, separated)
- Badge indicators for account type or status

### 7. Loading States

**Purpose**: Provide feedback during data fetching

**Skeleton Loaders**:

- Match the layout of actual content
- Animated shimmer effect for "loading" feel
- Used for KPI cards, tables, charts while data loads
- Proper row/column count matching expected data

**Suspense Boundaries**:

- Wrap async components in React Suspense
- Provide appropriate fallback skeletons
- Consider page-level and component-level suspense for granular control

**Loading Indicators**:

- Spinner for button actions (replace text with spinner)
- Progress bar for multi-step operations
- "Loading..." text only as last resort

### 8. Modal Dialogs & Overlays

**Purpose**: Focus user attention on specific actions or information

**When to Use**:

- Confirmation dialogs (delete, cancel actions)
- Forms that don't need full page
- Detail views for quick information
- Search interfaces
- Settings and preferences

**Structure**:

- Clear title describing purpose
- Optional description/subtitle for context
- Content area (form, details, etc.)
- Footer with action buttons (primary action on right)
- Close button (X) in top-right corner
- Backdrop overlay to dim background

**Sizes**:

- Small: Confirmations, simple alerts
- Medium: Forms with few fields, detail views
- Large: Complex forms, search interfaces
- Full-screen: Mobile view of complex dialogs

### 9. Empty States

**Purpose**: Guide users when no data exists

**Components**:

- Large, subtle icon representing the empty content type
- Headline explaining why content is empty
- Description with helpful context or next steps
- Primary action button to add first item
- Optional: Link to documentation or help

**Examples**:

- "No redemptions yet" - Icon, description, "Create First Order" button
- "No notifications" - Bell icon, "You're all caught up" message
- "Search returned no results" - Search icon, suggestions for refining search

### 10. Alert & Toast Messages

**Alerts** (persistent on page):

- Used for important contextual information
- Variants: default, info, success, warning, destructive
- Include icon matching the variant
- Title and description structure
- Optional action buttons or dismiss option

**Toasts** (temporary notifications):

- Appear in corner of screen (typically top-right)
- Auto-dismiss after few seconds
- Used for action confirmations ("Card created successfully")
- Can include action button (e.g., "Undo")

## Page-Specific Patterns (Admin Portal)

### Admin Overview Page (/admin)

**Layout Sections** (top to bottom):

1. **KPI Card Grid** - 4 key metrics showing platform health
2. **Party Affiliation Chart** - Donut/pie chart showing distribution by political party with interactive elements
3. **Redemption Summary Cards** - 3 cards showing redemption stats with "View All" CTA
4. **Charts and Recent Activity** - Two-column grid with:
   - Redemption overview chart (line/area showing trends)
   - Recent redemptions table (preview of latest 5)

**Key Features**:

- All cards clickable to drill into details
- Real-time or near-real-time data updates
- Responsive grid that stacks on mobile
- Consistent spacing and alignment

### Redemptions Page

**Layout Sections**:

1. **Page Title** with description
2. **KPI Cards** - Redemption-specific metrics
3. **Main Table** - Full list of redemptions with:
   - Serial number, date, citizen name, amount, card code, bank, status
   - Status badges with color coding
   - Action buttons to view details
   - Pagination or infinite scroll

**Table Features**:

- Sortable columns (click header to sort)
- Status filter chips above table
- Search bar to find specific redemption
- Export button for data download

**Detail View** (when clicking a redemption):

- Full redemption information
- Citizen details
- Card information
- Transaction history
- Fraud check results

### Admin Analytics Page (/admin/analytics)

**Layout Sections**:

1. **Time Range Selector** - Dropdown or tabs for daily/weekly/monthly/yearly views
2. **Summary Statistics** - High-level metrics in cards
3. **Party Affiliation Chart** - Enhanced interactive chart with:
   - Clickable party cards showing colors and stats
   - Hover effects revealing details
   - Center annotation with totals
   - Statistics summary below chart
4. **Trend Charts** - Multiple charts showing:
   - Redemption trends over time
   - Geographic distribution
   - Peak activity times
   - Card utilization rates

**Interactivity**:

- Tooltips on all chart elements
- Drill-down capability (click chart to filter)
- Export/share options for reports

### Fraud & Risk Center (/admin/fraud)

**Layout Sections**:

1. **Alert Summary** - Count of active alerts by severity
2. **Fraud Alert Table** - Sorted by date/severity with:

   - Alert type, affected card, citizen, timestamp
   - Severity badge (high/medium/low)
   - Status (under review, resolved, dismissed)
   - Action buttons (view details, mark resolved)

3. **AI Analysis Section** - Display of fraud detection results with:
   - Confidence score
   - Risk factors identified
   - Recommended actions

**Color Coding**:

- High severity: Red background, urgent styling
- Medium severity: Yellow/amber background
- Low severity: Default styling

## Responsive Design Guidelines

### Breakpoint Strategy

**Mobile First Approach**:

- Design for mobile (320px+) first
- Enhance for tablet (768px+)
- Optimize for desktop (1024px+)

**Key Breakpoints**:

- Small (sm - 640px): Basic mobile enhancements
- Medium (md - 768px): Sidebar appears, two-column grids
- Large (lg - 1024px): Full desktop layout, wider sidebar, four-column grids
- Extra Large (xl - 1280px): Enhanced spacing, larger fonts

### Mobile Adaptations

**Navigation**:

- Hide sidebar, show hamburger menu
- Search becomes icon button
- User menu remains as avatar button

**Cards**:

- Stack in single column
- Reduce padding for compact display
- Maintain touch-friendly tap targets (44px minimum)

**Tables**:

- Horizontal scroll with hidden scrollbar
- Consider alternative card-based layout for complex tables
- Show most important columns only

**Forms**:

- Full-width inputs
- Larger touch targets for buttons
- Stack side-by-side fields vertically

**Charts**:

- Reduce height slightly
- Simplify tooltips
- Ensure touch-friendly interaction points

## Animation & Interaction Guidelines

### Transition Principles

- **Subtle and Smooth**: Animations should feel natural, not distracting
- **Purposeful**: Every animation should serve a purpose (feedback, guidance, delight)
- **Fast**: Keep durations short (200-500ms) to feel responsive
- **Consistent**: Use same timing functions across similar interactions

### Common Animations

**Navigation Transitions**:

- Instant route changes (no delay before navigation)
- Progress bar at top during page load
- Fade-in content after data loads

**Hover Effects**:

- Color changes on text/buttons
- Scale slightly (1.02-1.05) for cards
- Translate icons slightly (gift icon rotation, arrow slide)
- Smooth transitions (300-500ms)

**Form Interactions**:

- Input focus states with border color change
- Error shake animation for validation failures
- Success checkmark animation on submission
- Multi-step form slide transitions

**Microinteractions**:

- Button press effect (slight scale down on click)
- Checkbox/radio check animation
- Dropdown menu slide/fade in
- Toast notification slide in from corner

**Premium Effects**:

- Shine/shimmer effect on CTAs (sweeping light gradient)
- Subtle pulse on notification badges
- Gradient animation on loading states

### Accessibility in Animations

- Respect `prefers-reduced-motion` setting
- Provide alternative feedback for users who disable animations
- Ensure animations don't cause seizures (no rapid flashing)

## Content & Copywriting Guidelines

### Tone of Voice

- **Professional but Approachable**: Formal enough for financial platform, friendly enough to be inviting
- **Clear and Direct**: No jargon, explain technical terms
- **Empowering**: Focus on what users can accomplish
- **Nigerian Context**: Use Naira (₦) symbol, reference local banking, respect cultural norms

### Text Guidelines

**Action Buttons**:

- Use verbs: "Create Order", "View Details", "Mark as Read"
- Be specific: "Download Report" not just "Download"
- Keep concise: 1-3 words when possible

**Descriptions**:

- One sentence per card/section description
- Provide context without overwhelming
- Use sentence case, not title case

**Error Messages**:

- State what went wrong clearly
- Suggest how to fix it
- Avoid technical jargon or error codes (unless necessary)
- Example: "Unable to process redemption. Please verify the card code and try again."

**Success Messages**:

- Confirm what was accomplished
- Brief and positive
- Example: "Card order created successfully! You can track it in the dashboard."

**Empty States**:

- Explain why content is empty
- Provide clear next action
- Example: "No redemptions yet. Citizens will appear here once they start redeeming cards."

## Data Formatting Standards

### Numbers

- **Currency**: ₦45,231,890 (Naira symbol, comma separators, no decimals unless cents needed)
- **Large Numbers**: Use comma separators (1,234,567)
- **Percentages**: +20.1%, -5.3% (show sign, one decimal place)
- **Counts**: "1,258 / 10,000" (current / total format)

### Dates & Times

- **Full Date**: March 20, 2024 or 2024-03-20 (consistent format across app)
- **Relative Time**: "2 min ago", "1 hour ago", "3 days ago" (for recent items)
- **Time**: 2:30 PM or 14:30 (choose 12 or 24 hour, be consistent)

### Text Truncation

- Use ellipsis (...) for overflow text
- Show full text on hover (tooltip)
- Prefer wrapping over truncation when space allows

## Technical Requirements

### Performance

- Lazy load images and heavy components
- Use Suspense for async data fetching
- Implement pagination or virtual scrolling for long lists
- Optimize images (WebP format, proper sizing)

### Accessibility

- Semantic HTML elements (header, nav, main, section)
- Proper heading hierarchy (h1 > h2 > h3)
- Alt text for images
- Aria labels for icon-only buttons
- Keyboard navigation support (tab order, enter to activate)
- Focus indicators visible
- Sufficient color contrast (WCAG AA minimum)

### Navigation

- **Always use InstantLink component** for internal navigation (not Next.js Link)
- This provides instant, SPA-like navigation feel
- Mobile sidebar closes automatically on navigation
- Progress indication during route changes

### TypeScript

- Define proper types for all data structures
- Use interfaces for component props
- Avoid 'any' type
- Export types for reuse across components

### Server vs Client Components

- Default to Server Components for better performance
- Use 'use client' only when necessary:
  - Interactive components (forms, dropdowns, dialogs)
  - Components using hooks (useState, useEffect)
  - Event handlers (onClick, onChange)
- Keep client components small and focused

## Quality Checklist

Before considering a page complete, verify:

**Visual Design**:

- [ ] Colors match brand palette (forest green primary, teal accent)
- [ ] Typography uses Plus Jakarta Sans font
- [ ] Spacing is consistent with design system
- [ ] Layout is responsive across all breakpoints
- [ ] Dark mode works correctly with proper contrast

**Components**:

- [ ] All interactive elements have hover states
- [ ] Buttons use appropriate variants (primary, outline, ghost, destructive)
- [ ] Cards have consistent structure (header, content, optional footer)
- [ ] Tables include proper status badges with color coding
- [ ] Icons are sized correctly (4x4 for most UI elements)

**Functionality**:

- [ ] Navigation uses InstantLink component
- [ ] Loading states display properly with skeleton loaders
- [ ] Forms validate input and show clear error messages
- [ ] Empty states guide users to take action
- [ ] Success/error feedback appears for user actions

**Content**:

- [ ] All text follows tone of voice guidelines
- [ ] Numbers formatted correctly (currency with ₦, commas in large numbers)
- [ ] Dates displayed consistently
- [ ] No lorem ipsum or placeholder text in final version

**Accessibility**:

- [ ] Semantic HTML used throughout
- [ ] All buttons and links have descriptive labels
- [ ] Images include alt text
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works correctly

**Performance**:

- [ ] Images optimized and properly sized
- [ ] Heavy components lazy loaded
- [ ] Suspense boundaries in place for async content
- [ ] No unnecessary re-renders or state updates

## Example Page Creation Workflow

When building a new dashboard page:

1. **Plan the Layout**:

   - Sketch sections from top to bottom
   - Identify KPIs, tables, charts needed
   - Determine responsive behavior

2. **Create Component Structure**:

   - Set up page with Suspense wrapper
   - Add async content function for data fetching
   - Include skeleton loader as fallback

3. **Build Sections Top to Bottom**:

   - Start with KPI cards (4-column grid)
   - Add charts in appropriate card containers
   - Create data tables with proper structure
   - Include empty states where relevant

4. **Add Interactivity**:

   - Implement click handlers with InstantLink
   - Add hover effects on interactive elements
   - Connect forms to submission handlers
   - Enable search/filter functionality

5. **Polish & Refine**:

   - Review spacing and alignment
   - Test responsive behavior at all breakpoints
   - Verify loading states work correctly
   - Add microinteractions and animations
   - Test dark mode appearance

6. **Validate Quality**:
   - Run through quality checklist
   - Test keyboard navigation
   - Verify accessibility with screen reader
   - Check performance metrics

## Conclusion

This design system ensures consistency, accessibility, and a premium user experience across the Scryn Admin Portal. When creating new pages, always reference existing implementations and maintain these established patterns. The goal is a cohesive control plane that empowers administrators to govern the platform effectively — overseeing politicians and citizens — while preserving a transparent, secure experience across the ecosystem.

Focus on clarity, usability, and the human element—every interaction should feel intentional and respectful of the user's time and trust.

# Scryn Admin Portal – AI Builder Prompt (Code‑Free)

This prompt defines how to design and build the Scryn Admin Portal — the top access layer that controls and manages all Politician dashboards, redemptions, citizens, campaigns, cards, and fraud operations. It standardizes layout, navigation, components, and UX so the output reuses our existing design system consistently. 

## 0) What Scryn Is and What This Admin Portal Controls

- Scryn is a political scratch‑card fundraising and disbursement platform for Nigerian communities.
- There are two main surfaces:
  - Politician Dashboard (already exists): operations per politician (campaigns, cards, redemptions, analytics).
  - Admin Portal (to build with this prompt): platform‑level control and governance across all politicians and citizens.
- Admin Portal responsibilities (non‑exhaustive):
  - Manage politicians (onboarding, status, suspension, oversight).
  - Manage campaigns and card batches across politicians.
  - View and moderate all redemptions (filtering, approvals, reversals, audit).
  - Monitor fraud/risk alerts with actions and rules.
  - Citizen directory (KYC signals, activity, risk score).
  - Global analytics and reporting (platform‑level KPIs and charts).
  - Access control (admin roles/permissions), audit logs, and notifications management.

Output target: a cohesive Admin Portal under /admin that matches the existing look & feel and reuses components, hooks, and patterns already in the app.

## 1) Design System You Must Reuse (No Re‑inventing UI)

Only use and compose existing primitives and patterns. Do not recreate components that already exist.

- Component Library: shadcn/ui components in our project (Card, Button, Table, Badge, DropdownMenu, Dialog, Tabs, Input, Select, Calendar, Sheet/Sidebar, Progress, Skeleton, Toast, Tooltip, Avatar, Menubar, Popover, Separator, Scroll Area).
- Custom Components already in repo to reuse when applicable:
  - Navigation: InstantLink (for SPA‑like instant navigation), MobileNav, DashboardNav, UserMenu, NotificationsMenu, SearchCommand, Navigation progress indicator.
  - Charts: PartyAffiliationChart, RedemptionOverviewChart, Chart wrappers.
  - Skeletons/Loaders: DashboardSkeleton, TableSkeleton.
  - Forms: Form wrappers and form elements (date picker, quantity input, denomination picker) with React Hook Form + Zod.
- Styling system:
  - Tailwind utility classes with theme tokens defined in global CSS variables.
  - Color tokens (names only; do not output raw code): background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart‑1..chart‑5, sidebar‑\*.
  - Dark mode is supported via .dark variables; ensure adequate contrast.
- Typography hierarchy (describe, do not code): page titles (large, bold), section titles (medium/large), card titles (small/medium), body text (regular), muted text (subtle foreground).
- Spacing rhythm: consistent gaps and paddings mirroring existing dashboard (tight topbar, comfortable content area with gaps between cards and sections). Favor grid layouts that collapse sensibly on mobile.
- Iconography: lucide icons with balanced sizing; keep icon sizes visually consistent per surface (e.g., small icons in card headers, medium in actions). Avoid heavy/flashy motion.

Accessibility: all interactive controls must be keyboard navigable, have discernible labels, and preserve color contrast. Use semantic headings and landmarks (header, nav, main, section).

## 2) Behavioral Patterns You Must Follow

- Navigation philosophy: navigation should occur first, then load data. Use the existing instant navigation behaviors (InstantLink). Avoid prefetch that blocks transitions.
- Loading states: wrap async sections with appropriate skeletons (use DashboardSkeleton/TableSkeleton patterns). Never show abrupt content shifts without a placeholder.
- Tables: allow horizontal scroll on small screens without showing scrollbars; keep column headers pinned visually via spacing; preserve whitespace for key identifiers. Use status badges with consistent variants.
- Sticky topbar: topbar remains visible with backdrop blur; includes Search, Notifications, and User Menu on admin surfaces.
- Mobile: sidebar collapses into a sheet; it must close immediately upon navigation and not obstruct subsequent routes.
- Animations: keep subtle and calm. Prefer micro‑interactions (hover states, small icon shifts) over large motion. Use “shine” effects sparingly for primary CTAs only.

## 3) Information Architecture for the Admin Portal (/admin)

Create the following pages and sections. Each page must:

- Use the standard dashboard layout (sidebar + sticky topbar + content area with consistent paddings and gaps).
- Start with a KPI area, then key charts or controls, followed by tables and recent activity.
- Include filters and actions appropriate to the surface.

1. Admin Home (Overview)

- KPIs: Total politicians onboarded; Active campaigns; Cards in circulation; Total redemptions; Open fraud alerts; Citizens registered.
- Charts: Platform‑level redemption trend; Party affiliation distribution (rollup across politicians).
- Recent activity: cross‑platform redemption feed with time, amount, citizen, politician, status.
- Quick actions: Onboard politician; Create campaign; Review fraud alerts.

2. Politicians Management

- List view: table with name, party, onboarding date, status (active/suspended), cards issued, total redemptions, open fraud alerts.
- Controls: search, filter by party/status/date, sort by activity.
- Row actions: view details, open dashboard, suspend/unsuspend, reset credentials.
- Detail view (tabs): Overview, Campaigns, Card Batches, Redemptions, Citizens, Fraud.
  - Overview: profile block, current status, high‑level KPIs, recent activity.
  - Campaigns: campaign list with status, duration, performance; actions to create/edit.
  - Card Batches: batch name, size, issued, remaining, last issued; ability to generate/manage.
  - Redemptions: table scoped to politician with filters; export option.
  - Citizens: associated citizens list with key attributes and activity count.
  - Fraud: alerts, severity, disposition, notes.

3. Redemptions (Global)

- Master table of all redemptions across the platform.
- Filters: date range, amount range, status (completed/pending/failed), bank, politician, campaign.
- Bulk actions: approve where applicable, export CSV, mark for review.
- Detail panel: redemption metadata (citizen, amount, card code mask, bank, time, geo where available), status history, related alerts.

4. Fraud & Risk Center

- Alerts list: severity, category, linked redemption/card/politician, created time, status.
- Alert detail: AI rationale/explanation, signals, timeline, actions (dismiss, escalate, assign), notes.
- Rules & thresholds: view configured rules, toggle or adjust thresholds, preview impact.
- Metrics: fraud rate over time, false positive trend, top risky entities.

5. Cards & Campaigns

- Campaigns: list with owner (politician), status, start/end dates, performance KPIs. Quick actions: create campaign, archive, duplicate.
- Card Batches: list with batch identifier, denomination, quantity, issued/remaining, issuance dates; actions to generate, pause, retire, and export issuance reports.

6. Citizens Directory

- List: name, contact mask, KYC state, total redemptions, last activity, risk score.
- Detail: profile summary, redemption history timeline, linked politician/campaigns, risk indicators and notes.
- Actions: merge duplicates, mark verified/flagged, export.

7. Analytics (Platform‑level)

- Summary: global KPIs, redemption over time, party‑level rollups, campaign performance distribution.
- Optional: geographic breakdown if available; otherwise keep consistent with trend and categorical charts.

8. Settings & Access Control

- Admin users & roles: invite, assign roles, revoke; show last active and MFA state.
- Permissions matrix: define capabilities per role (view, manage, export, risk actions).
- Audit log: chronological actions with actor, resource, action, result; filters and export.
- Theming/Branding: logo, colors where allowed (stay within design tokens).
- Integrations: notification channels, banks, analytics, and optional webhooks.

9. Notifications Center

- Templates: list and edit notification templates (system emails/SMS/push), variables preview.
- Delivery logs: status, channel, target (masked), timestamp; filters and retry where applicable.

## 4) Reuse of Existing Building Blocks (Names Only)

Reference and reuse by name (no code output):

- Layout: dashboard layout with sidebar/topbar; sticky topbar containing search, notifications, user menu.
- Navigation: InstantLink for all internal routes; MobileNav and DashboardNav patterns; ensure sidebar closes on navigation on small screens.
- Loading: DashboardSkeleton for whole‑page loads; TableSkeleton for tabular loads.
- Tables & Badges: existing Table components and Badge variants for statuses (Completed, Pending, Failed, etc.).
- Charts: PartyAffiliationChart, RedemptionOverviewChart for relevant analytics; wrap in Card sections with titles and descriptions.
- Forms: use our Form wrappers and form elements, with validation via Zod; keep labels concise and helper text in muted foreground.

## 5) Interaction and UX Rules

- Page composition order: KPIs → filters/primary controls → charts/visuals → detailed tables → recent activity.
- Empty states: friendly illustration/label, short guidance, and a clear primary action.
- Error states: concise text, optional retry, and link to logs or details.
- Confirmation & destructive actions: use modal confirmation; highlight with destructive variants where appropriate.
- Scroll behavior: tables may scroll horizontally on small screens; hide scrollbars visually while preserving scrollability.
- Topbar commands: include lightweight search and notifications; keep tones subtle and non‑intrusive.
- Motion: gentle durations, small distance translations; avoid aggressive scaling; only one highlight animation (optional shine) on the primary CTA where meaningful.

## 6) Data, State, and Performance Expectations

- Data source: server‑side via Prisma models already defined (Politician, Order, OrderItem, ScratchCard, Citizen, Redemption, FraudAlert, AnalyticsEvent). Fetch on the server by default.
- Responsive: all layouts must degrade gracefully to mobile (single column or stacked), then scale up to multi‑column on md/lg.
- Progressive rendering: use Suspense patterns; prioritize interactive shell render, then hydrate data.
- Accessibility & i18n readiness: ensure aria labels, focus states, and avoid hard‑coded locale formats where possible.
- Observability: include places for audit trails and admin‑facing change logs.

## 7) Routing and IA Targets (Admin Space)

Create the following routes and their content structures under /admin:

- /admin (Overview)
- /admin/politicians (list)
- /admin/politicians/[id] with tabs: overview, campaigns, batches, redemptions, citizens, fraud
- /admin/redemptions
- /admin/fraud
- /admin/campaigns
- /admin/cards
- /admin/citizens
- /admin/analytics
- /admin/settings (roles, permissions, audit, integrations)
- /admin/notifications (templates, logs)

Each route must adhere to the standard layout and section order described above and reuse components by name.

## 8) Acceptance Criteria (Definition of Done)

- Visual Consistency: matches existing dashboard look & feel (colors, spacing, typography, icon sizes).
- Component Reuse: only uses available components and patterns by name; no invented styles or new primitives unless strictly necessary.
- Navigation Behavior: instant transitions; sidebar closes on route change on mobile.
- Loading Strategy: meaningful skeletons in place; no blank screens.
- Accessibility: keyboard navigation works for menus, dialogs, tables; adequate contrast; semantic structure.
- Responsiveness: mobile through desktop layouts verified; tables remain usable on small screens.
- Content Coverage: all admin pages described above exist with required sections and controls.
- Observability & Audit: admin‑relevant audit and activity views are included where noted.

## 9) Output Format for the AI Builder

When generating, do not include code. Instead, produce:

- Page‑by‑page specifications listing:
  - Layout region usage (sidebar, topbar, content sections).
  - Components to compose (by name) per section and their intended content.
  - Data points surfaced in KPIs, charts, and tables.
  - Filters, actions, and states (loading/empty/error).
  - Interaction behaviors and micro‑interactions.
- A routing map under /admin reflecting the IA.
- A short QA checklist per page aligned to the Acceptance Criteria.

## 10) Short Prompt to Kick Off Page Generation

“Design and specify the Scryn Admin Portal under /admin using the existing design system. Reuse components and patterns by name only (no code). Apply the navigation, loading, and accessibility behaviors defined above. Produce detailed, page‑by‑page specifications (KPIs, charts, tables, filters, actions, states) for: Overview, Politicians (+detail tabs), Redemptions, Fraud, Campaigns, Cards, Citizens, Analytics, Settings/Access, Notifications. Ensure consistent layout (sidebar + sticky topbar), instant navigation, table scroll behavior, and subtle motion. Conform to the Acceptance Criteria.”
