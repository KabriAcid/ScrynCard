/\*\*

- SCRYN CARD REDEMPTION SECURITY STRATEGY
-
- This document outlines the security considerations and implementation
- for the scratch card redemption system.
  \*/

// ============================================================================
// ATTACK VECTORS & MITIGATION STRATEGIES
// ============================================================================

/\*\*

- 1.  BRUTE FORCE ATTACKS
- - Risk: Attacker tries random codes to find valid cards
- - Mitigation:
-      • Require BOTH serial number + card code (increases search space)
-      • Rate limiting on redemption attempts
-      • Progressive lockout after failed attempts (3 strikes -> 24hr lock)
-      • Server-side validation only (never client-side)
-
- 2.  CARD CODE ENUMERATION
- - Risk: Attacker tries sequential codes from known batch
- - Mitigation:
-      • Randomized code generation (not sequential)
-      • Unique serial number per card (unguessable)
-      • Validate card belongs to correct order/batch
-      • Log all redemption attempts (success & failure)
-
- 3.  DOUBLE SPENDING / MULTIPLE REDEMPTIONS
- - Risk: Same card redeemed multiple times
- - Mitigation:
-      • Check card status BEFORE processing (active/redeemed/expired)
-      • Use database transaction for atomic operation
-      • Once redeemed, immediately set status to 'redeemed'
-      • Store redeemed timestamp & citizen ID
-
- 4.  FRAUD / COUNTERFEIT CARDS
- - Risk: Fabricated card codes or serial numbers
- - Mitigation:
-      • Cryptographic checksum/hash validation
-      • Card code format validation (politician prefix, date, random)
-      • Batch verification (card belongs to valid order)
-      • Fraud detection engine with ML-based anomaly detection
-
- 5.  MAN-IN-THE-MIDDLE (MITM)
- - Risk: Attacker intercepts redemption request
- - Mitigation:
-      • HTTPS/TLS only (enforced)
-      • CSRF protection on redemption form
-      • Session validation & authentication
-      • Signature verification if using API
-
- 6.  DATA LEAKAGE / INFORMATION DISCLOSURE
- - Risk: Full card codes exposed in logs, error messages
- - Mitigation:
-      • Mask card codes in logs (show last 4 digits only)
-      • Never expose full code in error messages
-      • Hash stored card codes (salted SHA-256)
-      • Encrypt sensitive data at rest
-
- 7.  REPLAY ATTACKS
- - Risk: Attacker captures & replays valid redemption request
- - Mitigation:
-      • Use nonce/one-time tokens for redemption forms
-      • Timestamp validation (request must be within 5 min)
-      • Check card status BEFORE redeeming
-      • Idempotency keys for API requests
-
- 8.  INSIDER THREATS
- - Risk: Admin/politician creates fake cards or manually redeems
- - Mitigation:
-      • Audit logging for all card operations
-      • Separate roles: card creation vs approval
-      • Two-factor authentication for sensitive operations
-      • Regular security audits & access reviews
  \*/

// ============================================================================
// RECOMMENDED REDEMPTION FLOW
// ============================================================================

/\*\*

- Step 1: Input Collection
- - User provides: Serial Number + Card Code
- - Format validation on both inputs
- - Client-side masking of code (show only last 4 digits)
-
- Step 2: Rate Limiting & Fraud Check
- - Check if citizen/IP has exceeded attempt limit (e.g., 3 per hour)
- - Check if card is in "recent attempts" blacklist
- - Verify citizen KYC status is "verified"
- - Run fraud detection engine
-
- Step 3: Card Lookup & Verification
- - Query database with BOTH serial number AND card code hash
- - Verify card exists and belongs to valid order
- - Check card status == "active" (not redeemed/expired/blocked)
- - Verify card batch matches politician + date
-
- Step 4: Citizenship Verification
- - Verify citizen account exists and is verified
- - Check citizen hasn't redeemed this card before
- - Check for duplicate redemptions (same card, different citizen)
-
- Step 5: Bank Account Validation
- - Validate bank details format
- - Optional: Name Enquiry (NIBSS) if using real API
- - Check account hasn't received too many transfers today
-
- Step 6: Atomic Redemption Transaction
- BEGIN TRANSACTION
- - Lock card row (SELECT FOR UPDATE)
- - Verify card still active (double-check)
- - Update card: status = 'redeemed', redeemedBy = citizenId, redeemedAt = now
- - Create Redemption record
- - Run fraud check & create FraudCheck record
- - Initiate bank transfer (async/queue)
- COMMIT TRANSACTION
-
- Step 7: Post-Redemption
- - Return success with redemption ID (NOT full card code)
- - Send SMS/email confirmation to citizen
- - Send audit log entry
- - Schedule fraud review if score > threshold
    \*/

// ============================================================================
// CARD CODE FORMAT SPECIFICATION
// ============================================================================

/\*\*

- Example: APC-5K-B001-A3F7B9C2-X7
-
- Components:
- 1.  POLITICIAN PREFIX (3 chars): APC
- - Derived from political party abbreviation
- - Helps identify card origin
-
- 2.  DENOMINATION (2 chars): 5K (5000), 10K, 100K, 1M, etc.
- - Validates card denomination
-
- 3.  BATCH ID (4 chars): B001
- - Links card to specific order/batch
- - Enables batch validation
-
- 4.  RANDOM TOKEN (8 chars): A3F7B9C2
- - Cryptographically random (base32/hex)
- - Makes enumeration infeasible
-
- 5.  CHECKSUM (2 chars): X7
- - Luhn algorithm or CRC32 checksum
- - Validates code integrity
- - Catches typos & simple alterations
-
- SECURITY: Serial number is stored separately in database
- - Actual DB lookup uses serial + code hash
- - Code is never returned in responses (only last 4 chars for reference)
    \*/

// ============================================================================
// DATABASE CONSIDERATIONS
// ============================================================================

/\*\*

- Table: scratch_cards
- - id: UUID (primary key)
- - serial_number: VARCHAR(50) UNIQUE (unguessable random string)
- - code_hash: VARCHAR(64) (SHA-256 of code)
- - code_checksum: VARCHAR(4) (for validation)
- - denomination: INT
- - order_id: UUID (foreign key)
- - batch_id: VARCHAR(50) (for bulk operations)
- - status: ENUM('active', 'redeemed', 'expired', 'blocked')
- - redeemed_by: UUID (citizen ID, nullable)
- - redeemed_at: TIMESTAMP (nullable)
- - created_at: TIMESTAMP
- - expires_at: TIMESTAMP
-
- Indexes:
- - PRIMARY KEY (id)
- - UNIQUE (serial_number) - for fast lookup
- - INDEX (order_id, status) - for batch queries
- - INDEX (batch_id, status) - for batch management
- - INDEX (created_at, status) - for date range queries
-
- Never index code_hash directly (would leak information)
- Lookup is: WHERE serial_number = ? AND code_hash = ?
  \*/

// ============================================================================
// IMPLEMENTATION CHECKLIST
// ============================================================================

/\*\*

- UI/UX:
- ☐ Two separate input fields: Serial Number & Card Code
- ☐ Mask code input (show dots, display last 4 on confirm)
- ☐ Clear instructions on where to find each value
- ☐ Real-time validation (format check only, not existence)
- ☐ Progress indicator (step 1: info, step 2: verify, step 3: processing)
-
- Backend:
- ☐ Rate limiting middleware (3 attempts per hour per IP)
- ☐ Input validation (format, length, character set)
- ☐ Dual lookup: serial_number + code_hash
- ☐ Status check before processing
- ☐ Atomic transaction for redemption
- ☐ Comprehensive audit logging
- ☐ Fraud detection integration
-
- Security:
- ☐ HTTPS/TLS required
- ☐ CSRF tokens on forms
- ☐ Masked codes in logs (e.g., "\*\*\*\*B9C2")
- ☐ No sensitive data in error messages
- ☐ Response doesn't echo back full code
- ☐ Rate limit response headers
-
- Testing:
- ☐ Unit tests for code format validation
- ☐ Integration tests for redemption flow
- ☐ Security tests (brute force, enumeration, replay)
- ☐ Load testing for concurrent redemptions
- ☐ Fraud detection threshold testing
  \*/

export {};
