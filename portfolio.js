const miniCharts = {};

function initPortfolioChart() {
  const ctx = document.getElementById('portfolioChart');
  if (!ctx) return;
  const c = getColors();
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: stocks.slice(0,6).map(s => s.ticker),
      datasets: [{
        data: [28,18,15,20,10,9],
        backgroundColor: stocks.slice(0,6).map(s => s.color),
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position:'bottom', labels:{ color:c.text2, padding:16, font:{size:12} } }
      },
      cutout: '65%',
    }
  });
}

function populatePortfolioFullTable() {
  const el = document.getElementById('portfolioFullTable');
  if (!el) return;
  el.innerHTML = stocks.map(s => {
    const val = (s.price * Math.floor(Math.random() * 400 + 50)).toFixed(0);
    const pnl = (s.change * 500).toFixed(0);
    return `
      <tr>
        <td><div class="ticker-cell">
          <div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0,2)}</div>
          <div><div style="font-weight:600">${s.ticker}</div><div style="font-size:11px;color:var(--text2)">${s.name}</div></div>
        </div></td>
        <td style="font-weight:600">AOA ${parseInt(val).toLocaleString()}</td>
        <td style="color:${s.change>=0?'var(--green)':'var(--red)'};font-weight:600">${s.change>=0?'+':''}AOA ${pnl}</td>
        <td style="color:${s.change>=0?'var(--green)':'var(--red)'}">
          <span class="badge ${s.change>=0?'badge-green':'badge-red'}">${s.change>=0?'▲':'▼'}${Math.abs(s.change)}%</span>
        </td>
      </tr>`;
  }).join('');
}

function populatePortfolioCards() {
  const el = document.getElementById('portfolioCards');
  if (!el) return;
  el.innerHTML = '';
  stocks.slice(0,6).forEach(s => {
    const isUp = s.change >= 0;
    const cid = `mini-${s.ticker}`;
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.innerHTML = `
      <div class="portfolio-card-header">
        <div class="ticker-logo" style="background:${s.color};width:36px;height:36px;font-size:12px">${s.ticker.slice(0,2)}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${s.ticker}</div>
          <div style="font-size:11px;color:var(--text2)">${s.name}</div>
        </div>
      </div>
      <div class="portfolio-card-price">AOA ${s.price.toFixed(2)}</div>
      <div class="portfolio-card-prev">AOA ${(s.price*0.97).toFixed(2)}</div>
      <span class="badge ${isUp?'badge-green':'badge-red'}" style="margin-bottom:10px">${isUp?'▲':'▼'} ${Math.abs(s.change)}%</span>
      <canvas id="${cid}" class="portfolio-card-canvas"></canvas>
    `;
    el.appendChild(card);
    setTimeout(() => {
      const ctx = document.getElementById(cid);
      if (!ctx) return;
      if (miniCharts[s.ticker]) miniCharts[s.ticker].destroy();
      const data = Array.from({length:20}, () => s.price*(0.95+Math.random()*0.08));
      miniCharts[s.ticker] = new Chart(ctx, {
        type:'line',
        data:{ labels:data.map((_,i)=>i), datasets:[{data, borderColor:isUp?'#2ecc8a':'#e84b6a', backgroundColor:isUp?'rgba(46,204,138,0.1)':'rgba(232,75,106,0.1)', fill:true, tension:0.4, pointRadius:0, borderWidth:2}] },
        options:{ responsive:false, plugins:{legend:{display:false},tooltip:{enabled:false}}, scales:{x:{display:false},y:{display:false}}, animation:{duration:600} }
      });
    }, 50);
  });
}

function exportCSV() {
  const csv = ['Empresa,Ticker,Variação%',
    ...stocks.map(s => `${s.name},${s.ticker},${s.change}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'portfolio_sabula.csv';
  a.click();
}

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioChart();
  populatePortfolioFullTable();
  populatePortfolioCards();
});
