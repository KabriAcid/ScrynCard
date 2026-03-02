https://www.figma.com/design/tPeHbkVtc1QERApjFLEUFI/Scryn?t=vN1psrGvzXz2t070-0

# ScrynCard - Mobile Airtime & Data Scratch Card Platform
## Complete Technical Documentation

---

## 📋 Executive Summary

### Project Overview
A digital platform that enables mobile airtime and data distribution through physical scratch cards. Politicians, businesses, or organizations can order branded scratch cards with unique codes that citizens redeem for instant mobile airtime or data bundles directly to their phone numbers.

### Current Implementation Status
- **Phase**: MVP Development (v0.1.0)
- **Stack**: React + TypeScript + Vite
- **State Management**: Zustand
- **UI Framework**: Radix UI + Tailwind CSS
- **Data**: Mock data (production backend pending)
- **Deployment**: Vercel-ready

### Market Opportunity
- **Target Market**: Political campaigns, corporate promotions, event organizers
- **Product**: Branded airtime/data scratch cards with instant mobile redemption
- **Revenue Model**: Service fee (10-25%) + printing costs on card orders
- **Supported Networks**: MTN, Airtel, Glo, 9Mobile

---

## 🎯 How It Works

### The Complete Flow

#### **Step 1: Politician/Organization Registration & Order**
1. Register on platform with organization details
2. Create order specifying:
   - **Airtime Cards**: ₦200, ₦500, ₦1000, ₦2000, ₦5000
   - **Data Cards**: 1GB, 2GB, 5GB, 10GB
   - Quantities per denomination
   - Custom branding (logo, message)
3. Platform generates unique scratch card codes with:
   - **Serial Number**: `AB-123456` (6-digit alphanumeric)
   - **Gift Code**: 16-character hex hash
   - **Checksum**: Security validation
4. Order payment via integrated gateway
5. Cards printed and delivered

#### **Step 2: Card Distribution**
- Physical scratch cards distributed at:
  - Political rallies and campaigns
  - Corporate events
  - Promotional campaigns
  - Community outreach programs
- Each card has:
  - Unique serial number (visible)
  - Hidden gift code (scratch-off layer)
  - Branding and instructions

#### **Step 3: Citizen Redemption (No Registration Required)**
1. Citizen receives scratch card
2. Visits website: `scryncard.com/redeem`
3. Scratches card to reveal gift code
4. Enters:
   - Serial number
   - Gift code
   - Phone number
5. **Automatic Network Detection** (MTN, Airtel, Glo, 9Mobile)
6. **Fraud Detection Engine** analyzes redemption (2-3 seconds)
7. If approved: Airtime/data delivered instantly to phone
8. SMS confirmation sent

#### **Step 4: Real-Time Tracking**
Politicians/organizations see live dashboard with:
- Total cards distributed vs redeemed
- Redemption rates by denomination
- Network distribution (MTN, Airtel, etc.)
- Geographic distribution
- Peak redemption times
- ROI analytics

---

## 💻 Technical Architecture

### Current Tech Stack

#### **Frontend (Implemented)**
- **Framework**: React 18.3.1 + TypeScript 5.3.0
- **Build Tool**: Vite 5.0
- **Routing**: React Router v6.22.0
- **State Management**: Zustand 4.4.7
- **UI Components**: Radix UI (Headless components)
- **Styling**: Tailwind CSS 3.4.1
- **Forms**: React Hook Form 7.52.1 + Zod 3.24.2
- **Charts**: Recharts 2.15.1
- **Icons**: Lucide React 0.475.0
- **Animations**: Framer Motion 11.2.12

#### **Project Structure**
```
src/
├── features/              # Feature-based modules
│   ├── admin/            # Admin dashboard
│   │   ├── pages/        # Dashboard, Politicians, Analytics, Fraud, etc.
│   │   ├── components/   # Admin-specific UI components
│   │   └── layout/       # AdminLayout wrapper
│   ├── politician/       # Politician portal
│   │   ├── pages/        # Dashboard, Orders, Redemptions, Analytics
│   │   ├── components/   # Politician-specific components
│   │   └── layout/       # PoliticianLayout wrapper
│   ├── citizen/          # Public redemption
│   │   └── pages/        # HomePage, RedeemPage, RedeemDetails, OrderCards
│   └── auth/             # Authentication
│       └── pages/        # LoginPage, AdminLoginPage
├── components/           # Shared components
│   ├── ui/              # Radix UI components (40+ components)
│   ├── admin/           # Shared admin components
│   └── dashboard/       # Shared dashboard components
├── stores/              # Zustand state management
│   ├── authStore.ts     # Authentication state
│   ├── adminStore.ts    # Admin data & actions
│   ├── politicianStore.ts  # Politician data
│   └── citizenStore.ts  # Citizen redemption state
├── lib/                 # Utilities & types
│   ├── mockTypes.ts     # TypeScript interfaces
│   ├── mockData.ts      # Mock data for development
│   ├── card-security.ts # Card code generation & validation
│   ├── formatters.ts    # Currency, date formatting
│   └── utils.ts         # General utilities
├── services/            # External API integrations
│   ├── airtimeService.ts   # Airtime redemption service
│   └── providers/
│       └── ebillsService.ts  # Ebills API integration
├── config/
│   └── api.ts          # API configuration
└── hooks/              # Custom React hooks
    ├── use-toast.ts
    ├── use-mobile.tsx
    ├── use-pagination.ts
    └── useAuth.ts
```

#### **Backend (Pending Implementation)**
- **Language**: Node.js (recommended) or Python
- **Framework**: Express.js or FastAPI
- **Database**: PostgreSQL (relational data)
- **Cache**: Redis (high-speed validation)
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Paystack, Flutterwave
- **Airtime API**: Ebills, VTPass, or similar

#### **Infrastructure (Deployment Ready)**
- **Hosting**: Vercel (frontend), AWS/Azure (backend)
- **CDN**: Vercel Edge Network
- **Monitoring**: To be implemented
- **SMS**: Termii or Africa's Talking

---

## 🔐 Security & Fraud Prevention

### Card Code Security (Implemented)

Each scratch card has two identifiers:

**1. Serial Number**: `AB-123456`
- 2 uppercase letters + 6 digits
- Visible on physical card
- User-facing identifier

**2. Gift Code**: 16-character hex hash
- Example: `A3F7B9C2D5E8F1A2`
- Hidden under scratch-off layer
- Cryptographically secure
- Validated against database

**3. Checksum**: 3-character validation token
- Prevents fake card generation
- Server-side validation

### Fraud Detection System (In Development)

The platform includes multiple fraud prevention layers:

#### **Layer 1: Card Validation**
- Serial number + gift code matching
- One-time use enforcement
- Expiry date verification
- Status checks (active/redeemed/blocked)

#### **Layer 2: Velocity Checks**
- Phone number redemption limits
- IP address rate limiting
- Device fingerprinting
- Time-based pattern analysis

#### **Layer 3: Network Detection**
- Automatic operator identification (MTN, Airtel, Glo, 9Mobile)
- Phone number format validation
- Network compatibility checks

#### **Layer 4: Risk Scoring**
Each redemption receives a risk score (0-100):

| Risk Score | Risk Level | Action |
|-----------|-----------|--------|
| 0-30 | LOW | ✅ Auto-approve |
| 31-60 | MEDIUM | ⚠️ OTP verification |
| 61-85 | HIGH | 🔍 Manual review |
| 86-100 | CRITICAL | ❌ Block |

---

## 🎨 Design System

### Color Scheme
- **Primary**: Forest Green (#228B22) - Growth and trust
- **Background**: Light Green (#E0F8E0) - Soft, gentle backdrop
- **Accent**: Teal (#008080) - Call-to-action elements
- **Font**: Plus Jakarta Sans (sans-serif) - Modern, friendly, approachable

### UI Components (40+ Radix UI Components)
- Buttons, Inputs, Forms
- Dialogs, Alerts, Toasts
- Tables, Data grids
- Charts (Recharts)
- Dropdowns, Menus
- Tabs, Accordions
- Progress indicators
- Tooltips, Popovers
- Calendars, Date pickers

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-optimized interactions
- Accessible (WCAG 2.1)

---

## 📡 Application Routes

### Public Routes (No Authentication)
```
/                          # Homepage
/login                     # Politician login
/admin/login              # Admin login
/redeem                   # Card redemption form
/redeem/details           # Post-redemption details
/order                    # Order cards (landing page)
```

### Admin Routes (`/admin/*`)
```
/admin                    # Dashboard & KPIs
/admin/politicians        # All politicians
/admin/politicians/:id    # Politician details
/admin/analytics          # Platform analytics
/admin/fraud              # Fraud detection & alerts
/admin/cards              # All scratch cards
/admin/cards/:id          # Card details
/admin/redemptions        # All redemptions
/admin/redemptions/:id    # Redemption details
/admin/citizens           # User directory
/admin/citizens/:id       # Citizen profile
/admin/campaigns          # Campaign management
/admin/campaigns/:id      # Campaign details
/admin/profile            # Admin profile
/admin/settings           # Account settings
/admin/notifications      # Notification center
/admin/activity-log       # Audit log
```

### Politician Routes (`/politician/*`)
```
/politician               # Dashboard & KPIs
/politician/redemption    # Redemption tracking
/politician/redemption/:id # Redemption details
/politician/analytics     # Campaign analytics
/politician/orders        # Order history
/politician/orders/new    # Create new order
/politician/orders/:id    # Order details
/politician/profile       # Profile settings
/politician/settings      # Account settings
```

---

## 📊 Data Models (TypeScript Interfaces)

### Core Types

```typescript
// User Roles
type UserRole = "admin" | "politician";
type CardStatus = "active" | "redeemed" | "expired" | "blocked";
type RedemptionStatus = "pending" | "processing" | "completed" | "failed";
type MobileOperator = "MTN" | "Airtel" | "Glo" | "9Mobile";

// Scratch Card
interface ScratchCard {
  id: string;
  serialNumber: string;        // AB-123456
  giftCode: string;            // 16-char hex
  denomination: number;        // ₦200, ₦500, etc.
  giftType: "airtime" | "data";
  dataSize?: number;           // MB (if data card)
  status: CardStatus;
  orderId: string;
  mobileOperator?: MobileOperator;
  redeemedAt?: string;
  redeemedBy?: string;         // Phone number
  expiryDate?: string;
  createdAt: string;
}

// Order
interface Order {
  id: string;
  politicianId: string;
  batchId: string;
  totalCardValue: number;
  serviceFee: number;
  printingCost: number;
  totalPaid: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  cardCount: number;
  denominations: DenominationBreakdown[];
  createdAt: string;
  expiresAt: string;
}

// Redemption
interface Redemption {
  id: string;
  cardId: string;
  phoneNumber: string;
  mobileOperator: MobileOperator;
  giftType: "airtime" | "data";
  amount: number;
  status: RedemptionStatus;
  fraudScore: number;
  fraudFlags: string[];
  completedAt?: string;
  failureReason?: string;
  createdAt: string;
}
```

---

## 🚀 Development

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:8080

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_EBILLS_API_KEY=your_ebills_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

### Development Mode Features
- **Auth Bypass**: Development mode bypasses authentication
- **Mock Data**: All data is mocked for seamless testing
- **Hot Reload**: Instant updates on file changes
- **Type Safety**: Full TypeScript coverage

---

## 📈 Key Features

### ✅ Implemented
- [x] Full UI/UX design system
- [x] Role-based routing (Admin, Politician, Public)
- [x] Card code generation & validation
- [x] Network operator auto-detection
- [x] Mock data layer for development
- [x] Responsive design (mobile, tablet, desktop)
- [x] 40+ reusable UI components
- [x] State management (Zustand)
- [x] Form validation (React Hook Form + Zod)
- [x] Chart visualizations (Recharts)
- [x] Airtime service abstraction layer
- [x] Ebills API integration skeleton

### 🚧 In Progress
- [ ] Backend API implementation
- [ ] Database schema (PostgreSQL)
- [ ] JWT authentication
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Real-time fraud detection
- [ ] SMS notifications
- [ ] Email confirmations

### 📅 Planned
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (ML-based)
- [ ] Multi-currency support
- [ ] International expansion
- [ ] Blockchain transaction records
- [ ] WhatsApp redemption bot

---

## 💰 Business Model

### Revenue Streams
1. **Service Fee**: 10-25% on all card orders
2. **Printing Markup**: ₦150-₦200 per card
3. **Premium Features**: Advanced analytics, custom branding

### Example Order
```
Order: ₦10M in scratch cards
- 2,000 × ₦500 airtime = ₦1M
- 1,000 × ₦1,000 airtime = ₦1M
- 5,000 × 1GB data = ₦8M
Total Card Value: ₦10M
Service Fee (15%): ₦1.5M
Printing (8,000 cards × ₦200): ₦1.6M
Total Order Cost: ₦13.1M
Revenue: ₦3.1M
```

---

## 📞 Next Steps

### Immediate Priorities (Week 1-2)
1. Complete backend API skeleton
2. Set up PostgreSQL database
3. Implement JWT authentication
4. Connect frontend to real API

### Short-term (Month 1)
1. Paystack integration
2. Ebills live API connection
3. SMS notification service
4. Admin user management

### Medium-term (Months 2-3)
1. Security audit
2. Load testing
3. Beta launch with 3-5 politicians
4. Fraud detection refinement

---

## 🛠️ Technical Debt & Improvements

### Current Limitations
- Mock data (no persistent storage)
- Dev mode auth bypass
- No real payment processing
- No SMS/email notifications
- Limited error handling
- No test coverage

### Recommended Improvements
1. Add comprehensive unit tests (Jest/Vitest)
2. Implement E2E tests (Playwright/Cypress)
3. Add API documentation (OpenAPI/Swagger)
4. Set up CI/CD pipeline
5. Implement proper logging (Winston/Pino)
6. Add performance monitoring (Datadog/New Relic)

---

## 📄 License & Contact

**Version**: 0.1.0  
**Last Updated**: March 2, 2026  
**Status**: MVP Development  

**Contact**: kabriacid01@gmail.com  
**Figma Design**: [View Design](https://www.figma.com/design/tPeHbkVtc1QERApjFLEUFI/Scryn)

---

## 📚 Documentation

Additional documentation:
- blueprint.md - Original design specifications
- card-redemption-security.md - Security architecture
- admin-design-system-prompt.md - UI guidelines
- IMPLEMENTATION_PLAN - Development roadmap
- todo.md - Task tracking

---

**Built with ❤️ in Nigeria**
```

This updated README accurately reflects:
1. **Current implementation**: Airtime/data platform (not cash transfers)
2. **Actual tech stack**: React + Vite + Zustand + Radix UI
3. **Real project structure**: Feature-based architecture
4. **Implemented routes**: All admin, politician, and public routes
5. **Current status**: MVP with mock data, backend pending
6. **Network operators**: MTN, Airtel, Glo, 9Mobile support
7. **Simplified card codes**: Serial numbers + gift codes (no party prefixes)

The README now serves as accurate technical documentation for the current state of the project.This updated README accurately reflects:
1. **Current implementation**: Airtime/data platform (not cash transfers)
2. **Actual tech stack**: React + Vite + Zustand + Radix UI
3. **Real project structure**: Feature-based architecture
4. **Implemented routes**: All admin, politician, and public routes
5. **Current status**: MVP with mock data, backend pending
6. **Network operators**: MTN, Airtel, Glo, 9Mobile support
7. **Simplified card codes**: Serial numbers + gift codes (no party prefixes)

The README now serves as accurate technical documentation for the current state of the project.