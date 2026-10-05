const stocks = [
  { ticker: 'BAIA', name: 'Banco BAI', price: 245.8, change: 2.5, volume: '1.2M', cap: '42B', color: '#4b8ef0', fraud: 94 },
  { ticker: 'BFA', name: 'Banco BFA', price: 189.4, change: -1.2, volume: '890K', cap: '28B', color: '#2ecc8a', fraud: 12 },
  { ticker: 'ENSA', name: 'ENSA Seguros', price: 312.6, change: 5.8, volume: '2.1M', cap: '15B', color: '#e84b6a', fraud: 67 },
  { ticker: 'SONO', name: 'Sonangol', price: 520.0, change: -0.8, volume: '5.4M', cap: '120B', color: '#e8b84b', fraud: 58 },
  { ticker: 'AANG', name: 'AAng Telecom', price: 98.2, change: 3.1, volume: '450K', cap: '8B', color: '#9b59b6', fraud: 8 },
  { ticker: 'BCGA', name: 'Banco Caixa', price: 156.7, change: 0.4, volume: '320K', cap: '22B', color: '#e67e22', fraud: 15 },
  { ticker: 'TAAG', name: 'TAAG Airlines', price: 45.3, change: -3.2, volume: '1.8M', cap: '6B', color: '#1abc9c', fraud: 22 },
  { ticker: 'UNITEL', name: 'Unitel', price: 280.9, change: 1.9, volume: '900K', cap: '35B', color: '#e74c3c', fraud: 18 },
];

function setActiveNav() {
  const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const target = page === 'index' ? 'home' : page;
  document.querySelectorAll('.nav-item, .bnav-item').forEach((item) => {
    item.classList.remove('active');
    const href = item.getAttribute('href') || '';
    if (href.includes(`${target}.html`) || (target === 'home' && href.includes('index.html')) || (target === 'home' && href === '/')) {
      item.classList.add('active');
    }
  });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function initializeTheme() {
  const html = document.documentElement;
  const stored = window.localStorage.getItem('sabula-theme');
  const theme = stored || 'dark';
  html.setAttribute('data-theme', theme);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  window.localStorage.setItem('sabula-theme', next);
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.textContent = next === 'dark' ? '🌙' : '☀️';
  }
  setTimeout(() => initPageCharts(), 100);
}

function randData(base, points, volatility) {
  const data = [];
  let value = base;
  for (let i = 0; i < points; i += 1) {
    value += (Math.random() - 0.48) * volatility;
    data.push(Math.max(0, value));
  }
  return data;
}

function getColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue('--accent').trim(),
    green: s.getPropertyValue('--green').trim(),
    red: s.getPropertyValue('--red').trim(),
    blue: s.getPropertyValue('--blue').trim(),
    text2: s.getPropertyValue('--text2').trim(),
    border: s.getPropertyValue('--border').trim(),
    bg3: s.getPropertyValue('--bg3').trim(),
  };
}

const charts = {};
const miniChartInstances = {};

function initPageCharts() {
  initCandleChart();
  initFraudChart();
  initPortfolioChart();
}

function initCandleChart() {
  const ctx = document.getElementById('candleChart');
  if (!ctx) return;
  const c = getColors();
  if (charts.candle) charts.candle.destroy();
  const data = generateCandles(15000, 28, 180);
  charts.candle = new Chart(ctx, {
    type: 'candlestick',
    data: {
      datasets: [{
        label: 'BODIVA Index',
        data,
        color: { up: '#2ecc8a', down: '#e84b6a', unchanged: '#8b93b0' },
        borderColor: { up: '#2ecc8a', down: '#e84b6a', unchanged: '#8b93b0' },
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              return [`O: ${d.o}`, `H: ${d.h}`, `L: ${d.l}`, `C: ${d.c}`];
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'day', displayFormats: { day: 'EEE' } },
          grid: { color: c.border },
          ticks: { color: c.text2, font: { size: 11 }, maxTicksLimit: 7 },
        },
        y: {
          position: 'right',
          grid: { color: c.border },
          ticks: { color: c.text2, font: { size: 11 } },
        },
      },
    },
  });
}

function generateCandles(base, count, vol) {
  const data = [];
  let price = base;
  const now = Date.now();
  for (let i = count; i >= 0; i -= 1) {
    const open = price;
    const change = (Math.random() - 0.48) * vol;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * vol * 0.4;
    const low = Math.min(open, close) - Math.random() * vol * 0.4;
    data.push({ x: now - i * 24 * 3600 * 1000, o: +open.toFixed(2), h: +high.toFixed(2), l: +low.toFixed(2), c: +close.toFixed(2) });
    price = close;
  }
  return data;
}

function populateMarketList() {
  const el = document.getElementById('marketList');
  if (!el) return;
  el.innerHTML = stocks.slice(0, 6).map((s) => `
    <div class="market-row">
      <div style="display:flex;align-items:center;gap:8px">
        <div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0, 2)}</div>
        <div>
          <div style="font-weight:600;font-size:13px">${s.ticker}</div>
          <div style="font-size:11px;color:var(--text2)">${s.name}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:600;font-size:13px">AOA ${s.price.toFixed(2)}</div>
        <div style="font-size:12px;color:${s.change >= 0 ? 'var(--green)' : 'var(--red)'}">${s.change >= 0 ? '▲' : '▼'} ${Math.abs(s.change)}%</div>
      </div>
    </div>
  `).join('');
}

function populatePortfolioCards() {
  const el = document.getElementById('portfolioCards');
  if (!el) return;
  el.innerHTML = '';
  stocks.slice(0, 6).forEach((s) => {
    const isUp = s.change >= 0;
    const canvasId = `mini-${s.ticker}`;
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.innerHTML = `
      <div class="portfolio-card-header">
        <div class="ticker-logo" style="background:${s.color};width:36px;height:36px;font-size:12px">${s.ticker.slice(0, 2)}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${s.ticker}</div>
          <div style="font-size:11px;color:var(--text2)">${s.name}</div>
        </div>
      </div>
      <div class="portfolio-card-price">AOA ${s.price.toFixed(2)}</div>
      <div class="portfolio-card-prev" style="color:var(--text3)">AOA ${(s.price * 0.97).toFixed(2)}</div>
      <span class="badge ${isUp ? 'badge-green' : 'badge-red'}" style="margin-bottom:10px">${isUp ? '▲' : '▼'} ${Math.abs(s.change)}%</span>
      <canvas id="${canvasId}" class="portfolio-card-canvas"></canvas>
    `;
    el.appendChild(card);
    setTimeout(() => {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;
      if (miniChartInstances[s.ticker]) miniChartInstances[s.ticker].destroy();
      const lineData = Array.from({ length: 20 }, () => s.price * (0.95 + Math.random() * 0.08));
      miniChartInstances[s.ticker] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: lineData.map((_, i) => i),
          datasets: [{
            data: lineData,
            borderColor: isUp ? '#2ecc8a' : '#e84b6a',
            backgroundColor: isUp ? 'rgba(46,204,138,0.1)' : 'rgba(232,75,106,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
          animation: { duration: 600 },
        },
      });
    }, 50);
  });
}

function populateWatchlist() {
  const el = document.getElementById('watchlistTable');
  if (!el) return;
  el.innerHTML = stocks.map((s) => {
    const isUp = s.change >= 0;
    const cid = `wl-${s.ticker}`;
    return `
      <tr>
        <td><div class="ticker-cell">
          <div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0, 2)}</div>
          <div style="font-weight:600">${s.ticker}</div>
        </div></td>
        <td style="font-weight:600">AOA ${s.price.toFixed(2)}</td>
        <td style="color:${isUp ? 'var(--green)' : 'var(--red)'};font-weight:600">${isUp ? '▲' : '▼'} ${Math.abs(s.change)}%</td>
        <td style="width:80px"><canvas id="${cid}" width="80" height="36"></canvas></td>
      </tr>`;
  }).join('');
  stocks.forEach((s) => {
    const ctx = document.getElementById(`wl-${s.ticker}`);
    if (!ctx) return;
    const isUp = s.change >= 0;
    const data = Array.from({ length: 12 }, () => s.price * (0.95 + Math.random() * 0.1));
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: isUp ? '#2ecc8a' : '#e84b6a',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        }],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: false,
      },
    });
  });
}

function populateTransactions() {
  const el = document.getElementById('transactionsTable');
  if (!el) return;
  const types = ['Compra', 'Venda'];
  const states = ['Concluída', 'Pendente', 'Cancelada'];
  el.innerHTML = Array.from({ length: 12 }, (_, i) => {
    const s = stocks[i % stocks.length];
    const type = types[i % 2];
    const state = states[i % 3];
    const qty = Math.floor(Math.random() * 500 + 10);
    return `
      <tr>
        <td style="color:var(--text2);font-size:12px">${13 - i} Mai 2026</td>
        <td><div class="ticker-cell"><div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0, 2)}</div><div><div style="font-weight:600">${s.ticker}</div><div style="font-size:11px;color:var(--text2)">${s.name}</div></div></div></td>
        <td><span class="badge ${type === 'Compra' ? 'badge-green' : 'badge-red'}">${type}</span></td>
        <td>${qty}</td>
        <td>AOA ${s.price.toFixed(2)}</td>
        <td style="font-weight:600">AOA ${(qty * s.price).toLocaleString('pt-AO', { maximumFractionDigits: 0 })}</td>
        <td><span class="badge ${state === 'Concluída' ? 'badge-green' : state === 'Pendente' ? 'badge-yellow' : 'badge-red'}">${state}</span></td>
      </tr>`;
  }).join('');
}

function populateMarketsTable() {
  const el = document.getElementById('marketsTable');
  if (!el) return;
  el.innerHTML = stocks.map((s) => `
    <tr>
      <td><div class="ticker-cell"><div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0, 2)}</div><div style="font-weight:700">${s.ticker}.AO</div></div></td>
      <td>${s.name}</td>
      <td style="font-weight:600">AOA ${s.price.toFixed(2)}</td>
      <td style="color:${s.change >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:600">${s.change >= 0 ? '▲' : '▼'} ${Math.abs(s.change)}%</td>
      <td style="color:var(--text2)">${s.volume}</td>
      <td style="color:var(--text2)">AOA ${s.cap}</td>
      <td><span class="badge ${s.fraud > 70 ? 'badge-red' : s.fraud > 40 ? 'badge-yellow' : 'badge-green'}">${s.fraud > 70 ? '🚨 ' : s.fraud > 40 ? '⚠ ' : '✅ '}${s.fraud}%</span></td>
    </tr>`).join('');
}

function populateWalletTable() {
  const el = document.getElementById('walletTable');
  if (!el) return;
  const moves = [
    { date: '13 Mai 2026', type: 'Depósito', value: 'AOA 500.000', state: 'Concluída' },
    { date: '10 Mai 2026', type: 'Levantamento', value: 'AOA 120.000', state: 'Concluída' },
    { date: '08 Mai 2026', type: 'Depósito', value: 'AOA 200.000', state: 'Concluída' },
    { date: '05 Mai 2026', type: 'Dividendo', value: 'AOA 28.400', state: 'Concluída' },
    { date: '01 Mai 2026', type: 'Depósito', value: 'AOA 300.000', state: 'Pendente' },
  ];
  el.innerHTML = moves.map((m) => `
    <tr>
      <td style="color:var(--text2);font-size:12px">${m.date}</td>
      <td><span class="badge ${m.type === 'Depósito' || m.type === 'Dividendo' ? 'badge-green' : 'badge-red'}">${m.type}</span></td>
      <td style="font-weight:600">${m.value}</td>
      <td><span class="badge ${m.state === 'Concluída' ? 'badge-green' : 'badge-yellow'}">${m.state}</span></td>
    </tr>`).join('');
}

function populatePortfolioFullTable() {
  const el = document.getElementById('portfolioFullTable');
  if (!el) return;
  el.innerHTML = stocks.map((s) => {
    const val = (s.price * Math.floor(Math.random() * 400 + 50)).toFixed(0);
    const pnl = (s.change * 500).toFixed(0);
    return `
      <tr>
        <td><div class="ticker-cell"><div class="ticker-logo" style="background:${s.color}">${s.ticker.slice(0, 2)}</div><div><div style="font-weight:600">${s.ticker}</div><div style="font-size:11px;color:var(--text2)">${s.name}</div></div></div></td>
        <td style="font-weight:600">AOA ${parseInt(val, 10).toLocaleString()}</td>
        <td style="color:${s.change >= 0 ? 'var(--green)' : 'var(--red)'};font-weight:600">${s.change >= 0 ? '+' : ''}AOA ${pnl}</td>
        <td style="color:${s.change >= 0 ? 'var(--green)' : 'var(--red)'}">${s.change >= 0 ? '▲' : '▼'}${Math.abs(s.change)}%</td>
      </tr>`;
  }).join('');
}

function initFraudChart() {
  const ctx = document.getElementById('fraudChart');
  if (!ctx) return;
  const c = getColors();
  if (charts.fraud) charts.fraud.destroy();
  charts.fraud = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stocks.map((s) => s.ticker),
      datasets: [{
        label: 'Score de Risco (%)',
        data: stocks.map((s) => s.fraud),
        backgroundColor: stocks.map((s) => (s.fraud > 70 ? 'rgba(232,75,106,0.7)' : s.fraud > 40 ? 'rgba(232,184,75,0.7)' : 'rgba(46,204,138,0.7)')),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text2 } },
        y: { grid: { color: c.border }, ticks: { color: c.text2, callback: (v) => `${v}%` }, max: 100 },
      },
    },
  });
}

function initPortfolioChart() {
  const ctx = document.getElementById('portfolioChart');
  if (!ctx) return;
  const c = getColors();
  if (charts.portfolio) charts.portfolio.destroy();
  charts.portfolio = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: stocks.slice(0, 6).map((s) => s.ticker),
      datasets: [{
        data: [28, 18, 15, 20, 10, 9],
        backgroundColor: stocks.slice(0, 6).map((s) => s.color),
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: c.text2, padding: 16, font: { size: 12 } } },
      },
      cutout: '65%',
    },
  });
}

function initHomeCharts() {
  initCandleChart();
}

function initializePageData() {
  const page = document.body.dataset.page || 'home';

  if (page === 'home') {
    populateMarketList();
    populatePortfolioCards();
    populateWatchlist();
    populateTransactions();
  }

  if (page === 'markets') {
    populateMarketsTable();
  }

  if (page === 'wallet') {
    populateWalletTable();
  }

  if (page === 'portfolio') {
    populatePortfolioFullTable();
    populatePortfolioCards();
  }

  if (page === 'transactions') {
    populateTransactions();
  }

  if (page === 'fraud') {
    initFraudChart();
  }

  if (page === 'home' || page === 'fraud' || page === 'portfolio') {
    setTimeout(() => initPageCharts(), 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.dataset.page) {
    document.body.dataset.page = 'home';
  }
  initializeTheme();
  setActiveNav();
  initializePageData();
});
