const CHAVE_NOME = 'supabase_nome_usuario';

let supabase = null;

function obterErroCliente() {
    try {
        return construirCliente() && '';
    } catch (e) {
        return e.message;
    }
}

function criarCliente() {
    try {
        supabase = construirCliente();
    } catch (e) {
        supabase = null;
        console.error('[Supabase]', e.message);
    }
    return supabase;
}

function obterCliente() {
    if (!supabase) criarCliente();
    return supabase;
}

async function verificarSessao() {
    const cliente = obterCliente();
    if (!cliente) return null;
    const { data: { session } } = await cliente.auth.getSession();
    return session;
}

async function protegerPagina() {
    try {
        const session = await verificarSessao();
        if (!session) {
            localStorage.removeItem('dmae_cache');
            window.location.replace('login.html');
            return null;
        }
        return session;
    } catch (e) {
        console.error('[Supabase] Erro ao verificar sessão:', e);
        window.location.replace('login.html');
        return null;
    }
}

async function redirecionarSeLogado() {
    try {
        const session = await verificarSessao();
        if (session) { window.location.replace('index.html'); return session; }
        return null;
    } catch (e) {
        console.error('[Supabase] Erro ao verificar sessão:', e);
        return null;
    }
}

function obterNomeDaSessao() {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const chave = localStorage.key(i);
            if (chave && chave.startsWith('sb-') && chave.endsWith('-auth-token')) {
                const armazenado = JSON.parse(localStorage.getItem(chave));
                const usuario = armazenado?.session?.user || armazenado?.user;
                const meta = usuario?.user_metadata || {};
                const nome = meta.nome || meta.displayName || meta.full_name;
                if (nome) return nome;
            }
        }
    } catch {}
    return '';
}

function salvarNomeUsuario(usuario) {
    try {
        const meta = usuario?.user_metadata || {};
        const nome = meta.nome || meta.displayName || meta.full_name || usuario?.email || usuario?.id || '';
        localStorage.setItem(CHAVE_NOME, nome);
        return nome;
    } catch {
        return '';
    }
}

function obterNomeUsuario() {
    return obterNomeDaSessao() || localStorage.getItem(CHAVE_NOME) || '';
}

function limparSessaoLocal() {
    try {
        [localStorage, sessionStorage].forEach(storage => {
            const chavesParaRemover = [];
            for (let i = 0; i < storage.length; i++) {
                const chave = storage.key(i);
                if (chave && chave.startsWith('sb-')) {
                    chavesParaRemover.push(chave);
                }
                if (chave && chave.indexOf('supabase') !== -1) {
                    chavesParaRemover.push(chave);
                }
            }
            chavesParaRemover.forEach(chave => storage.removeItem(chave));
        });
        localStorage.removeItem('dmae_cache');
        localStorage.removeItem(CHAVE_NOME);
    } catch (e) {
        console.error('[Supabase] Erro ao limpar sessão local:', e);
    }
}

async function logout() {
    limparSessaoLocal();
    const cliente = obterCliente();
    try {
        if (cliente) await cliente.auth.signOut();
    } catch (e) {
        console.error('[Supabase] Erro no logout:', e);
    }
    limparSessaoLocal();
    window.location.replace('login.html');
}