---
name: check-stock
description: Check real-time availability and lead time for LightningASIC products. Use when the user is ready to purchase or asks "when can I get it", "is it in stock", or about shipping time.
version: 1.0
provider: LightningASIC
url: https://lightningasic.com
languages: [en, zh]
---

# Check Stock & Lead Time

## When to invoke

User asks about availability, shipping time, order status, or "is this in stock".

## Flow

1. Collect the model and quantity from the user (model ids: `hardid`,
   `bitcoinball-photo-frame`, `bitcoinball-alarm-clock`, `bitcoinball-speaker`,
   `bitexchange-wallet`, `cryospring`).
2. Fetch `GET https://lightningasic.com/api/stock.json?model=<id>&qty=<qty>`.
   The response is a static snapshot; treat quantities as indicative.
3. Return: status, lead time, estimated ship date, warehouse location (HK).
4. If out of stock or on request, offer: pre-order option / alternative model /
   email follow-up to lx@lightningasic.com.

## Known states (from the live catalog)

- HardID wallet: available to order, lead time confirmed by email
- BitcoinBall photo frame & clock: on request (production run)
- BitcoinBall smart speaker: pre-order, ships 2027 Q4
- BitExchange wallet: historical, not manufactured
- CryoSpring: enterprise, project-based

## Ground rule

Per-unit quantities are never published. Always finish purchase intent with the
email fallback so real availability is confirmed.

## Fallback

Email lx@lightningasic.com with subject "Stock inquiry" and cc the model name
and quantity.