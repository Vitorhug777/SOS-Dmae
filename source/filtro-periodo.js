const FiltroPeriodo = (function() {
    const pagina = (window.location.pathname.split('/').pop() || 'geral').replace(/\.[^.]+$/, '').replace(/\W+/g, '_') || 'geral';
    const CHAVE_MES    = 'dmae_fp_' + pagina + '_m';
    const CHAVE_INICIO = 'dmae_fp_' + pagina + '_i';
    const CHAVE_FIM    = 'dmae_fp_' + pagina + '_f';
    let filtroMes   = '';
    let dataInicio  = '';
    let dataFim     = '';
    let aoMudar = null;

    function restaurar() {
        try {
            filtroMes   = localStorage.getItem(CHAVE_MES)    || '';
            dataInicio  = localStorage.getItem(CHAVE_INICIO) || '';
            dataFim     = localStorage.getItem(CHAVE_FIM)    || '';
        } catch(e) { filtroMes = ''; dataInicio = ''; dataFim = ''; }
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE_MES, filtroMes);
            localStorage.setItem(CHAVE_INICIO, dataInicio);
            localStorage.setItem(CHAVE_FIM, dataFim);
        } catch(e) {}
    }

    function restaurarUI() {
        const sel = document.getElementById('filtro-mes');
        const ini = document.getElementById('filtro-data-inicio');
        const fim = document.getElementById('filtro-data-fim');
        if (sel) sel.value = filtroMes || '';
        if (ini) ini.value = dataInicio;
        if (fim) fim.value = dataFim;
    }

    function preencherMes(dados) {
        const sel = document.getElementById('filtro-mes');
        if (!sel) return;
        const meses = {};
        (dados || []).forEach(function(item) {
            if (!item || !item.dataHora) return;
            const d = new Date(item.dataHora);
            if (isNaN(d.getTime())) return;
            const chave = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            meses[chave] = true;
        });
        const lista = Object.keys(meses).sort().reverse();
        sel.innerHTML = '<option value="">Todos os meses</option>' + lista.map(function(chave) {
            const partes = chave.split('-');
            const rotulo = new Date(Number(partes[0]), Number(partes[1]) - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            return '<option value="' + chave + '">' + rotulo.charAt(0).toUpperCase() + rotulo.slice(1) + '</option>';
        }).join('');
        sel.value = filtroMes || '';
    }

    function lerFiltros() {
        const sel = document.getElementById('filtro-mes');
        const ini = document.getElementById('filtro-data-inicio');
        const fim = document.getElementById('filtro-data-fim');
        filtroMes   = (sel && sel.value) || '';
        dataInicio  = (ini && ini.value) || '';
        dataFim     = (fim && fim.value) || '';
        salvar();
        if (aoMudar) aoMudar();
    }

    function limpar() {
        filtroMes  = '';
        dataInicio = '';
        dataFim    = '';
        const sel = document.getElementById('filtro-mes');
        const ini = document.getElementById('filtro-data-inicio');
        const fim = document.getElementById('filtro-data-fim');
        if (sel) sel.value = '';
        if (ini) ini.value = '';
        if (fim) fim.value = '';
        salvar();
        if (aoMudar) aoMudar();
    }

    function filtrar(lista) {
        if (!filtroMes && !dataInicio && !dataFim) return lista;
        return lista.filter(function(item) {
            if (!item || !item.dataHora) return true;
            const d = new Date(item.dataHora);
            if (isNaN(d.getTime())) return true;
            const ano = d.getFullYear();
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const dia = String(d.getDate()).padStart(2, '0');
            const chaveMes = ano + '-' + mes;
            const chaveDia = chaveMes + '-' + dia;
            if (filtroMes && chaveMes !== filtroMes) return false;
            if (dataInicio && chaveDia < dataInicio) return false;
            if (dataFim && chaveDia > dataFim) return false;
            return true;
        });
    }

    return {
        restaurar: restaurar,
        restaurarUI: restaurarUI,
        preencherMes: preencherMes,
        lerFiltros: lerFiltros,
        limpar: limpar,
        filtrar: filtrar,
        registrarCallback: function(fn) { aoMudar = fn; }
    };
})();