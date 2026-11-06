const SHEET_NAME = "Respostas ao formulário 1";

function garantirColunas(sheet) {
  try {
    const total = sheet.getMaxColumns();
    if (total < 26) {
      sheet.insertColumnsAfter(total, 26 - total);
    }
  } catch (e) {
    Logger.log('garantirColunas falhou: ' + e);
  }
}

function doGet(e) {
  const cache = CacheService.getScriptCache();
  const cacheChave = "sos_dados_json";

  const versao = Number(cache.get("sos_mutacao") || '0');

  const cacheHit = cache.get(cacheChave);
  if (cacheHit) {
    try {
      const obj = JSON.parse(cacheHit);
      if (obj && obj.v === versao && typeof obj.data === 'string') {
        return ContentService.createTextOutput(obj.data)
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch (e) {}
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  garantirColunas(sheet);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    const saidaVazia = "[]";
    cache.put(cacheChave, JSON.stringify({ v: versao, data: saidaVazia }), 300);
    return ContentService.createTextOutput(saidaVazia)
      .setMimeType(ContentService.MimeType.JSON);
  }

  const maxCols = sheet.getMaxColumns();
  const cols = Math.min(26, Math.max(maxCols, 1));
  const data = sheet.getRange(1, 1, lastRow, cols).getValues();

  const linhasSemEtapa = [];

  const json = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][3]) continue;

    const statusSalvo = data[i][16];
    const ehNovoFluxo = !!statusSalvo;

    let classificadoPor = data[i][12];
    if (!classificadoPor || classificadoPor === 'Sim') {
      classificadoPor = data[i][13];
    }

    let status = statusSalvo;
    if (!status) {
      status = data[i][12] === 'Sim' ? 'Concluído'
             : (data[i][11] ? 'Planejamento' : 'Pendente');
      linhasSemEtapa.push({ linha: i + 1, etapa: status });
    }

    json.push({
      rowNumber: i + 1,
      id: data[i][0],
      dataHora: data[i][1],
      nome: data[i][3],
      local: data[i][5],
      objeto: data[i][6],
      motivo: data[i][8],
      observacaoAdicional: data[i][10],
      imagens: data[i][9],
      prioridade: data[i][11],
      area: data[i][21] || '',
      classificadoPor: classificadoPor,
      responsavelExecucao: ehNovoFluxo ? data[i][13] : '',
      dataPrevista: ehNovoFluxo ? data[i][14] : '',
      prazoEstimado: ehNovoFluxo ? data[i][15] : '',
      status: status,
      dataConclusaoReal: ehNovoFluxo ? data[i][17] : '',
      materiaisUtilizados: ehNovoFluxo ? data[i][18] : '',
      observacoesTecnicas: ehNovoFluxo ? data[i][19] : '',
      concluidoPor: ehNovoFluxo ? data[i][20] : (status === 'Concluído' ? data[i][14] : ''),
      motivoIndeferido: data[i][22] || '',
      motivoTratativa: data[i][23] || '',
      versaoApi: 'v15'
    });
  }

  if (linhasSemEtapa.length > 0) {
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      const statusCol = sheet.getRange(1, 17, lastRow, 1).getValues();
      const aGravar = [];
      for (let k = 0; k < linhasSemEtapa.length; k++) {
        const linha = linhasSemEtapa[k].linha;
        if (!statusCol[linha - 1][0]) {
          aGravar.push(linhasSemEtapa[k]);
        }
      }
      for (let j = 0; j < aGravar.length; j++) {
        sheet.getRange(aGravar[j].linha, 17).setValue(aGravar[j].etapa);
      }
      lock.releaseLock();
    } catch (err) {
      lock.releaseLock();
    }
  }

  const saida = JSON.stringify(json);
  cache.put(cacheChave, JSON.stringify({ v: versao, data: saida }), 300);

  return ContentService.createTextOutput(saida)
    .setMimeType(ContentService.MimeType.JSON);
}

function incrementarMutacao() {
  const cache = CacheService.getScriptCache();
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const v = Number(cache.get("sos_mutacao") || '0') + 1;
    cache.put("sos_mutacao", String(v), 21600);
    cache.remove("sos_dados_json");
    lock.releaseLock();
  } catch (e) {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);

  if (params.action === 'login') {
    return handleLogin(params.usuario, params.senha);
  }

  if (params.action === 'planejar') {
    return handlePlanejar(params);
  }

  if (params.action === 'executar') {
    return handleExecutar(params);
  }

  if (params.action === 'area') {
    return handleArea(params);
  }

  if (params.action === 'tratativa') {
    return handleTratativa(params);
  }

  if (params.action === 'indeferir') {
    return handleIndeferir(params);
  }

  if (params.action === 'reabrir') {
    return handleReabrir(params);
  }

  if (params.action) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "erro",
      mensagem: "Ação não reconhecida ('" + params.action + "'). O backend publicado está desatualizado — publique uma nova versão do doPost."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  garantirColunas(sheet);

  const celulaPrioridade = sheet.getRange(params.rowNumber, 12);
  const prioridadeAtual = celulaPrioridade.getValue();

  if (prioridadeAtual !== "" && prioridadeAtual !== null && prioridadeAtual !== undefined) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "erro",
      mensagem: "Atenção: Este chamado já foi classificado por outro usuário!"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const ehIndeferido = params.prioridade === 'Indeferido por irrelevância';

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    sheet.getRange(params.rowNumber, 12, 1, 6).setValues([[
      params.prioridade,
      params.usuario || '',
      '',
      '',
      '',
      ehIndeferido ? 'Indeferido' : 'Planejamento'
    ]]);

    sheet.getRange(params.rowNumber, 22).setValue(params.area || '');

    if (ehIndeferido) {
      sheet.getRange(params.rowNumber, 23).setValue(params.motivoIndeferido || '');
    }

    lock.releaseLock();
  } catch (err) {
    lock.releaseLock();
    throw err;
  }

  incrementarMutacao();

  return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleArea(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      sheet.getRange(params.rowNumber, 22).setValue(params.area || '');
      lock.releaseLock();
    } catch (err) {
      lock.releaseLock();
      throw err;
    }

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao salvar a área."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleTratativa(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const statusAtual = sheet.getRange(params.rowNumber, 17).getValue();

    if (statusAtual === 'Em Execução' || statusAtual === 'Concluído') {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Atenção: Este chamado já foi enviado para execução ou concluído por outro usuário!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.getRange(params.rowNumber, 17).setValue('Em Tratativa');
    sheet.getRange(params.rowNumber, 24).setValue(params.motivoTratativa || '');

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao enviar para tratativa."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleIndeferir(params) {
  try {
    const motivo = String(params.motivoIndeferimento || '').trim();
    if (!motivo) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Informe o motivo do indeferimento."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);

      const statusAtual = sheet.getRange(params.rowNumber, 17).getValue();

      if (statusAtual === 'Concluído' || statusAtual === 'Indeferido') {
        lock.releaseLock();
        return ContentService.createTextOutput(JSON.stringify({
          status: "erro",
          mensagem: "Atenção: Este chamado já foi concluído ou indeferido por outro usuário!"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.getRange(params.rowNumber, 17, 1, 7).setValues([[
        'Indeferido', '', '', '', '', '', motivo
      ]]);

      lock.releaseLock();
    } catch (err) {
      lock.releaseLock();
      throw err;
    }

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao indeferir o chamado."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleReabrir(params) {
  try {
    const destino = String(params.destino || '');
    if (destino !== 'Em Execução' && destino !== 'Planejamento') {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Destino inválido para reabertura."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);

      const statusAtual = sheet.getRange(params.rowNumber, 17).getValue();

      let esperado = '';
      if (statusAtual === 'Concluído') esperado = 'Em Execução';
      else if (statusAtual === 'Indeferido') esperado = 'Planejamento';

      if (!esperado) {
        lock.releaseLock();
        return ContentService.createTextOutput(JSON.stringify({
          status: "erro",
          mensagem: "Só é possível reabrir chamados concluídos ou indeferidos."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      if (destino !== esperado) {
        lock.releaseLock();
        return ContentService.createTextOutput(JSON.stringify({
          status: "erro",
          mensagem: "Este chamado só pode voltar para " + esperado + "."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      sheet.getRange(params.rowNumber, 17).setValue(destino);
      lock.releaseLock();
    } catch (err) {
      lock.releaseLock();
      throw err;
    }

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao reabrir o chamado."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handlePlanejar(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const statusAtual = sheet.getRange(params.rowNumber, 17).getValue();

    if (statusAtual === 'Em Execução' || statusAtual === 'Concluído') {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Atenção: Este chamado já foi enviado para execução por outro usuário!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!params.responsavelExecucao) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Informe o responsável pela execução."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.getRange(params.rowNumber, 14).setValue(params.responsavelExecucao);
    sheet.getRange(params.rowNumber, 15).setValue(params.dataPrevista || '');
    sheet.getRange(params.rowNumber, 16).setValue(params.prazoEstimado || '');
    sheet.getRange(params.rowNumber, 17).setValue('Em Execução');

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao enviar para execução."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleExecutar(params) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const statusAtual = sheet.getRange(params.rowNumber, 17).getValue();

    if (statusAtual === 'Concluído') {
      return ContentService.createTextOutput(JSON.stringify({
        status: "erro",
        mensagem: "Atenção: Este chamado já foi concluído por outro usuário!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const nomeConcluinte = String(params.concluidoPor || '').trim();

    sheet.getRange(params.rowNumber, 17).setValue('Concluído');
    sheet.getRange(params.rowNumber, 18).setValue(params.dataConclusaoReal || new Date());
    sheet.getRange(params.rowNumber, 19).setValue(params.materiaisUtilizados || '');
    sheet.getRange(params.rowNumber, 20).setValue(params.observacoesTecnicas || '');
    sheet.getRange(params.rowNumber, 21).setValue(nomeConcluinte);

    incrementarMutacao();

    return ContentService.createTextOutput(JSON.stringify({status: "sucesso", concluidoPor: nomeConcluinte}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({status: "erro", mensagem: "Erro ao concluir."}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleLogin(usuario, senha) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Credenciais');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Planilha de credenciais não encontrada. Crie uma aba chamada "Credenciais".'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const dados = sheet.getDataRange().getValues();

    for (let i = 1; i < dados.length; i++) {
      if (dados[i][0].toString() === usuario && dados[i][1].toString() === senha) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          nome: dados[i][2] || ''
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Usuário ou senha inválidos.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Erro interno no servidor.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function manterAcordado() {
  return true;
}