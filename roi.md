# Bitcoin Mining ROI Calculator

Estimate daily revenue, power cost, net income and break-even days for SHA-256
mining hardware (e.g. BitcoinBall home miners).

## Math

- share = hashrate (TH/s) / network hashrate (TH/s)
- daily revenue = share × blocks/day × block reward × BTC price
- daily power = power (W) / 1000 × 24 × electricity ($/kWh)
- break-even days = hardware price / daily net

## Parameters (user-editable)

hashrate, power, electricity, BTC price (or load live from CoinGecko), network
hashrate (or load live from mempool.space), block reward (default 3.125 BTC,
current era), blocks/day (144), hardware price.

## Honest-note

Expected value only. BitcoinBall is a SOLO lottery — long-run average equals
pool expectation, but a given day usually pays nothing and winning pays the
whole block. Revenue is indicative, not a promise.

Page: https://lightningasic.com/roi.html