Below is a clear, production-ready pattern you can use to detect & stop concurrent sessions by rotating/refreshing tokens on a short interval (3 min). It’s practical, secure, and used by pros.

# Short answer

Use **refresh-token rotation + server-side session records** (one refresh token per session, single-use). Have the client call a refresh endpoint every 3 minutes (or refresh on access expiry). The server stores the current refresh `jti`/token-id for that session; if a refresh arrives with a `jti` that no longer matches, treat it as a concurrent session/replay and force logout.

# Why this works (high level)

- Access tokens remain short-lived and stateless.
- Refresh tokens are **stateful** (you store their id + session info).
- You rotate the refresh token on each refresh (issue a new refresh token with new `jti` and mark the old `jti` as used).
- If a second device tries to refresh using an older (or stolen) refresh token, the `jti` won’t match the current one in DB → detect multi-active session → invalidate session(s).

# Components you need

1. Short-lived **access token** (e.g., 1–3 minutes if you want refresh checks every 3 min).
2. Rotating **refresh token** (HTTP-only cookie or secure store). Each refresh token contains a `jti` and `sessionId`.
3. **Session store** (DB or redis): one row per device/session containing `sessionId`, `currentRefreshId` (jti), `userId`, `lastSeen`, `expiresAt`, `status`.
4. Refresh endpoint that: validates incoming refresh token, verifies `jti === currentRefreshId`, issues new access + new refresh (new `jti`), updates DB atomically.
5. If mismatch: reject and optionally mark session invalid, revoke tokens, log out.

# DB schema (example)

```sql
sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID,
  current_refresh_jti VARCHAR,
  created_at TIMESTAMP,
  last_seen TIMESTAMP,
  expires_at TIMESTAMP,
  ip VARCHAR,
  ua TEXT,
  status ENUM('active','revoked')
)
used_refresh_tokens (
  jti VARCHAR PRIMARY KEY,
  session_id UUID,
  used_at TIMESTAMP
)
```

# Flow (step-by-step)

1. User logs in → server creates `sessionId` (UUID), generates:

   - `accessToken = jwt({ sub:userId, role, sessionId, jti:accessJti })` exp 1–3m
   - `refreshToken = jwt({ sub:userId, sessionId, jti:refreshJti })` exp e.g. 14d but rotated often
     Store `current_refresh_jti = refreshJti` in `sessions`.

2. Client stores access token in memory and refresh token in **HTTP-only cookie** (preferred).
3. Client uses access token for requests. When access expires (or every 3 min), client calls `/auth/refresh`.
4. `/auth/refresh`:

   - Verify refresh token signature.
   - Look up `sessionId` in DB, get `current_refresh_jti`.
   - If incoming `jti !== current_refresh_jti` → possible concurrent session/replay:

     - Option A (strict singlesession): mark session revoked, return 401 and force client logout.
     - Option B (detect then revoke other session): mark other session(s) revoked and return 401 to the latter request.

   - If matches: issue new accessToken and a **new** refreshToken with new `refreshJti`.
   - Atomically update `current_refresh_jti` to new `refreshJti`. Optionally store old `jti` in `used_refresh_tokens` to prevent replay.

5. Client receives new tokens and continues.

# Node.js-ish pseudo code (critical parts)

```js
// helper to issue tokens
function issueTokens(userId, sessionId) {
  const access = jwt.sign({ sub: userId, sessionId }, ACCESS_SECRET, { expiresIn: '3m' });
  const refreshJti = crypto.randomUUID();
  const refresh = jwt.sign({ sub: userId, sessionId, jti: refreshJti }, REFRESH_SECRET, { expiresIn: '14d' });
  return { access, refresh, refreshJti };
}

// refresh endpoint
app.post('/auth/refresh', async (req, res) => {
  const incoming = req.cookies.refreshToken; // httpOnly cookie
  const payload = jwt.verify(incoming, REFRESH_SECRET); // catch errors
  const { sessionId, jti: incomingJti, sub: userId } = payload;

  const session = await db.sessions.findById(sessionId);
  if (!session || session.status !== 'active') return res.status(401).send('invalid session');

  // mismatch => another session used refresh already
  if (session.current_refresh_jti !== incomingJti) {
    // handle concurrent login detection
    await db.sessions.update(sessionId, { status: 'revoked' });
    return res.status(401).send('session invalidated - concurrent login detected');
  }

  // rotate
  const { access, refresh, refreshJti } = issueTokens(userId, sessionId);
  await db.sessions.update(sessionId, { current_refresh_jti: refreshJti, last_seen: new Date() });

  // set httpOnly cookie with new refresh token
  res.cookie('refreshToken', refresh, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: /*ms*/ });
  res.json({ access });
});
```

# Handling race conditions / replay attacks

- Use **atomic DB update** (compare-and-set) to guarantee only one rotation wins. E.g., `UPDATE sessions SET current_refresh_jti = new WHERE current_refresh_jti = old`.
- Keep `used_refresh_tokens` for a short window to detect replays and reject them.
- If you allow multiple refresh endpoints in parallel, client must serialize refresh requests or server must handle CAS updates.

# Detecting “two active sessions” precisely

- You will detect a second active session when:

  - A refresh arrives with `jti != DB.current_refresh_jti` (i.e., another device already rotated).

- To enforce single active session globally:

  - When a new login happens, either:

    - Revoke all existing sessions for user and create one session record, or
    - Keep per-device sessions and let user manage devices; detecting mismatch only flags the session that lost the race.

# Recommended expirations for your use case

- `ACCESS_TOKEN`: **1–3 minutes** (you said 3 min checks — choose 1–3m).
- `REFRESH_TOKEN`: **7–14 days** but rotated on every refresh (so the lifetime is logical; old tokens cannot be reused).
- If you want immediate detection of concurrent sessions, set access short (1m) and require refresh every 3m or on access expiry.

# Security hygiene & best practices

- Always use HTTPS.
- Store refresh token in **HTTP-only, Secure cookie** to avoid JS access.
- Use CSRF protections if using cookies for refresh.
- Log and alert suspicious activity (multiple IPs, rapid refresh mismatch).
- Allow manual session/device management (user sees logged-in devices and can revoke).
- Consider token revocation lists or Redis for fast lookup.
- Monitor and rate-limit the refresh endpoint.

# TL;DR actionable plan for you

1. Implement per-session DB rows with `current_refresh_jti`.
2. Issue rotating refresh tokens (new `jti` each refresh).
3. Update DB with `compare-and-set` during rotation. If request `jti` mismatches, revoke session and 401 — this indicates another active session.
4. Use short access TTL (1–3m) and rotate refresh every refresh call. Store refresh token in httpOnly cookie.
