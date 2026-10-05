const moves = [
  { date:'13 Mai 2026', type:'Depósito',     desc:'Transferência BAI',       value:'AOA 500.000', state:'Concluída' },
  { date:'10 Mai 2026', type:'Levantamento', desc:'Transferência para conta', value:'AOA 120.000', state:'Concluída' },
  { date:'08 Mai 2026', type:'Depósito',     desc:'Transferência BFA',        value:'AOA 200.000', state:'Concluída' },
  { date:'05 Mai 2026', type:'Dividendo',    desc:'BAIA.AO — Q1 2026',        value:'AOA 28.400',  state:'Concluída' },
  { date:'01 Mai 2026', type:'Depósito',     desc:'Transferência BAI',        value:'AOA 300.000', state:'Pendente'  },
  { date:'28 Abr 2026', type:'Levantamento', desc:'Transferência para conta', value:'AOA 80.000',  state:'Concluída' },
  { date:'20 Abr 2026', type:'Dividendo',    desc:'SONO.AO — Q1 2026',        value:'AOA 14.200',  state:'Concluída' },
];

let currentFilter = 'all';

function renderWallet(filter) {
  const el = document.getElementById('walletTable');
  if (!el) return;
  const rows = filter === 'all' ? moves : moves.filter(m => m.type === filter);
  el.innerHTML = rows.map(m => `
    <tr>
      <td style="color:var(--text2);font-size:12px">${m.date}</td>
      <td><span class="badge ${m.type==='Depósito'||m.type==='Dividendo'?'badge-green':'badge-red'}">${m.type}</span></td>
      <td style="color:var(--text2)">${m.desc}</td>
      <td style="font-weight:600">${m.value}</td>
      <td><span class="badge ${m.state==='Concluída'?'badge-green':'badge-yellow'}">${m.state}</span></td>
    </tr>
  `).join('');
}

function filterMov(btn, type) {
  document.querySelectorAll('.time-btns .time-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = type;
  renderWallet(type);
}

function exportCSV() {
  const rows = currentFilter === 'all' ? moves : moves.filter(m => m.type === currentFilter);
  const csv = ['Data,Tipo,Descrição,Valor,Estado',
    ...rows.map(m => `${m.date},${m.type},${m.desc},${m.value},${m.state}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'carteira_sabula.csv';
  a.click();
}

let modalType = '';

function openModal(type) {
  modalType = type;
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  modal.style.display = 'flex';
  title.innerHTML = type === 'depositar'
    ? '<i class="fa-solid fa-plus"></i> Depositar'
    : '<i class="fa-solid fa-minus"></i> Levantar';
  document.getElementById('modalInput').value = '';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function confirmModal() {
  const val = document.getElementById('modalInput').value;
  if (!val || val <= 0) return;
  closeModal();
  alert(`${modalType === 'depositar' ? 'Depósito' : 'Levantamento'} de AOA ${parseInt(val).toLocaleString()} submetido com sucesso.`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderWallet('all');
});
