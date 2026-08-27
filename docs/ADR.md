# Architecture Decision Records

## ADR-001: Seller as a distinct signup role

Decision: Seller is a separate role chosen at signup, not a dynamic flag a buyer can toggle.
Reason: Sellers have distinct responsibilities (listings, inventory, fulfillment) — locking
this at signup removes ambiguity about "when does a user become a seller."

## ADR-002: Admin is platform oversight only

Decision: Admin does not participate in the buy/sell transaction path (no fulfillment).
Admin's scope: suspend/ban users, remove policy-violating listings, view platform-wide
order/revenue metrics.
Reason: Keeps the transaction path (buyer/seller) simple and auditable; Admin is a
moderation layer, not an operational one.

## ADR-003: Reviews deferred to v2

Decision: Reviews are out of scope for v1.
Reason: Core loop (browse → buy → fulfill) must work end-to-end before adding secondary
features. Schema should not block adding reviews later (orders remain the anchor for a
future review).

## ADR-004: Non-goals for v1

- No refunds/disputes
- No multi-seller cart (one order = exactly one seller)
- No multi-currency
  Reason: Each of these adds meaningful complexity (partial refunds affect the order state
  machine; multi-seller cart affects checkout and payment splitting) that isn't needed to
  prove the core system design concepts this project targets.

## ADR-005: sellerId stored directly on Order

Decision: Order has a direct sellerId field (not derived through OrderItem → Product).
Reason: Enforces "one order = one seller" (ADR-004) structurally at the schema level,
rather than relying on application code to reject mixed-seller carts. A structural
constraint can't be bypassed by a future bug; an application-level check can.

## ADR-006: User modeled as base table + role-specific extension tables

Decision: A single User table holds shared fields (email, password, name) plus a `role`
enum (BUYER, SELLER, ADMIN). Buyer, Seller, and Admin are separate tables, each with a
1-to-1 relation back to User, holding only role-specific fields (e.g. Seller: store name,
payout info).
Reason: Role-specific fields differ enough (Sellers need payout/store data Buyers never
need) that a single flat table would carry nullable fields for roles that don't use them.
The enum on User answers "which extension table to join"; the extension table answers
"what does this role need" — separate concerns, not redundant.

## ADR-007: Inventory as a single stock field on Product

Decision: Stock is tracked as a single integer field directly on Product, not a separate
Inventory table.
Reason: v1 scope has no product variants and no audit-trail requirement for stock history.
A separate table would add a join with no corresponding benefit at this scope. The
oversell problem (concurrent purchases) is a concern for transaction/query design
(Module 4), not schema shape — splitting the table would not have addressed it.

## ADR-008: Price snapshotted on OrderItem at purchase time

Decision: OrderItem stores its own `price` field, captured at the time of purchase —
not derived by joining to the current Product.price.
Reason: An order is a historical record. If Product.price changes later (increase or
decrease), past orders must remain accurate to what the buyer actually paid. Deriving
price live from Product would silently corrupt historical order data.

## ADR-009: cuid() IDs instead of autoincrement integers

Decision: All models use `id String @id @default(cuid())` instead of
`id Int @id @default(autoincrement())`.
Reason: Sequential integer IDs are predictable/enumerable (e.g. reveals total user count,
allows guessing adjacent records). cuid() generates random, non-sequential string IDs,
closing that information leak — relevant since this is a public-facing marketplace.

## ADR-010: Product includes createdAt for buyer-facing sort

Decision: Product has a createdAt DateTime @default(now()) field.
Reason: Supports buyer browse/search flow — sorting listings "newest first." Independent
of Admin metrics, which depend on Order.createdAt instead, not Product.

## ADR-011: Server Actions for internal mutations

Decision: Operations initiated only by our own frontend (e.g. seller creates listing)
use Server Actions, not Route Handlers.
Reason: No external caller needs a stable HTTP contract for these operations. Route
Handlers are reserved for cases with an external initiator (e.g. payment webhooks,
future mobile client).

## ADR-012: Purchase flow split across Server Action and Route Handler

Decision: "Buyer purchases a product" is two separate operations, not one:

1. Buyer clicks "buy" → Server Action (buyer-initiated) creates a pending Order,
   calls the payment provider's API, redirects buyer to hosted checkout.
2. Payment provider confirms success/failure → Route Handler (webhook), called
   asynchronously by the payment provider as the initiator, not our own frontend.
   Reason: The two steps have different initiators at different times — our own UI for
   step 1, an external system (payment provider) for step 2 — so they require different
   mechanisms per ADR-011's reasoning.

## ADR-013: Database sessions over JWT

Decision: Use database-backed sessions (session row in Postgres, session ID cookie),
not JWT.
Reason: Admin's "suspend a seller/buyer" flow (Module 0) requires suspension to take
effect immediately. JWT validity persists until expiry regardless of DB state — a
suspended user's token would keep working until it expires. DB sessions are checked
against live state on every request, closing that gap.

## ADR-014: Authorization enforced at the data-access layer, not just UI

Decision: Every mutation verifies ownership/permission in the query itself
(e.g. WHERE sellerId = session.user.id AND id = productId), not only by hiding
UI elements.
Reason: UI checks are bypassable — Server Actions can be called directly, and a
hidden button provides no server-side guarantee. The query-level check, run against
the server-verified session (ADR-013), is the only check that can't be bypassed and
is therefore the actual security boundary. UI checks exist only for user experience.

## ADR-015: Credentials provider for v1 authentication

Decision: Auth.js configured with the Credentials provider (email/password) only.
OAuth (Google/GitHub) deferred to a future version.
Reason: Signup must capture role (BUYER/SELLER) per ADR-001/006. Credentials gives
full control of the signup form to collect this; OAuth hands back only email/profile
with no natural point to choose a role without extra onboarding steps.
