# ScrynCard Next-Gen: Next.js Full Stack Regeneration Prompt

**Project**: ScrynCard - B2B Data Redemption Platform for Nigeria  
**Scope**: General business & event cards (NOT political)  
**Tech Stack**: Next.js 14+ (App Router), MySQL 8 + Prisma, TypeScript 5.3  
**Focus**: DATA bundles (primary), smooth multi-step flows, reusable components

---

## 🎯 FRONTMATTER

**CRITICAL CONSTRAINTS**:
- ✅ Keep all existing React patterns: Zustand, React Hook Form + Zod, Radix UI components, Framer Motion animations
- ✅ No scale-on-hover animations (user preference: avoid `hover:scale-*` and `whileHover={{ scale }}`)
- ✅ All colors via Tailwind CSS custom properties (NO inline hex colors like `#228B22`)
- ✅ Component reusability: share step indicators, form fields, confirmation layouts across flows
- ✅ Focus on DATA redemption flow details (not airtime implementation)
- ✅ Next.js App Router patterns: Server Components, Client Components, API Routes
- ✅ GUEST PAGES ONLY: No vendor dashboard pages in this regeneration (backend pages created separately)
- ✅ Remove all politician-specific references completely

**CHANGES FROM CURRENT PROJECT**:
- Entities: `Politician` → `Vendor` (businesses/event organizers)
- Focus: `Airtime + Data` → **DATA BUNDLES** (primary)
- Auth: Mock Zustand → Real JWT + Session Management
- Database: Mock data → MySQL + Prisma
- Routing: React Router → Next.js App Router

---

## 📁 PROJECT STRUCTURE (Next.js App Router)

```
scryncard-nextjs/
├── app/
│   ├── layout.tsx                          # Root layout
│   ├── page.tsx                            # Home page (/)
│   ├── loading.tsx                         # Global loading skeleton
│   │
│   ├── auth/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx                  # Login page
│   │   ├── register/page.tsx               # Registration page
│   │
│   ├── redeem/
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # Redemption form page (/redeem)
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts              # POST /api/auth/login
│   │   │   ├── logout/route.ts             # POST /api/auth/logout
│   │   │   └── me/route.ts                 # GET /api/auth/me
│   │   ├── cards/
│   │   │   └── verify/route.ts             # POST /api/cards/verify
│   │   └── redemptions/
│   │       └── route.ts                    # POST /api/redemptions
│   │
│   └── error.tsx                           # Global error boundary
│
├── components/
│   ├── ui/                                 # Radix UI wrapped components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── form.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── shared/                             # Reusable across flows
│   │   ├── step-indicator.tsx              # Multi-step indicator component
│   │   ├── step-header.tsx                 # Icon + title + description
│   │   ├── loading-spinner.tsx
│   │   ├── success-confirmation.tsx        # Lottie + countdown (reused)
│   │   └── error-alert.tsx                 # Inline error display
│   │
│   └── forms/                              # Form-specific components
│       ├── card-verification-input.tsx     # Serial + Code dual field
│       ├── phone-input.tsx                 # Phone with network detection
│       ├── denomination-picker.tsx         # DATA plan selector
│       └── quantity-input.tsx              # Quantity with +/- buttons
│
├── features/
│   ├── redeem/                             # Redemption feature
│   │   ├── components/
│   │   │   ├── redemption-form.tsx         # Main form orchestrator
│   │   │   ├── card-verification-step.tsx  # Step 1: Serial + Code
│   │   │   ├── phone-verification-step.tsx # Step 2: Phone + Network
│   │   │   ├── confirmation-step.tsx       # Step 3: Review + Submit
│   │   │   └── redemption-success.tsx      # Success screen with animation
│   │   ├── hooks/
│   │   │   └── use-redemption-flow.ts      # Form state + step logic
│   │   ├── types/
│   │   │   └── schema.ts                   # Zod schemas for all steps
│   │   └── services/
│   │       └── redemption-service.ts       # API calls for card verification & redemption
│   │
│   ├── auth/                               # Authentication feature
│   │   ├── components/
│   │   │   ├── login-form.tsx              # Guest login (email + password)
│   │   │   ├── register-form.tsx           # Basic registration
│   │   │   └── auth-layout.tsx             # Shared auth layout
│   │   ├── hooks/
│   │   │   └── use-auth.ts                 # Auth store + session management
│   │   └── services/
│   │       └── auth-service.ts             # API calls for login/register
│   │
│   └── home/                               # Home/landing feature
│       └── components/
│           ├── hero-section.tsx            # Main value prop
│           ├── features-overview.tsx       # Platform features list
│           ├── cta-buttons.tsx             # "Redeem" & "Order" buttons
│           └── testimonials.tsx            # (optional) Social proof
│
├── lib/
│   ├── types.ts                            # Frontend TypeScript interfaces
│   ├── api-client.ts                       # Axios instance with interceptors
│   ├── auth-utils.ts                       # JWT token handling
│   ├── card-security.ts                    # Card code generation/validation
│   ├── operators.ts                        # Network detection logic
│   ├── formatters.ts                       # Phone, currency formatting
│   ├── env.ts                              # Environment variable parsing
│   ├── cn.ts                               # Tailwind class merging
│   │
│   ├── mock/                               # Mock data for development
│   │   ├── vendors.ts                      # Mock vendor data
│   │   ├── cards.ts                        # Mock scratch cards
│   │   ├── redemptions.ts                  # Mock redemption history
│   │   ├── data-plans.ts                   # Mock DATA denomination options
│   │   └── index.ts                        # Barrel export
│   │
│   └── constants/
│       ├── networks.ts                     # MTN, Airtel, Glo, 9Mobile configs
│       └── data-denominations.ts           # Available DATA plans (500MB, 1GB, etc.)
│
├── stores/
│   ├── auth-store.ts                       # Zustand: User auth + session
│   ├── redemption-store.ts                 # Zustand: Redemption form state
│   └── home-store.ts                       # (optional) Home page state
│
├── hooks/
│   ├── use-toast.ts                        # Toast notifications
│   ├── use-mobile.tsx                      # Mobile detection
│   ├── use-debounce.ts                     # Debounce hook
│   └── use-api.ts                          # Generic API hook
│
├── middleware.ts                           # Next.js middleware for auth checks
├── middleware.env.ts                       # Middleware config
│
├── app.config.ts                           # App configuration
├── tailwind.config.ts                      # (Updated) Colors via CSS vars
├── tsconfig.json                           # (Updated) Path aliases
│
├── .env.example
├── .env.local                              # Secrets (git-ignored)
├── package.json
└── README.md
```

---

## 🎨 DESIGN SYSTEM SPECIFICATION

**👉 IMPORTANT: The AI builder MUST generate a separate `design-system.md` file that includes:**

1. **Color Palette**
   - Primary (Green): From current index.css `--primary: 120 60% 33%` → `#228B22`
   - All colors configured as CSS custom properties in `:root`
   - Light mode + Dark mode variants
   - No inline hex colors in any component

2. **Typography Scale**
   - Font: Plus Jakarta Sans (400, 500, 600, 700, 800)
   - Heading sizes: h1-h6
   - Body text sizes: base, sm, xs
   - Line heights & letter spacing

3. **Component Patterns**
   - Form field wrapper with icon support
   - Button variants (primary, secondary, ghost, outline)
   - Card/container styles
   - Badge & status indicators
   - Loading skeleton variants

4. **Animation Guidelines**
   - Spring animations for transitions
   - Framer Motion patterns (AnimatePresence, motion.div)
   - Step transitions (slide-in from right/left)
   - Success animations (Lottie integration)
   - **FORBIDDEN**: No `hover:scale-*` or `whileHover={{ scale }}`

5. **Responsive Design**
   - Mobile-first Tailwind breakpoints
   - Tablet & Desktop layouts
   - Touch-friendly interaction targets (48px minimum)

---

## 🔐 GUEST PAGES SPECIFICATION

### **PAGE 1: HOME PAGE (`/`)**

**Purpose**: Public landing page showcasing platform value  
**Auth Required**: No  
**Components to Reuse**: Button, Card, Hero layout patterns

**Layout**:
- Header with Logo + "Redeem Card" & "Vendor Login" CTAs
- Hero Section:
  - Headline: "Instant Data Rewards from Your Favorite Vendors"
  - Subheading: Marketing copy about redemption value proposition
  - Visual: Large illustration or product screenshot
  - CTA Button: "Start Redeeming" → `/redeem`

- Features Section (3-4 cards):
  - Fast Redemption: "Get your data in seconds"
  - Secure: "Your privacy is protected"
  - Multi-Network: "Works on MTN, Airtel, Glo, 9Mobile"
  - Trusted: "Thousands of successful redemptions"

- Call-to-Action Section:
  - Two buttons:
    - Primary: "Redeem Your Card" → `/redeem`
    - Secondary: "Vendor Login" → `/auth/login`

- Footer: Contact info, privacy, terms

**Animations**:
- Hero content fade-in on load
- Features cards stagger animation (spring)
- Button hover effects (NO scale)

---

### **PAGE 2: REDEMPTION FLOW (`/redeem`)**

**Purpose**: Multi-step form for redeeming DATA cards  
**Auth Required**: No (guest-accessible)  
**Components to Reuse**: StepIndicator, StepHeader, SuccessConfirmation, ErrorAlert  

**Architecture**:
- Client Component: Main redemption form orchestrator
- 3-Step multi-step form with progress indicator
- Direction-based animations (forward/backward)
- Data persistence via Zustand store
- Smooth transitions between steps

---

#### **STEP 1: CARD VERIFICATION**

**Purpose**: Capture scratch card serial & gift code  
**Inputs**:
- **Serial Number Field**: Format `XX-XXXXXX`
  - Placeholder: "AB-123456"
  - Max length: 9 characters (auto-hyphenation)
  - Validation: `^[A-Z]{2}-[A-Z0-9]{6}$`
  - Icon: CreditCard (left side)
  - Error: Display inline below input
  - Success: Checkmark icon appears on valid format

- **Gift Code Field**: Format `XXX-HHHH-HHHH-HHHH`
  - Placeholder: "KPN-A3F7-B9C2-D4E5"
  - Max length: 19 characters (auto-hyphenation)
  - Validation: `^[A-Z]{3}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`
  - Icon: Key (left side)
  - Error: Display inline below input
  - Success: Checkmark icon appears on valid format

**Validation Logic**:
- Real-time validation as user types
- Sanitization: Remove invalid characters, auto-hyphenation
- Both fields must be valid to enable "Next" button
- Show visual feedback: green border on valid, red on invalid
- Disabled state during API verification call

**Visual Layout**:
- StepHeader component: CreditCard icon, "Card Verification", step indicator (1/3)
- Two input fields stacked vertically
- "Next" button (disabled until both valid)
- Animation: Slide-in from right with spring animation

**API Call**:
- POST `/api/cards/verify`
- Payload: `{ serialNumber, giftCode }`
- Response: Card details (denomination, type, operator hint)
- Error handling: Show alert with retry option

**User Flow**:
1. User enters serial number → real-time validation
2. User enters gift code → real-time validation
3. Both valid → "Next" button enabled
4. Click "Next" → Verify card via API
5. If valid → Move to Step 2
6. If invalid → Show error message, allow retry

---

#### **STEP 2: PHONE VERIFICATION**

**Purpose**: Capture recipient phone number & auto-detect network  
**Inputs**:
- **Phone Number Field**:
  - Format: `0XXXXXXXXXX` (11 digits)
  - Placeholder: "08012345678"
  - Max length: 11 characters
  - Input type: `tel`
  - Sanitization: Strip non-numeric characters, enforce 11-digit limit
  - Display digit count: "8/11 digits" helper text
  - Icon: Phone (left side)
  - Error: Display inline below input
  - Validation:
    - Must be exactly 11 digits
    - Must match Nigerian format (starts with 0)
    - No alphanumeric characters

- **Network Selector**: Dropdown (Auto-detected but manually overridable)
  - Options: MTN, Airtel, Glo, 9Mobile (with carrier icons/colors)
  - Auto-detection logic: Phone prefix (08X, 090X, etc.) → Network
  - User can override selection manually
  - Display selected network with colored badge
  - Icon: Wifi (left side)
  - Validation: Network must be selected

**Visual Feedback**:
- Phone input shows live digit count
- Network selector auto-updates based on phone prefix
- Selected network highlighted with primary green color
- Network icon displayed with badge

**Visual Layout**:
- StepHeader component: Phone icon, "Phone Number", step indicator (2/3)
- Phone input field with icon & digit counter
- Network selector below phone input
- "Back" button (left), "Next" button (right)
- Animation: Slide-in from right with spring animation

**API Call**:
- POST `/api/cards/verify-phone`
- Payload: `{ phoneNumber, network }`
- Response: Network confirmed, operator details
- Error handling: Show alert if phone invalid

**User Flow**:
1. User enters phone number → real-time validation + network detection
2. Network auto-selects based on prefix
3. User can manually change network if needed
4. Both fields valid → "Next" button enabled
5. Click "Next" → Verify phone via API
6. If valid → Move to Step 3
7. If invalid → Show error, allow retry
8. "Back" button → Return to Step 1 (data preserved)

---

#### **STEP 3: CONFIRMATION & SUBMISSION**

**Purpose**: Review all details & submit redemption request  
**Display (Read-Only)**:
- **Card Details Card**:
  - Serial Number: `AB-123456` (masked: XX-XX-XXXX)
  - Gift Code: `KPN-A3F7-B9C2-D4E5` (masked: XX-XX-XXXX)
  - Gift Type: `DATA` (Badge with icon)
  - Value: `2GB` (for DATA) or `₦5,000` (for airtime, not focused here)
  - Expiry Date: `DD MMM YYYY` (if applicable)

- **Recipient Details Card**:
  - Phone Number: `080xxxxxxxx` (show last 4 digits: ****5678)
  - Network: `MTN` (with carrier icon)
  - Network Color Badge: Yellow for MTN, Red for Airtel, etc.

- **DATA Plan Details** (if DATA plan has specific data size):
  - Data Size: `2GB`
  - Activation: "Activated immediately after confirmation"

**Actions**:
- "Edit" Button (secondary): Allows user to go back and edit (data preserved)
- "Confirm & Redeem" Button (primary, large): Submits redemption
  - On click: Initiate API call, show loading state
  - Disabled during submission
  - Show spinner + "Processing..." message

**Processing State**:
- Spinner animation (centered)
- Message: "Processing your redemption..."
- All buttons disabled
- Prevent user interaction

**Visual Layout**:
- StepHeader: FileCheck icon, "Confirm Redemption", step indicator (3/3)
- Multiple detail cards (Card Details, Recipient, Data Plan)
- Detail cards stagger-animate in (spring animation, sequential)
- "Back" button (left), "Confirm" button (right)
- Animation: Slide-in from right with spring animation

**API Call**:
- POST `/api/redemptions`
- Payload: `{ serialNumber, giftCode, phoneNumber, network, nin (if collected) }`
- Response: Redemption ID, success message
- Error handling: Show error alert with retry option

**On Success**:
- Show SuccessConfirmation component (reusable)
- Display redemption details
- Show Lottie success animation
- Auto-redirect after 5 seconds OR manual "Back to Home" button

**User Flow**:
1. Step 3 displays with all details
2. User reviews all information
3. User clicks "Edit" → Returns to previous step with data preserved
4. User clicks "Confirm" → API call initiated
5. Loading state shown
6. If successful → Show success confirmation screen
7. If error → Show error alert, allow retry
8. "Back" button → Return to Step 2 (data preserved)

---

#### **SUCCESS CONFIRMATION SCREEN**

**Purpose**: Celebrate successful redemption  
**Components**:
- **Lottie Animation**: Success checkmark (from `Success-Lottie-Animation.json`)
- **Success Message**: "Your DATA has been successfully delivered!"
- **Details Summary**:
  - DATA Size: `2GB`
  - Recipient: `+234 80xxxxxxxx`
  - Network: `MTN`
  - Timestamp: `Today at 2:30 PM`
  - Ref ID: `REF-XXXXX` (for support)

- **Actions**:
  - "Back to Home" Button: Redirect to `/`
  - Auto-redirect after 5 seconds (with countdown timer visible)

**Animations**:
- Lottie animation plays on load
- Details cards fade-in sequentially (spring)
- Countdown timer visible in button area
- Smooth transition to home page

---

#### **ERROR HANDLING & RETRY LOGIC**

**Error Scenarios**:
1. **Invalid Serial/Code Format**: Show inline input error
2. **Card Not Found**: "This card code could not be verified. Please check and try again."
3. **Card Already Redeemed**: "This card has already been redeemed."
4. **Card Expired**: "This card has expired."
5. **Invalid Phone Number**: Show inline input error
6. **Network Error**: "Failed to process redemption. Please try again."
7. **API Error**: Show error alert with retry button

**Retry Logic**:
- Errors show inline on inputs or as alerts
- User can edit fields and retry without losing data
- API errors show "Retry" button

**Data Persistence**:
- Form state persisted in Zustand store
- localStorage backup for form recovery
- User can refresh page without losing data

---

#### **MULTI-STEP FORM IMPLEMENTATION DETAILS**

**Form Architecture**:
- **useRedemptionFlow() Hook**: Orchestrates all steps, validation, API calls
  - Manages current step
  - Manages form state (React Hook Form)
  - Handles validation per step
  - Manages API calls
  - Handles errors and retries
  - Manages data persistence

- **Schema (Zod)**:
  ```typescript
  const RedemptionSchema = z.object({
    serialNumber: z.string().regex(/^[A-Z]{2}-[A-Z0-9]{6}$/),
    giftCode: z.string().regex(/^[A-Z]{3}-[A-Z0-9]{12}$/),
    phoneNumber: z.string().regex(/^0[789][01]\d{8}$/),
    network: z.enum(["MTN", "Airtel", "Glo", "9Mobile"]),
    // additional fields as needed
  });
  ```

- **Animation Strategy**:
  - AnimatePresence with mode="wait"
  - Direction-based animations (forward/backward)
  - Spring animations for smooth transitions
  - Step indicators sync with current step

**Key Reusable Components**:
- `StepIndicator`: Shows step progress (e.g., "Step 1 of 3")
- `StepHeader`: Icon + title + description
- `FormField`: Wrapper with validation error display
- `CardVerificationInput`: Dual input for serial + code
- `PhoneInput`: Phone with network detection
- `DenominationDisplay`: Shows DATA plan details
- `SuccessConfirmation`: Reused success screen with Lottie

---

### **PAGE 3: VENDOR LOGIN (`/auth/login`)**

**Purpose**: Vendor authentication portal  
**Auth Required**: No (public page, but authenticates user)  
**Components to Reuse**: FormField, Button, Alert  

**Layout**:
- Header with Logo + "Back to Home" button (top right)
- Centered card with login form
- Shadow & border styling

**Form Fields**:
- **Email Input**:
  - Type: `email`
  - Placeholder: "your@email.com"
  - Icon: Mail (left side)
  - Validation: Valid email format
  - Error: Display inline

- **Password Input**:
  - Type: `password` (with toggle to show/hide)
  - Placeholder: "••••••••"
  - Icon: KeyRound (left side)
  - Validation: Required
  - Error: Display inline
  - Toggle button: Eye icon to show/hide password

**Actions**:
- **Sign In Button**:
  - Primary green color (large, prominent)
  - Loading state: "Signing In..." with spinner
  - Disabled during submission
  - Text: "Sign In" or "Signing In..."

- **Forgot Password Link**: Placeholder (no implementation yet)
- **Back to Home Button**: Top-right corner

**Error Handling**:
- Top-level alert box (AlertCircle icon)
- Shows email/password validation errors inline on inputs
- API errors shown in top alert

**Visual Layout**:
- Centered card container
- Form fields stacked vertically
- Submit button spans full width
- "Back to Home" button in header
- Smooth transitions on focus/blur

**API Call**:
- POST `/api/auth/login`
- Payload: `{ email, password }`
- Response: JWT token, user details
- Store token in httpOnly cookie (secure)
- Redirect to `/vendor` on success

**User Flow**:
1. User enters email & password
2. Validates on blur/submit
3. Click "Sign In" → API call
4. If successful → Store JWT, redirect to `/vendor` dashboard
5. If error → Show error message, allow retry
6. "Back to Home" → Return to `/`

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### **State Management (Zustand)**

**Auth Store** (`stores/auth-store.ts`):
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Persisted to localStorage
// Synced across tabs
```

**Redemption Store** (`stores/redemption-store.ts`):
```typescript
interface RedemptionState {
  currentStep: number;
  formData: RedemptionFormValues;
  validationErrors: Record<string, string>;
  setStep: (step: number) => void;
  setFormData: (data: Partial<RedemptionFormValues>) => void;
  setError: (field: string, error: string) => void;
  reset: () => void;
}

// Persisted to localStorage for recovery
```

---

### **Form Validation (React Hook Form + Zod)**

**Patterns**:
- Real-time validation with debounce (500ms)
- Per-step validation (only validate current step fields)
- Custom validators (card code format, phone network)
- Automatic sanitization (phone, serial number auto-formatting)
- Error messages displayed inline on fields

**Example**:
```typescript
const schema = z.object({
  serialNumber: z
    .string()
    .min(9)
    .regex(/^[A-Z]{2}-[A-Z0-9]{6}$/, "Invalid format: XX-XXXXXX"),
  phoneNumber: z
    .string()
    .regex(/^0[789][01]\d{8}$/, "Invalid Nigerian phone number"),
});

const form = useForm({
  resolver: zodResolver(schema),
  mode: "onChange", // Real-time validation
});
```

---

### **Styling (Tailwind CSS)**

**Color System** (NO inline hex):
- Primary: `bg-primary`, `text-primary`, `border-primary` (green)
- Accent: `bg-accent`, `text-accent` (teal)
- Destructive: `bg-destructive`, `text-destructive` (red)
- Muted: `bg-muted`, `text-muted` (gray)

**Configured in `tailwind.config.ts`**:
```typescript
colors: {
  primary: "hsl(var(--primary))",  // From index.css
  accent: "hsl(var(--accent))",
  // ... all via CSS variables
}
```

**Animation Patterns** (NO hover scale):
```typescript
// ✅ ALLOWED
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: "spring", stiffness: 100 }}
/>

// ❌ FORBIDDEN
whileHover={{ scale: 1.05 }}
className="hover:scale-105"
```

---

### **API Routes & Data Flow**

**Card Verification** (`POST /api/cards/verify`):
```typescript
// Request
{ serialNumber: string, giftCode: string }

// Response
{
  id: string,
  denomination: number,
  giftType: "data" | "airtime",
  dataSize?: number,  // MB if data
  operator?: MobileOperator,
  expiryDate?: string,
  valid: boolean,
  message?: string
}
```

**Redemption** (`POST /api/redemptions`):
```typescript
// Request
{
  serialNumber: string,
  giftCode: string,
  phoneNumber: string,
  network: MobileOperator
}

// Response
{
  success: boolean,
  redemptionId: string,
  message: string,
  expiresAt: string
}
```

---

### **Mock Data Structure** (for development)

**`lib/mock/data-plans.ts`**:
```typescript
export const DATA_PLANS = [
  { id: "500mb", name: "500MB", value: 500, price: 1000 },
  { id: "1gb", name: "1GB", value: 1000, price: 2000 },
  { id: "2gb", name: "2GB", value: 2000, price: 3500 },
  { id: "5gb", name: "5GB", value: 5000, price: 8000 },
  { id: "10gb", name: "10GB", value: 10000, price: 15000 },
];
```

**`lib/mock/cards.ts`**:
```typescript
export const MOCK_CARDS = [
  {
    id: "card-1",
    serialNumber: "AB-123456",
    giftCode: "KPN-A3F7-B9C2-D4E5",
    denomination: 2000,
    giftType: "data" as const,
    dataSize: 2000, // MB
    status: "active",
    operator: "MTN",
  },
  // ... more cards
];
```

---

### **Component Reusability Strategy**

**Shared Components** (used across multiple flows):
1. **StepIndicator** (`components/shared/step-indicator.tsx`):
   - Displays progress (Step 1 of 3)
   - Used in: Redemption flow, future vendor order flow

2. **StepHeader** (`components/shared/step-header.tsx`):
   - Icon + Title + Description
   - Used in: All multi-step forms

3. **SuccessConfirmation** (`components/shared/success-confirmation.tsx`):
   - Lottie animation + details + countdown
   - Used in: Redemption success, future order success

4. **ErrorAlert** (`components/shared/error-alert.tsx`):
   - Inline error display with icon
   - Used in: All forms

5. **FormField** (`components/ui/form.tsx` - Radix UI wrapped):
   - Wrapper with label, validation, error message
   - Used in: All form inputs

6. **Button** (`components/ui/button.tsx` - Radix UI wrapped):
   - Primary, secondary, ghost, outline variants
   - Used in: All actions

---

### **Middleware & Session Management**

**`middleware.ts`**: (Next.js middleware)
- Check for JWT token in cookies
- Attach user context to requests
- Handle expired tokens (redirect to login)
- Protect API routes that require auth

**Session Flow**:
1. User logs in → Get JWT token
2. Store in httpOnly cookie (secure, prevents XSS)
3. Include in Authorization header for API calls
4. Refresh token on expiry
5. Logout clears token

---

## 📝 DELIVERABLES FOR AI BUILDER

**The AI builder should generate the complete Next.js project with the following structure.**

### **DELIVERABLE 1: Next.js Project Structure**
- All pages, components, hooks, types
- API routes for auth & redemption
- Zustand stores configured
- Mock data layer
- Middleware setup

### **DELIVERABLE 2: `design-system.md`** (NEW FILE)
The AI builder MUST create a separate `design-system.md` file that includes:

1. **Color System**
   - CSS variables from index.css
   - Primary: `--primary: 120 60% 33%` (Green #228B22)
   - Accent: `--accent: 180 100% 25%` (Teal)
   - All semantic colors (success, warning, error, info)
   - Usage guidelines for each color

2. **Typography**
   - Font stack: Plus Jakarta Sans + system-ui
   - Heading scale (h1-h6)
   - Body text sizes (base, sm, xs)
   - Font weights & line heights

3. **Component Patterns**
   - Form field wrapper
   - Button variants & states
   - Card container styles
   - Badge & status indicators
   - Loading skeletons

4. **Spacing & Layout**
   - Margin/padding scale
   - Border radius scale
   - Responsive grid system
   - Mobile-first approach

5. **Animation Guidelines**
   - Spring animations (stiffness, damping)
   - Transition durations
   - Easing functions
   - **FORBIDDEN patterns**: No hover scale

6. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Focus states
   - Color contrast ratios

---

### **DELIVERABLE 3: `admin-portal-prompt.md`** (NEW FILE)
The AI builder MUST create a separate `admin-portal-prompt.md` file (for future Vendor Admin Dashboard) that includes:

**This file should detail:**
1. **Admin Dashboard Scope** (Vendor-facing, not super-admin)
   - Dashboard home (vendor stats overview)
   - Orders management (view, track, analytics)
   - Card inventory (batch tracking, status)
   - Redemption analytics (charts, filters)
   - Profile & settings

2. **Admin Pages to Create**
   - `/vendor/dashboard` (home)
   - `/vendor/orders` (list)
   - `/vendor/orders/[id]` (details)
   - `/vendor/orders/new` (create - multi-step form, similar to redemption)
   - `/vendor/analytics` (charts & trends)
   - `/vendor/profile` (settings)

3. **Vendor Order Creation Flow** (Backend, not guest-facing)
   - Similar multi-step structure to redemption flow
   - Step 1: Select card template (Business, Wedding, Birthday)
   - Step 2: Customize (logo upload, brand colors, business details)
   - Step 3: Select data plans & quantities
   - Step 4: Review & confirm
   - Success: Order submitted, tracking available

4. **Vendor Analytics Section**
   - Total cards distributed
   - Redemption rate by plan
   - Network distribution (MTN vs Airtel vs Glo vs 9Mobile)
   - Redemption trends (line chart)
   - Export functionality

5. **Components to Create**
   - Vendor sidebar navigation
   - Analytics card components
   - Order status badge
   - Order timeline
   - Redemption chart (Recharts)
   - Data plan selector (reuse from redemption?)

---

## ✅ CRITICAL CHECKLIST

**Before deploying, ensure:**
- [ ] All colors use Tailwind CSS custom properties (NO hex in components)
- [ ] No `hover:scale-*` or `whileHover={{ scale }}` patterns anywhere
- [ ] All forms use React Hook Form + Zod
- [ ] All multi-step flows use AnimatePresence with direction-based animations
- [ ] Zustand stores persisted to localStorage
- [ ] Mock data layer in `/lib/mock/*` for development
- [ ] Shared components in `/components/shared/*` and `/components/ui/*`
- [ ] Feature-based folder structure (`/features/*`)
- [ ] TypeScript strict mode enabled
- [ ] All API calls use centralized axios instance from `lib/api-client.ts`
- [ ] Middleware setup for auth checks
- [ ] Redemption flow: 3 steps with smooth transitions
- [ ] Phone verification: Auto-network detection from prefix
- [ ] Card verification: Real-time validation + auto-hyphenation
- [ ] Success confirmation: Lottie animation + 5-second countdown
- [ ] Error handling: Inline validation + retry logic
- [ ] Responsive design: Mobile-first, tested on all breakpoints
- [ ] No politician-specific references anywhere
- [ ] Focus on DATA redemption (not airtime)
- [ ] Guest pages only (home, login, redeem) - NO vendor dashboard pages
- [ ] design-system.md generated with all color/typography/component patterns
- [ ] admin-portal-prompt.md generated with vendor dashboard specifications

---

## 📚 REFERENCE DOCUMENTATION

**Existing code to reference for patterns**:
- Current `/src/lib/card-security.ts`: Card code validation & formatting
- Current `/src/lib/operators/networkDetector.ts`: Phone-to-network mapping
- Current `/src/features/citizen/components/redemption/*`: Step components & animations
- Current `/src/stores/authStore.ts`: Zustand persistence pattern
- Current `/src/components/dashboard/order-form.tsx`: Multi-step form structure

**Key libraries**:
- Framer Motion: Animations & transitions
- React Hook Form: Form state management
- Zod: Schema validation
- Zustand: State persistence
- Radix UI: Component primitives
- Tailwind CSS: Styling (custom properties only)

---

## 🎯 SUCCESS CRITERIA

The regenerated project is successful when:
1. ✅ All guest pages (home, login, redeem) work smoothly
2. ✅ Redemption flow: 3 steps, smooth animations, real-time validation
3. ✅ Phone input: Auto-network detection from prefix
4. ✅ Card verification: Real-time format validation + auto-hyphenation
5. ✅ Success confirmation: Lottie animation + countdown timer
6. ✅ All forms use React Hook Form + Zod
7. ✅ No scale-on-hover animations (user preference)
8. ✅ All colors via Tailwind CSS custom properties
9. ✅ Component reusability: StepIndicator, StepHeader, SuccessConfirmation shared across flows
10. ✅ Mock data layer for development
11. ✅ Feature-based folder structure
12. ✅ TypeScript strict mode
13. ✅ design-system.md generated with complete specifications
14. ✅ admin-portal-prompt.md generated with vendor dashboard requirements
15. ✅ No political references anywhere
16. ✅ Focus on DATA redemption
