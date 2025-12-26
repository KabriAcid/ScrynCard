# Scryn Admin Portal

## Overview

The Admin Portal is the top-level control plane for the Scryn platform, providing comprehensive management and oversight capabilities across all politicians, campaigns, cards, citizens, redemptions, and fraud detection.

## Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # Admin layout with sidebar + topbar
│       ├── page.tsx                # Overview/Dashboard
│       ├── politicians/            # Politicians management
│       ├── redemptions/            # Global redemptions view
│       ├── fraud/                  # Fraud & Risk Center
│       ├── campaigns/              # Campaign management
│       ├── cards/                  # Card batch management
│       ├── citizens/               # Citizens directory
│       ├── analytics/              # Platform analytics
│       ├── settings/               # Admin settings
│       └── notifications/          # Notification center
├── components/
│   └── admin/
│       ├── nav.tsx                 # Admin navigation
│       ├── mobile-nav.tsx          # Mobile navigation
│       ├── kpi-card.tsx            # KPI card component
│       ├── data-table.tsx          # Reusable data table
│       ├── empty-state.tsx         # Empty state component
│       └── index.ts                # Barrel exports
└── hooks/
    ├── use-debounce.ts            # Debounce hook
    ├── use-sort.ts                # Sorting hook
    └── use-pagination.ts          # Pagination hook
```

## Features

### 1. Overview Dashboard

- Platform-wide KPIs (politicians, campaigns, cards, redemptions)
- Active fraud alerts summary
- Recent redemptions feed
- Quick actions

### 2. Politicians Management

- Complete list of all politicians
- Search and filter by party/status
- View detailed metrics per politician
- Cards issued, redemptions, fraud alerts
- Onboard new politicians

### 3. Redemptions (Global)

- Cross-platform redemption table
- Filter by date, amount, status, bank, politician
- Export to CSV
- Individual redemption details

### 4. Fraud & Risk Center

- All fraud alerts with severity levels
- Alert details and resolution actions
- Fraud metrics and trends
- Rules and threshold configuration

### 5. Campaigns

- All campaigns across politicians
- Campaign status and performance
- Create and manage campaigns
- Archive and duplicate campaigns

### 6. Card Batches

- Card inventory management
- Issued vs remaining cards
- Redemption rates
- Generate new batches
- Card status tracking

### 7. Citizens Directory

- Complete citizens database
- KYC verification status
- Activity and redemption history
- Risk scores
- Merge duplicates

### 8. Analytics

- Platform-level KPIs
- Redemption trends over time
- Party affiliation distribution
- Campaign performance metrics
- Geographic insights

### 9. Settings & Access Control

- Admin user management
- Role-based permissions
- Security settings (2FA, session timeout)
- Platform configuration
- Audit logs

### 10. Notification Center

- Email and SMS templates
- Delivery logs
- Channel configuration
- Failed delivery tracking

## Design System

The Admin Portal uses the existing Scryn design system:

### Components

- All UI components from `@/components/ui/*` (shadcn/ui)
- Custom admin components in `@/components/admin/*`
- Reuses: InstantLink, SearchCommand, UserMenu, NotificationsMenu

### Styling

- Tailwind CSS with design tokens from `globals.css`
- Consistent color palette (green primary, teal accent)
- Dark mode support
- Responsive breakpoints (mobile-first)

### Navigation

- Instant navigation via InstantLink
- Mobile sidebar auto-closes on route change
- Loading states with Suspense + skeletons

## Data Integration

### Prisma Models Used

- `Politician` - Platform politicians
- `Order` - Campaigns/orders
- `ScratchCard` - Card inventory
- `Citizen` - Registered citizens
- `Redemption` - All redemptions
- `FraudAlert` - Fraud alerts
- `AnalyticsEvent` - Event tracking

### Server Components

All admin pages are server components by default:

- Data fetched server-side with Prisma
- Suspense boundaries for loading states
- Client components only for interactivity

## Authentication

### Current Implementation

- Basic middleware at `src/middleware.ts`
- Protects all `/admin/*` routes
- Development mode: auto-allows access
- Production: requires authentication (TODO)

### TODO: Production Auth

```typescript
// Implement in middleware.ts:
1. Check authentication cookies/JWT
2. Verify user has admin role
3. Redirect to login if unauthorized
4. Add role-based permission checks
```

## Usage

### Development

```powershell
# Start dev server
npm run dev

# Access admin portal
http://localhost:3000/admin
```

### Production Deployment

```powershell
# Build
npm run build

# Start
npm start
```

## Security Checklist

- [ ] Implement proper authentication
- [ ] Add role-based access control
- [ ] Enable 2FA for admin accounts
- [ ] Add audit logging for admin actions
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation and sanitization
- [ ] CSRF protection
- [ ] Secure session management

## Next Steps

1. **Authentication Integration**

   - Wire up to your auth system (NextAuth, Auth0, etc.)
   - Add admin role checking
   - Implement session management

2. **Audit Logging**

   - Log all admin actions
   - Track who did what and when
   - Export audit logs

3. **Advanced Permissions**

   - Granular role permissions
   - Feature-level access control
   - Permission matrix UI

4. **Real-time Updates**

   - WebSocket integration for live data
   - Notification system
   - Real-time fraud alerts

5. **Enhanced Analytics**
   - More chart types
   - Custom date ranges
   - Export reports
   - Scheduled reports

## Notes

- All admin pages use server-side data fetching
- Loading states implemented with Suspense
- Mobile-responsive throughout
- Follows existing Scryn design patterns
- Reuses components wherever possible
- Clean separation from politician portal
