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
