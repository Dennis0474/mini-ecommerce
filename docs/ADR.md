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
