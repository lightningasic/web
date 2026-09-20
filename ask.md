# Ask LightningASIC

Natural-language search over the LIGHTNINGASIC product catalog. Type a
plain-language question (e.g. "silent SHA-256 miner under 400 W for home
mining", "open-source air-gapped wallet", "cooling for an ASIC farm") and the
page matches it against `/api/catalog.json` and `/api/stock.json`.

- Data: https://lightningasic.com/api/catalog.json · https://lightningasic.com/api/stock.json
- Agents: use the `search-miners`, `check-stock`, `get-quote`, and
  `book-tech-support` skills in /.well-known/agent-skills/. This page is the
  human mirror of those skills.
- Fallback: email lx@lightningasic.com — replies within 4 business hours.

Page: https://lightningasic.com/ask.html