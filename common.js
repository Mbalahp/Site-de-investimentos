/* ── Tema ── */
function initializeTheme() {
  const stored = localStorage.getItem('sabula-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = stored === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sabula-theme', next);
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '🌙' : '☀️';
  if (typeof initPageCharts === 'function') setTimeout(initPageCharts, 100);
}

/* ── Sidebar ── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

/* ── Nav activo ── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  const target = page === 'index' ? 'index' : page;
  document.querySelectorAll('.nav-item, .bnav-item').forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href') || '';
    if (href.includes(target + '.html') || (target === 'index' && (href.includes('index.html') || href === '/'))) {
      item.classList.add('active');
    }
  });
}

/* ── Cores CSS vars ── */
function getColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue('--accent').trim(),
    green:  s.getPropertyValue('--green').trim(),
    red:    s.getPropertyValue('--red').trim(),
    blue:   s.getPropertyValue('--blue').trim(),
    text2:  s.getPropertyValue('--text2').trim(),
    border: s.getPropertyValue('--border').trim(),
    bg3:    s.getPropertyValue('--bg3').trim(),
  };
}

function setPageContext() {
  const page = (window.location.pathname.split('/').pop() || 'index').replace('.html', '') || 'home';
  document.body.dataset.page = page === 'index' ? 'home' : page;
}

document.addEventListener('DOMContentLoaded', () => {
  setPageContext();
  initializeTheme();
  setActiveNav();
});
