let allTransactions = [];
let currentFilter = 'all';

function buildTransactions() {
  const types = ['Compra', 'Venda'];
  const states = ['Concluída', 'Pendente', 'Cancelada'];
  allTransactions = Array.from({ length: 20 }, (_, i) => {
    const s = stocks[i % stocks.length];
    const qty = Math.floor(Math.random() * 500 + 10);
    return {
      date: `${13 - (i % 13)} Mai 2026`,
      stock: s,
      type: types[i % 2],
      qty,
      price: s.price,
      total: qty * s.price,
      state: states[i % 3],
    };
  });
}

function renderTable(filter) {
  const el = document.getElementById('transactionsTable');
  if (!el) return;
  const rows = filter === 'all' ? allTransactions : allTransactions.filter(t => t.type === filter);
  el.innerHTML = rows.map(t => `
    <tr>
      <td style="color:var(--text2);font-size:12px">${t.date}</td>
      <td>
        <div class="ticker-cell">
          <div class="ticker-logo" style="background:${t.stock.color}">${t.stock.ticker.slice(0,2)}</div>
          <div>
            <div style="font-weight:600">${t.stock.ticker}</div>
            <div style="font-size:11px;color:var(--text2)">${t.stock.name}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${t.type === 'Compra' ? 'badge-green' : 'badge-red'}">${t.type}</span></td>
      <td>${t.qty}</td>
      <td>AOA ${t.price.toFixed(2)}</td>
      <td style="font-weight:600">AOA ${t.total.toLocaleString('pt-AO', {maximumFractionDigits:0})}</td>
      <td><span class="badge ${t.state === 'Concluída' ? 'badge-green' : t.state === 'Pendente' ? 'badge-yellow' : 'badge-red'}">${t.state}</span></td>
    </tr>
  `).join('');
}

function filterTx(btn, type) {
  document.querySelectorAll('.time-btns .time-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = type;
  renderTable(type);
}

function exportCSV() {
  const rows = currentFilter === 'all' ? allTransactions : allTransactions.filter(t => t.type === currentFilter);
  const csv = ['Data,Empresa,Tipo,Quantidade,Preço,Total,Estado',
    ...rows.map(t => `${t.date},${t.stock.ticker},${t.type},${t.qty},${t.price.toFixed(2)},${t.total.toFixed(2)},${t.state}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'transacoes_sabula.csv';
  a.click();
}

document.addEventListener('DOMContentLoaded', () => {
  buildTransactions();
  renderTable('all');
});
