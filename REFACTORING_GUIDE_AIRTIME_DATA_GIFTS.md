# ScrynCard Refactoring Guide: Money Redemption → Airtime & Data Gift Platform

## 🎯 Executive Summary

Transform the platform from a **direct cash disbursement system** to a **gift-based airtime/data redemption platform**. The core architecture remains intact, but business logic, data models, and UI copy require strategic updates.

**Scope**: ~80% code reuse with targeted changes to:

- Data types and interfaces
- Mock data and business logic
- UI/messaging and copy
- Validation rules
- Analytics metrics

**Estimated effort**: 40-60 hours for full refactor

---

## 📊 Current vs. Target Model

### Current Flow (Money Disbursement)

```
Politician → Orders scratch cards (with denominations like ₦5K, ₦10K)
          → Citizens scratch card, validate code
          → Citizens redeem to bank account
          → ₦Amount transferred directly to citizen
```

### Target Flow (Airtime & Data Gifts)

```
Politician → Creates gift packages (e.g., "₦5K airtime", "500MB data")
          → Orders scratch cards with gift codes
          → Citizens scratch card, validate code
          → Citizens redeem to selected telecom provider
          → Airtime/Data credited directly to citizen's phone
          → Politician sees redemption tracking (not fund transfers)
```

### Key Differences

| Aspect                 | Current                           | Target                                       |
| ---------------------- | --------------------------------- | -------------------------------------------- |
| **Redemption Type**    | Bank transfer                     | Airtime/Data distribution                    |
| **Delivery Mechanism** | Wire transfer                     | Telecom API calls                            |
| **Validation**         | Bank account details              | Phone number + operator selection            |
| **Personal Data**      | BVN, voter card info              | Phone number, operator preference            |
| **Analytics**          | "Payouts disbursed"               | "Airtime gifted" / "Data packages given"     |
| **Fraud Concerns**     | Account mismatch, double-spending | Operator verification, duplicate redemptions |

---

## 🔧 Detailed Refactoring Steps

### Phase 1: Data Model Updates (Priority 1)

#### 1.1 Update Type Definitions

**File**: `src/lib/mockTypes.ts`

```typescript
// REMOVE/DEPRECATE
- Redemption.bankName
- Redemption.accountNumber
- Redemption.accountName
- Redemption.transferReference
- Redemption.bvn (from citizen side)
- Redemption.favoriteParty
- Redemption.hasVotersCard

// ADD
- Redemption.mobileOperator: "MTN" | "Airtel" | "Glo" | "9Mobile"
- Redemption.phoneNumber: string
- Redemption.giftType: "airtime" | "data" // or "airtime" | "data_bundle_500mb" | "data_bundle_1gb"
- Redemption.operatorReference: string // Telecom provider's reference
- Redemption.expiresAt: string // When airtime/data expires

// RENAME FOR CLARITY
- ScratchCard.code → ScratchCard.giftCode
- Order → Campaign (might be clearer, but optional)
- denomination → amount (for airtime amounts) + giftType field
```

#### 1.2 Update Card Model

**File**: `src/lib/mockTypes.ts`

```typescript
export interface ScratchCard {
  id: string;
  serialNumber: string;
  giftCode: string; // Renamed from 'code'
  denomination: number; // Keep for ₦ amount
  giftType: "airtime" | "data"; // NEW
  dataSize?: number; // e.g., 500 (MB) if giftType="data"
  status: CardStatus; // Still active/redeemed/expired/blocked
  orderId: string;
  mobileOperator?: "MTN" | "Airtel" | "Glo" | "9Mobile"; // NEW
  redeemedAt?: string;
  redeemedBy?: string; // phone number instead of account name
  expiresAt?: string;
  createdAt: string;
}
```

#### 1.3 Update Redemption Model

**File**: `src/lib/mockTypes.ts`

```typescript
export interface Redemption {
  id: string;
  cardId: string;
  card?: ScratchCard;
  citizenId?: string; // Can be null for anonymous redemptions
  phoneNumber: string; // PRIMARY identifier now
  mobileOperator: "MTN" | "Airtel" | "Glo" | "9Mobile";
  giftType: "airtime" | "data";
  amount: number; // ₦ value of airtime
  dataSize?: number; // MB if data gift
  status: RedemptionStatus; // pending/processing/completed/failed
  operatorReference?: string; // Telecom provider's transaction ID
  fraudScore: number; // Still needed
  fraudFlags: string[];
  completedAt?: string;
  failureReason?: string;
  createdAt: string;

  // REMOVE OLD FIELDS:
  // bankName, accountNumber, accountName, transferReference
  // bvn, dob, favoriteParty, hasVotersCard
}
```

---

### Phase 2: UI/Component Updates (Priority 2)

#### 2.1 Citizen Redemption Flow

**Files affected**:

- `src/features/citizen/pages/RedeemPage.tsx`
- `src/features/citizen/pages/RedeemDetails.tsx`
- `src/features/citizen/components/redemption/*.tsx`
- `src/features/citizen/components/redemption/schema.ts`

**Changes**:

```typescript
// OLD SCHEMA (redemption/schema.ts)
- cardCode, serialNumber inputs
- bankName, accountNumber, accountName fields
- BVN validation
- favoriteParty, hasVotersCard questions
- Location/LGA selection

// NEW SCHEMA
+ phoneNumber (validate Nigerian format)
+ mobileOperator selection (MTN, Airtel, Glo, 9Mobile)
+ giftType preview (display whether it's airtime or data)
+ Optional citizen email (for notifications)
- Remove all banking/political questions
- Remove voter card checks
```

**Redemption Steps**:

1. **Scratch & Validate**: User enters gift code, system shows "₦5K MTN Airtime"
2. **Confirm Operator & Phone**: User confirms their mobile operator + phone number
3. **Verify Phone**: OTP sent to phone number for verification
4. **Success**: Airtime/data credited (show message with telecom reference)

#### 2.2 Update Citizen Components

**File**: `src/features/citizen/components/redemption/`

- **CardVerificationStep.tsx**: Change from "Card Code" → "Gift Code"
  - Show: "What gift are you redeeming?" with operator/amount display
- **PersonalDetailsStep.tsx**: REMOVE or REPURPOSE
  - REMOVE: Full name, email, DOB, party affiliation
  - KEEP: Phone number, operator selection
  - ADD: Optional email for receipt notification
- **BankDetailsStep.tsx**: REPLACE with **PhoneVerificationStep.tsx**
  - Input: Phone number (with country code formatting)
  - Input: Select mobile operator dropdown
  - NEW: OTP verification flow
- **LocationStep.tsx**: REMOVE entirely
  - No longer need state/LGA selection
- **SuccessConfirmation.tsx**: Update messaging
  - "Your ₦5,000 airtime has been credited to 0908765XXX"
  - Show telecom reference number
  - Show expiry date if applicable

---

### Phase 3: Politician Dashboard Updates (Priority 2)

#### 3.1 Update Orders Page

**File**: `src/features/politician/pages/Orders.tsx`

**Rename concepts**:

- "Place New Order" → "Create Gift Campaign"
- "Scratch Cards" → "Gift Packages"
- Show metrics: Total airtime gifted, total data packages given

#### 3.2 Update NewOrder Page

**File**: `src/features/politician/pages/NewOrder.tsx`

**Current flow**:

```
1. Select denominations (₦5K, ₦10K, etc.)
2. Configure quantities per denomination
3. Order summary → payment
```

**New flow**:

```
1. Select gift type: Airtime OR Data Package
2. If Airtime:
   - Select denominations (₦500, ₦1K, ₦5K, ₦10K)
   - Select target operators (MTN, Airtel, etc.)
   - Configure quantities
3. If Data:
   - Select package sizes (100MB, 500MB, 1GB, 2GB)
   - Select target operators
   - Configure quantities
4. Order summary (breakdown by operator/amount)
5. Proceed to payment
```

#### 3.3 Update Redemption Page (Politician View)

**File**: `src/features/politician/pages/Redemption.tsx`

**Rename to**: "Redemption Tracking" or "Gift Distribution Status"

**Metrics to change**:

```
OLD METRICS:
- Total Redemptions: 1,234
- Successful Payouts: ₦6.2M
- With Voter's Card: 856

NEW METRICS:
- Total Gifts Redeemed: 1,234
- Airtime Distributed: ₦6.2M
- Data Packages Given: 512 (units)
- Redemption Rate: 78%
```

**Table columns**:

```
OLD:
- Date, Amount, Status, Citizen Name, Card Code, Bank, Party

NEW:
- Date, Gift Type, Amount/Size, Status, Phone Number, Operator, Reference
```

#### 3.4 Update RedemptionDetails Page

**File**: `src/features/politician/pages/RedemptionDetails.tsx`

**Remove sections**:

- Bank details
- Voter card info
- Party affiliation
- Personal address details (keep minimal for fraud checks)

**Add sections**:

- Mobile operator confirmation
- Phone number (partially masked: 090876XXXX)
- Telecom reference number
- Airtime expiry date
- Operator status check link (optional)

---

### Phase 4: Admin Dashboard Updates (Priority 3)

#### 4.1 Update Admin Analytics

**File**: `src/features/admin/pages/Analytics.tsx`

**KPI Changes**:

```
OLD:
- Total Cash Disbursed: ₦XXM
- Average Payout: ₦5K
- Redemption Success Rate: 95%

NEW:
- Total Airtime Gifted: ₦XXM
- Total Data Distributed: XXXMB/GB
- Redemption Success Rate: 95%
- Operator Breakdown: (pie chart: MTN %, Airtel %, Glo %, 9Mobile %)
```

#### 4.2 Update Fraud Detection

**File**: `src/features/admin/pages/Fraud.tsx`

**New fraud flags**:

- Duplicate phone numbers across politicians
- Same operator multiple times per day (≥5)
- High-value airtime to new numbers
- Operator API failures
- REMOVE: Account holder mismatch, bank fraud checks

#### 4.3 Update Citizens Page

**File**: `src/features/admin/pages/Citizens.tsx`

**Remove from citizen profile**:

- Voter card status
- Party affiliation
- Bank accounts
- BVN

**Add to citizen profile**:

- Primary phone number
- Preferred mobile operator
- Redemption frequency (last 30 days)
- Total airtime/data received

---

### Phase 5: Mock Data Updates (Priority 1)

#### 5.1 Update mockTypes Data

**Files**: `src/lib/mock/redemptions.ts`, `src/lib/mock/cards.ts`

```typescript
// Before:
{
  id: "RED-001",
  amount: 5000,
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "AISHA BELLO",
  status: "completed"
}

// After:
{
  id: "RED-001",
  cardId: "CARD-001",
  phoneNumber: "08067234567",
  mobileOperator: "MTN",
  giftType: "airtime",
  amount: 5000,
  status: "completed",
  operatorReference: "MTN-20240115-X7F9K2",
  completedAt: "2024-01-15T14:30:00Z"
}
```

#### 5.2 Update Politician Stats

**File**: `src/lib/mockTypes.ts` → `PoliticianStats`

```typescript
export interface PoliticianStats {
  totalOrderValue: number; // Keep for revenue tracking
  activeOrders: number; // Keep
  totalAirtimeDistributed: number; // NEW: ₦ amount
  totalDataDistributed: number; // NEW: MB/GB
  totalRedemptions: number; // Keep
  redemptionRate: number; // Keep
  operatorBreakdown: {
    // NEW
    MTN: number;
    Airtel: number;
    Glo: number;
    "9Mobile": number;
  };
}
```

---

### Phase 6: Service Layer Updates (Priority 3)

#### 6.1 Update Mock Services

**File**: `src/services/mockService.ts`

```typescript
// OLD
async validateCard(cardCode: string) → returns { success, amount, ... }
async redeemCard(cardCode, citizenData: bankDetails) → processes bank transfer

// NEW
async validateGift(giftCode: string) → returns { success, giftType, amount, operator, expiryDate, ... }
async redeemGift(giftCode, citizenData: { phoneNumber, mobileOperator }) → processes telecom API call
async verifyPhoneNumber(phoneNumber, otp) → validates OTP
```

#### 6.2 Update Stores

**File**: `src/stores/citizenStore.ts`

```typescript
// Update action names for clarity
validateCard → validateGift
redeemCard → redeemGift
currentRedemption state properties → match new Redemption interface
```

---

### Phase 7: Routing & Navigation (Priority 2)

**No major changes needed**, but update labels:

```typescript
// src/App.tsx
- "/redeem" → "/redeem" (keep same)
- "/redeem/details" → "/redeem/confirmation" (optional rename)
- "/order" → "/gift" or keep as "/order"
```

**Updated breadcrumbs/labels**:

- "Scratch Cards" → "Gift Packages"
- "Redemption" → "Gift Distribution"
- "Verify Card Code" → "Verify Gift Code"
- "Bank Transfer" → "Telecom Delivery"

---

## 📋 Implementation Checklist

### ✅ Phase 1: Data Models (Start Here)

- [ ] Update `mockTypes.ts` - new Redemption/ScratchCard interfaces
- [ ] Update `types.ts` - update `Redemption` type
- [ ] Update mock data generators - new sample data
- [ ] Update Zustand stores - align with new data structure

### ✅ Phase 2: Citizen Features

- [ ] Create `PhoneVerificationStep.tsx` component
- [ ] Remove/repurpose `BankDetailsStep.tsx`
- [ ] Remove `LocationStep.tsx`
- [ ] Update redemption schema validation
- [ ] Update `SuccessConfirmation.tsx` messaging
- [ ] Update `RedeemPage.tsx` flow

### ✅ Phase 3: Politician Features

- [ ] Update `NewOrder.tsx` - giftType selector + operator selection
- [ ] Update `Orders.tsx` - table columns, metrics
- [ ] Update `Redemption.tsx` - metrics, table structure
- [ ] Update `RedemptionDetails.tsx` - remove bank fields

### ✅ Phase 4: Admin Features

- [ ] Update `Analytics.tsx` - operator breakdown, airtime/data metrics
- [ ] Update `Fraud.tsx` - new fraud flag logic
- [ ] Update `Citizens.tsx` - remove bank/voter data, add phone/operator
- [ ] Update `Redemptions.tsx` - new KPI cards

### ✅ Phase 5: Services & Logic

- [ ] Update `mockService.ts` - validateGift, redeemGift methods
- [ ] Update validation rules - phone number format, operator selection
- [ ] Update error messages - reference telecom APIs instead of banks

### ✅ Phase 6: Documentation

- [ ] Update component comments
- [ ] Update README explaining airtime/data model
- [ ] Update API documentation (if exists)
- [ ] Document telecom operator requirements

---

## 🎨 UI/Copy Updates Reference

### Key Copy Changes

```
"Place an order" → "Create a gift campaign"
"Scratch your card" → "Scratch your gift code"
"Bank account number" → "Mobile phone number"
"Amount transferred" → "Airtime/Data credited"
"Redemption" → "Gift redemption" or just "Redemption"
"Verified with voter's card" → "Phone number verified"
"Card code" → "Gift code"
"Successful payouts" → "Successful distributions"
"Redemption statistics" → "Gift distribution status"
```

### Icons to Update

- Money/Bank icons → Mobile/Telecom icons
- Card icon → Gift icon or keep card
- Bank transfer icon → Mobile network icon

---

## 🔐 Security & Validation Changes

### New Validation Rules

```typescript
// Phone number validation
- Nigerian format: 0[789]0[1-9][0-9]{7}
- +234 format: +234[789]0[1-9][0-9]{7}

// Mobile operator detection
- MTN: 0703-0704-0706-0706-0706-0916
- Airtel: 0701-0708-0802-0808-0812
- Glo: 0705-0807
- 9Mobile: 0809-0817

// Fraud flags to add
- Multiple redemptions same phone (>5 in 24hrs)
- High-value airtime to new numbers
- Operator API failures
- Impossible geolocation data
```

### Removed Validation

- BVN validation (no longer needed)
- Bank account validation
- Account name matching
- Voter card verification

---

## 📈 Analytics & Reporting

### New Metrics to Track

```
- Airtime by operator (MTN: 45%, Airtel: 35%, Glo: 15%, 9Mobile: 5%)
- Data packages redeemed (by size: 100MB, 500MB, 1GB, 2GB)
- Redemption by denomination (₦500, ₦1K, ₦5K, ₦10K)
- Operator redemption success rate
- Average time to credit (by operator)
- Phone number uniqueness ratio
```

### Deprecate Metrics

- Bank transfer metrics
- Account holder verification metrics
- Voter card engagement metrics

---

## 🚀 Implementation Order (Recommended)

1. **Day 1-2**: Update data models (`mockTypes.ts`, `types.ts`)
2. **Day 2-3**: Update mock data and stores
3. **Day 3-4**: Refactor citizen redemption flow
4. **Day 4-5**: Update politician features (Orders, Redemption pages)
5. **Day 5-6**: Update admin dashboard
6. **Day 6-7**: Test, bug fixes, polish UI copy
7. **Day 7**: Deploy and monitor

---

## ⚠️ Potential Challenges

1. **Telecom API Integration** - Will need actual operator APIs later

   - Placeholder: Use mock responses with operator references
   - Future: Integrate MTN, Airtel, Glo, 9Mobile APIs

2. **Phone Number Verification** - OTP flow complexity

   - Recommendation: Use mock OTP for dev, integrate SMS provider later

3. **Data Migration** - If production has existing data

   - Plan: Create migration script if needed

4. **Testing** - Phone number edge cases, operator variations
   - Add comprehensive validation tests

---

## 📚 Files to Create/Modify Summary

### Create (New Components)

- `src/features/citizen/components/redemption/PhoneVerificationStep.tsx`

### Modify (Major Changes)

- `src/lib/mockTypes.ts`
- `src/lib/types.ts`
- `src/features/citizen/pages/RedeemPage.tsx`
- `src/features/citizen/components/redemption/schema.ts`
- `src/features/citizen/components/redemption/PersonalDetailsStep.tsx` (rename/replace)
- `src/features/politician/pages/NewOrder.tsx`
- `src/features/politician/pages/Orders.tsx`
- `src/features/politician/pages/Redemption.tsx`
- `src/features/admin/pages/Analytics.tsx`
- `src/services/mockService.ts`
- `src/stores/citizenStore.ts`

### Modify (Minor Changes)

- `src/App.tsx` (update route labels)
- `src/features/politician/pages/RedemptionDetails.tsx`
- `src/features/admin/pages/Fraud.tsx`
- `src/features/admin/pages/Citizens.tsx`
- All components with "Bank", "Card Code" in copy
- Icon libraries (replace banking icons with telecom icons)

---

## ✨ Summary

This refactor transforms the platform from **cash disbursement → gift-based airtime/data distribution**. The architecture is 80% reusable; most changes are in data structures, validation logic, and UI messaging. The migration is straightforward because:

✅ Same order/redemption flow concept  
✅ Same politician/admin dashboard structure  
✅ Same fraud detection patterns (adapt rules)  
✅ Minimal routing changes  
✅ No database schema changes (just field names)

**Next step**: Start with Phase 1 (data models) and update incrementally. Each phase builds on the previous one.
