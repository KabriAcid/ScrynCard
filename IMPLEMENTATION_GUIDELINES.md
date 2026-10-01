## Recommended approach

Treat the supplied API integration document as a provider reference, not as code the browser should call directly. Use this flow:

`Vite frontend → your backend API → database and SME Plug`

The frontend should call only your backend. Keep the provider private key on the server; **never** place it in a `VITE_*` variable or browser bundle.

A practical backend layout:

```text
server/src/
  config/             # validated environment settings
  middleware/         # auth, validation, rate limits
  modules/
    catalog/          # networks and data plans
    redemptions/      # card checks and redemption lifecycle
  providers/smeplug/  # API client, request/response mapping
  webhooks/smeplug/   # callback verification and processing
  db/                 # schema, migrations, repositories
  jobs/               # reconciliation and retry work
```

## Security and correctness

- **Verify the provider documentation first.** Confirm the base URL, network IDs, plan IDs, error formats, sandbox, webhook authentication, and retry/idempotency behavior with current official SME Plug docs. The supplied webhook example doesn’t specify how to authenticate callbacks.
- **Validate cards on your backend.** Check serial and code against your database, rate-limit failed attempts, and ensure each card can only be redeemed once.
- **Make redemption stateful and idempotent.** Create a unique internal redemption/reference, reserve the card as pending, and prevent duplicate submissions. Don’t blindly retry purchases after timeouts; first determine whether the provider processed the transaction.
- **Handle provider calls outside long database locks.** Persist a pending state, call the provider, then update the redemption conditionally. Reconcile uncertain outcomes and process duplicate or delayed webhooks safely.
- **Verify webhooks.** Require provider-supported signatures or another authenticated mechanism, validate references and status transitions, and deduplicate callbacks. Don’t trust a callback just because it contains a matching reference.
- **Treat prices and plans as server-owned.** Fetch networks/plans through your backend, cache them briefly, and have the server validate the selected plan and derive its price. Never trust a client-supplied amount.
- **Protect sensitive data.** Collect NIN only if genuinely required; don’t send it to SME Plug unless their API requires it. Minimize retention, restrict access, and avoid logging NINs, full phone numbers, card codes, or credentials.
- **Restrict endpoints.** Keep balance, transaction history, bank transfers, and device management behind authorized server-side roles. Don’t expose unrelated provider capabilities just because they’re in the reference.
- **Add operational safeguards.** Set request timeouts, rate limits, safe error responses, structured redacted logs, provider-balance alerts, and monitoring for pending/failed redemptions. Rotate provider keys and store them in the deployment secret manager.

Start with catalog retrieval and airtime/data redemption. Add transfers or other endpoints only when they’re confirmed product requirements.