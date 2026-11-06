const SUPABASE_URL = 'https://lzupoizfdxezwphlhudi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_7XikZqmT0mP7812uSjwQ2g_0RdLMAip';

function construirCliente() {
    if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        throw new Error('SDK do Supabase não carregou. Verifique sua internet ou o acesso ao CDN.');
    }
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
        throw new Error('Arquivo supabase-config.js ausente ou não configurado.');
    }
    if (SUPABASE_URL.indexOf('COLE_') === 0 || SUPABASE_ANON_KEY.indexOf('COLE_') === 0) {
        throw new Error('Preencha SUPABASE_URL e SUPABASE_ANON_KEY em supabase-config.js.');
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    });
}