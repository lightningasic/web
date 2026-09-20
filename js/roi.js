// ROI calculator — expected-value SHA-256 mining math (honest estimates)
function num(id) { return parseFloat(document.getElementById(id).value) || 0; }

function calc() {
  const H = num('h');            // TH/s
  const P = num('p');            // W
  const elec = num('elec');      // $/kWh
  const btc = num('btc');        // $
  const net = num('net');        // EH/s
  const rew = num('rew');        // BTC / block
  const bpd = num('bpd');        // blocks / day
  const price = num('price');    // $ hardware

  if (!btc || !net) { alert('Set a BTC price and network hashrate (use "Load live…" or type values).'); return; }

  const share = H / (net * 1e6);                    // H over EH→TH conversion
  const revBtc = share * bpd * rew;
  const revUsd = revBtc * btc;
  const powUsd = (P / 1000) * 24 * elec;
  const netUsd = revUsd - powUsd;

  const fmt = v => '$' + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const fmtBtc = v => v.toLocaleString(undefined, { maximumSignificantDigits: 3 }) + ' BTC';

  el('m_rev', fmt(revUsd) + '<br><span class="lbl" style="font-size:.85rem">' + fmtBtc(revBtc) + '/day</span>');
  el('m_pow', fmt(powUsd));
  const netEl = document.getElementById('m_net');
  netEl.textContent = fmt(netUsd);
  netEl.className = 'val ' + (netUsd >= 0 ? 'pos' : 'neg');
  const roeEl = document.getElementById('m_roe');
  if (price > 0 && netUsd > 0) {
    roeEl.textContent = Math.round(price / netUsd).toLocaleString() + ' d';
  } else if (price === 0) {
    roeEl.textContent = '– (set price)';
  } else {
    roeEl.textContent = 'never @ this setup';
  }
}

function el(id, html) { document.getElementById(id).innerHTML = html; }

async function loadLive() {
  const btn = document.getElementById('live');
  btn.textContent = 'Loading…';
  try {
    const [price, net] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd').then(r => r.json()),
      fetch('https://mempool.space/api/v1/mining/hashrate/1d').then(r => r.text())
    ]);
    if (price.status === 'fulfilled' && price.value.bitcoin) {
      document.getElementById('btc').value = Math.round(price.value.bitcoin.usd);
    }
    if (net.status === 'fulfilled') {
      // mempool returns "### EH/s" as text
      const m = net.value.match(/([\d.]+)\s*EH\/s/);
      if (m) document.getElementById('net').value = parseFloat(m[1]);
    }
    btn.textContent = 'Load live BTC price & network hashrate';
    calc();
  } catch (e) {
    btn.textContent = 'Live load failed — enter values manually';
  }
}

document.addEventListener('DOMContentLoaded', calc);