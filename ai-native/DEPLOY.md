# AI-native deployment evolution — from static to full action layer

Current deployment: **GitHub Pages (static)**. This repository already ships the
complete discovery layer (robots/llms/llms-full/agents + .well-known/agent-skills)
and a static action layer (JSON catalog + ROI + WebMCP + /ask frontend).

Three gaps remain that require server-side compute:

1. **`POST /api/quotes`** — static hosts answer 405. Agents currently hand off to
   email (works, tracked in get-quote SKILL).
2. **`/ask` NL endpoint (NLWeb)** — a real natural-language endpoint that replies
   in JSON. Current /ask.html is a retrieval page, not an API.
3. **`/mcp` MCP Server** — Streamable-HTTP (JSON-RPC 2.0 over POST): `initialize`,
   `tools/list`, `tools/call`, `ping`.

## Recommended path: Cloudflare Pages (built-in Functions)

Zero extra infrastructure: keep the same repo, add `functions/` — Cloudflare
Pages auto-serves `/api/*` and `/ask` from it, no server to run.

### functions/api/quotes.js (POST support for the existing contract)

```js
export async function onRequestPost({ request, env }) {
  const schema = {
    model_id: 'string', quantity: 'number', shipping_destination: 'string',
    contact: 'string', company: 'string?', notes: 'string?'
  };
  try {
    const body = await request.json();
    // validate required fields → 400 with field list on failure
    // forward to sales mailbox via env.SALES_EMAIL (email binding or worker)
    return Response.json({
      quote_reference: `Q-${Date.now().toString(36).toUpperCase()}`,
      expected_reply: 'Within 4 business hours',
      bulk_lead_time: '2-4 week typical lead time'
    }, { status: 201 });
  } catch (e) {
    return Response.json({ error: 'invalid request body' }, { status: 400 });
  }
}
// GET returns the schema doc (like current /api/quotes.json)
```

### functions/api/miners.js + stock.js

Same data as the static JSON, but honour query params server-side
(`?algorithm=SHA-256&min_hashrate=20`) so agents don't filter client-side.

### functions/ask.js — NLWeb endpoint

```js
export async function onRequestPost({ request }) {
  const { query } = await request.json();
  // score catalog fields with the same keyword logic as js/ask.js,
  // return top matches + a crypto/ROI block when mining intent detected
  return Response.json({ intent, matches, quote_hint });
}
```

### functions/mcp.js — MCP Server (minimal)

Streamable-HTTP session per POST: implement `initialize` (protocol vesion,
tools list), `tools/list` (list_miners, check_availability, calculate_roi,
submit_inquiry — schema in the plan /index.json), `tools/call`, `ping`.
Response with `application/json` and `Mcp-Session-Id` header.

### WebMCP stays as-is

`js/main.js` registration is browser-side and already in place; Cloudflare does
not change it. Keep the `agent-skills` registry source of truth.

## Verification checklist after migration

1. `curl -X POST https://lightningasic.com/api/quotes -d '{"model_id":"hardid","quantity":50,...}'` → 201 + reference
2. `curl 'https://lightningasic.com/api/miners?algorithm=SHA-256&min_hashrate=20'` → filtered list
3. MCP handshake: `initialize` → `tools/list` route works (`npx @modelcontextprotocol/inspector` or curl POST)
4. DualNova validator: `npx @dualnova/agent-skills validate-site --url https://lightningasic.com`
5. Google "Agentic browsing" Lighthouse M150+ audit passes WebMCP registration checks

## Map to the plan's three phases

| Phase | Status | Note |
| ----- | ------ | ---- |
| 1. Discovery layer | ✅ done | robots/llms/llms-full/agents + skills dir |
| 2. Capability layer | ✅ done | 4 SKILL.md + index.json + JSON endpoints |
| 3. Action layer | 🟡 static half | /ask page + ROI + WebMCP live; real /ask, /mcp, POST quotes need this migration |