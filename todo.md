## 🎯 **Recommended Implementation Order:**

### **Phase 1: Authentication & Authorization (START HERE)** 🔐
**Impact: BLOCKS EVERYTHING ELSE**

**Why First:**
- Without proper auth, you can't identify users (politicians vs admin)
- Can't protect routes or associate data with users
- Blocks dashboard personalization and order creation
- Your middleware is currently bypassing in dev mode

**Tasks:**
1. Implement JWT/session-based authentication
2. Add `userId` and `userType` ("POLITICIAN" | "ADMIN") to session
3. Update login action to verify credentials against Prisma
4. Protect `/dashboard` and `/admin` routes properly
5. Add "Remember Me" functionality

**Files to modify:**
- actions.ts - Add Prisma user lookup & password verification
- middleware.ts - Real auth checks instead of dev bypass
- Add `src/lib/auth.ts` - Session management utilities
- Update Politician schema to add `role` field (or create User model)

---

### **Phase 2: Politician Order Processing** 📦
**Impact: CREATES DATA FOR DASHBOARD**

**Why Second:**
- Auth is in place, so you can associate orders with logged-in politicians
- Creates Orders → OrderItems → ScratchCards (foundational data)
- Populates the politician dashboard with real data
- Triggers card generation logic

**Tasks:**
1. Update `createOrder` action to save to Prisma
2. Generate scratch cards with unique codes/serials
3. Send confirmation email with order details
4. Create order status tracking workflow
5. Add photo upload to cloud storage (Cloudinary/S3)

**Files to modify:**
- actions.ts - Replace console.log with Prisma creates
- order-form.tsx - Add success redirect
- Add `src/lib/card-generator.ts` - Card code generation logic
- Add `src/lib/email.ts` - Email service (Resend/SendGrid)

---

### **Phase 3: Politician Dashboard Dynamics** 📊
**Impact: SHOWS REAL-TIME DATA**

**Why Third:**
- Auth + Orders are working, so you have data to display
- Politicians can see their own orders and cards
- Real KPIs instead of hardcoded numbers
- Links to Phase 2 (orders) and Phase 4 (redemptions)

**Tasks:**
1. Fetch politician-specific data using `session.userId`
2. Display real orders, cards issued, redemptions
3. Filter fraud alerts by politician's cards
4. Update charts with real data from Prisma
5. Add filtering, search, pagination

**Files to modify:**
- page.tsx - Replace static data with Prisma queries
- page.tsx - Filter by politician
- analytics-charts.tsx - Real chart data

---

### **Phase 4: Redemption Form & Verification** 💳
**Impact: CITIZENS REDEEM CARDS**

**Why Fourth:**
- Requires cards to exist (from Phase 2)
- Most complex: validation, fraud detection, payment processing
- Can work on this while testing Phases 1-3

**Tasks:**
1. Validate card code + serial against database
2. Check if card is ACTIVE (not already redeemed)
3. Collect citizen KYC details
4. Run AI fraud detection (`fraudDetectionAI` flow)
5. Create Redemption record with PENDING status
6. Redirect to details page for bank info
7. Integrate payment gateway (Paystack/Flutterwave)

**Files to modify:**
- actions.ts - Implement `redeemCard` with Prisma
- page.tsx - Capture citizen bank details
- Add actions.ts - Process payment
- redemption-form.tsx - Handle validation errors
- `src/lib/payment.ts` - Payment gateway integration

---

### **Phase 5: Admin Dashboard Dynamics** 👨‍💼
**Impact: MONITORING & CONTROL**

**Why Last:**
- Depends on all other data being in the system
- Admin needs to see ALL politicians, orders, redemptions
- Least critical for MVP (politicians and citizens are priority)
- You already have the pages set up from earlier

**Tasks:**
1. Already done! Admin pages are pulling real Prisma data
2. Add admin action handlers (approve/reject redemptions)
3. Add fraud alert resolution
4. Add politician account management
5. Add settings page functionality

**Files to modify:**
- page.tsx - Add action buttons
- Add actions.ts - Admin CRUD operations
- Update middleware to check for admin role

---

## 📋 **My Recommendation:**

```
START → Phase 1 (Auth) 
     → Phase 2 (Orders) 
     → Phase 3 & 4 (Parallel: Dashboard + Redemptions)
     → Phase 5 (Admin)
```

**Critical Path Dependencies:**
```
Auth ──→ Orders ──→ Dashboard
         ↓
    Cards Generated ──→ Redemptions ──→ Payments
                                    ↓
                              Admin Monitoring
```
