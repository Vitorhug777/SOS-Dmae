const AREA_POR_USUARIO = {
  'gsodmae@gmail.com': 'Obras',
  'luiztorido@outlook.com': 'Patrimônio'
};

function obterEmailUsuario() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave && chave.startsWith('sb-') && chave.endsWith('-auth-token')) {
        const armazenado = JSON.parse(localStorage.getItem(chave));
        const email = (armazenado?.session?.user || armazenado?.user)?.email;
        if (email) return email;
      }
    }
  } catch {}
  return '';
}

function areaDoUsuarioLogado() {
  const email = obterEmailUsuario().toLowerCase();
  return AREA_POR_USUARIO[email] || null;
}

let areaSessaoCache = null;
let areaSessaoCalculada = false;
function areaDaSessao() {
  if (!areaSessaoCalculada) {
    areaSessaoCalculada = true;
    areaSessaoCache = areaDoUsuarioLogado();
  }
  return areaSessaoCache;
}

function itemVisivelParaUsuario(item) {
  const area = areaDaSessao();
  if (!area) return true;

  if (!item.area) return true;

  return item.area === area;
}

function filtrarPorArea(dados) {
  return dados.filter(itemVisivelParaUsuario);
}

function preencherUsuarioLogado() {
  const el = document.getElementById('usuario-logado');
  if (!el) return;
  const email = obterEmailUsuario();
  const area = areaDoUsuarioLogado();
  el.textContent = 'Usuário logado: ' + (email || '—') + (area ? ' · Área: ' + area : '');
  el.title = email || '';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preencherUsuarioLogado);
} else {
  preencherUsuarioLogado();
}