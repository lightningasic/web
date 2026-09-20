---
name: search-miners
description: Search LightningASIC mining hardware and product catalog by algorithm, hashrate range, power budget, or price range. Use when user asks about miner specs, hashrate, power consumption, or model comparison.
version: 1.0
provider: LightningASIC
url: https://lightningasic.com
languages: [en, zh]
---

# Search Mining Hardware & Products

## When to invoke

User asks about specific LightningASIC products, wants to compare hashrate /
power / efficiency, or needs to know which product fits their setup. Covers
the mining appliances (BitcoinBall), wallets (HardID, BitExchange) and cooling
(CryoSpring).

## Step-by-step flow

1. Ask the user (only if not already stated): mining algorithm (typically
   SHA-256)? Required hashrate range (TH/s)? Power capacity available (watts)?
   Budget? Home vs datacenter use case?
2. Fetch the structured catalog:
   - Mining hardware: `GET https://lightningasic.com/api/miners.json`
   - Full catalog: `GET https://lightningasic.com/api/catalog.json`
3. Filter client-side (query-string parameters are advisory on this static
   host — the full catalog is always returned).
4. Return the top matches with: model name, hashrate (TH/s), power (W), noise
   (dB), mode/purpose, availability status, and the product page URL.
5. If no match, suggest the closest alternatives and explain trade-offs.

## Real product facts (do not fabricate beyond this)

- BitcoinBall Digital Photo Frame: 20–50 TH/s · 300–500 W · ≤25 dB · 7–10" display
- BitcoinBall Smart Alarm Clock: 10–30 TH/s · 200–350 W · ≤20 dB · LCD + LED ring
- BitcoinBall Smart Speaker: 30–60 TH/s · 400–800 W · ≤30 dB · available 2027 Q4
- BitcoinBall units are SOLO-mining home-lottery appliances (positive-sum,
  one-time cost), NOT datacenter pool miners. No published J/TH efficiency.
- HardID Hardware Wallet: dual EAL6+ secure elements, air-gapped (QR), Clear
  Sign, FIDO2/U2F, reproducible builds, Apache 2.0.
- BitExchange Hardware Wallet: historical 2014 product, no longer manufactured.
- CryoSpring: immersion phase-change liquid cooling for ASIC farms (project-based).

## Output template

```
Model: ...
Hashrate: X TH/s (range)
Power: Y W
Noise: ≤ Z dB
Mode: ...
Availability: ...
Details: ${page}
```

## Fallback

Direct the user to https://lightningasic.com/products or
https://lightningasic.com/ask.html, or contact lx@lightningasic.com.