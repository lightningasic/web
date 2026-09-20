// Ask LightningASIC — natural-language search over the static catalog
let CATALOG = null;
let STOCK = null;

async function loadData() {
  if (!CATALOG) {
    const [c, s] = await Promise.all([
      fetch('api/catalog.json').then(r => r.json()),
      fetch('api/stock.json').then(r => r.json())
    ]);
    CATALOG = c.products;
    STOCK = s.items;
  }
  return { catalog: CATALOG, stock: STOCK };
}

const KEYWORDS = {
  wallet: /wallet/i,
  hardid: /hardid/i,
  key: /security key|passkey|fido/i,
  silent: /silent|quiet|noise|dB|db/i,
  low_power: /low power|under \d+ ?w|efficient/i,
  home: /home|house|家庭/i,
  appliance: /appliance|photo frame|clock|speaker|闹钟|相框|音箱/i,
  high_hash: /hash|TH\/s|算力|miner|mine|mining|挖矿/i,
  cool: /cool|冷|液冷|immersion|浸没|heat/i,
  bulk: /bulk|wholesale|10\+|dealer|批量/i,
  stock: /stock|available|交期|有货|库存/i,
  budget: /\$\d+|price|budget|价格|预算|成本/i
};

function matchScore(p, q) {
  let score = 0;
  const text = (p.name + ' ' + p.summary + ' ' + JSON.stringify(p.specs || {})).toLowerCase();
  const t = (p.category + ' ' + p.name).toLowerCase();

  if (q.includes('wallet') || q.includes('hardid') || q.includes('冷钱包') || q.includes('钱包'))
    if (/wallet/.test(t)) score += 40;
  if (q.includes('cool') || q.includes('液冷') || q.includes('冷却') || q.includes('farm'))
    if (p.category === 'mining-cooling') score += 40;
  if (/frame|photo/.test(q) && /frame/.test(p.id)) score += 25;
  if (/clock|闹钟/.test(q) && /clock/.test(p.id)) score += 25;
  if (/speaker|音箱|voice/.test(q) && /speaker/.test(p.id)) score += 25;

  // numeric range matching on hashrate/power
  const mTh = q.match(/(\d+)\s*(?:th|th\/s|terahash)/i);
  if (mTh && p.specs && p.specs.hashrate_ths) {
    const req = +mTh[1];
    if (p.specs.hashrate_ths.min <= req && req <= p.specs.hashrate_ths.max) score += 20;
  }
  const mW = q.match(/(\d+)\s*w\b/i);
  if (mW && p.specs && p.specs.power_w) {
    const req = +mW[1];
    if (req >= p.specs.power_w.min) score += 12;
  }
  if (/silent|noise|dB/.test(q) && p.specs && p.specs.noise_db) score += 10;
  return score;
}

async function ask() {
  const q = document.getElementById('q').value.trim();
  const out = document.getElementById('results');
  if (!q) return;
  const { catalog, stock } = await loadData();
  const ql = q.toLowerCase();

  // direct model-name hit
  let scored = catalog.map(p => ({ p, s: matchScore(p, ql) }));
  scored.sort((a, b) => b.s - a.s);
  const top = scored.filter(x => x.s > 10);

  const stockMap = {};
  stock.forEach(i => stockMap[i.model_id] = i);

  let html = '';
  if (top.length) {
    top.slice(0, 4).forEach(({ p, s }) => {
      const st = stockMap[p.id] || {};
      html += `<div class="result-card">
        <h3>${p.name} <span class="tag">${p.category.replace(/-/g, ' ')}</span></h3>
        <p>${p.summary}</p>
        <table>
          ${p.specs ? Object.entries(p.specs).slice(0, 6).map(([k, v]) =>
            `<tr><td>${k.replace(/_/g, ' ')}</td><td>${typeof v === 'object' ? JSON.stringify(v) : v}</td></tr>`).join('')
            : ''}
          <tr><td>availability</td><td>${st.status || 'contact sales'}${st.lead_time ? ' — ' + st.lead_time : ''} · <a href="api/stock.json">√</a></td></tr>
          <tr><td>details</td><td><a href="${p.page}">${p.page.replace('https://lightningasic.com/', '')}</a></td></tr>
        </table>
      </div>`;
    });
  } else {
    html = `<div class="empty">No direct match in the catalog.<br>
      Try one of the examples above, or email <b>lx@lightningasic.com</b> with your requirements and you will get a reply within 4 business hours.</div>`;
  }
  out.innerHTML = html;
}

function setQ(t) { document.getElementById('q').value = t; }

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('q').addEventListener('keydown', e => { if (e.key === 'Enter') ask(); });
});