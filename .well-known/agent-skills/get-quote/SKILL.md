---
name: get-quote
description: Request a bulk pricing quote for mining hardware orders. Use when the user mentions quantity greater than 10, "wholesale", "bulk order", "dealer pricing", or asks about shipping cost for large orders.
version: 1.0
provider: LightningASIC
url: https://lightningasic.com
languages: [en, zh]
---

# Request Bulk Quote

## When to invoke

User wants to purchase 10+ units, or asks for dealer/wholesale pricing, or
wants shipping/logistics estimates for a large order.

## Flow

1. Collect from the user: model (or models), quantity, shipping destination,
   preferred contact method (email preferred), company name (optional).
2. Read the quote contract at `https://lightningasic.com/api/quotes.json` for
   the canonical request schema (model_id, quantity, shipping_destination,
   contact, company, notes).
3. Current submission path: compose an email to `lx@lightningasic.com` with
   subject `Bulk Quote Request` containing the collected fields. (The static
   host does not accept POST yet; a POST /api/quotes endpoint arrives with the
   Cloudflare deployment — see ai-native/DEPLOY.md.)
4. Tell the user: "Quote will be emailed within 4 business hours."
5. Set expectation: bulk orders may have 2–4 week lead time.

## Ground rule

Never invent prices or discounts. Only hand off the request; LightningASIC
responds with pricing.

## Fallback

Email lx@lightningasic.com with subject "Bulk Quote Request" — same payload as
above.