# 🏢 SOS Manutenção Predial

> **Plataforma web para gestão, triagem operacional e acompanhamento do ciclo de vida de ordens de serviço e manutenção predial pública.**

![Status](https://img.shields.io/badge/Status-Em%20Produção-004790?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<div align="center">
  <img src="assets/capa-1200x627.png" alt="SOS Manutenção Predial" width="100%">
</div>

---

## 📌 Visão Geral

O **SOS Manutenção Predial** foi desenvolvido para modernizar e centralizar o fluxo de chamados de manutenção e infraestrutura do setor público. A solução substitui o controle descentralizado por um sistema com atualização contínua, galeria de fotos para inspeção e controle de acesso por departamento.

<div align="center">
  <img src="assets/telas-individuais/01-painel-pendentes.png" alt="Painel de chamados pendentes" width="100%">
</div>

---

## 🔄 Fluxo do Chamado

| 1. Triagem | 2. Planejamento |
|:---:|:---:|
| <img src="assets/telas-individuais/02-triagem.png" alt="Triagem"> | <img src="assets/telas-individuais/03-planejamento.png" alt="Planejamento"> |
| Cada pedido chega com fotos, local e motivo. A equipe define área e prioridade. | Responsável, data prevista e prazo para cada chamado. |
| **3. Em Tratativa** | **4. Em Execução** |
| <img src="assets/telas-individuais/04-em-tratativa.png" alt="Em tratativa"> | <img src="assets/telas-individuais/05-em-execucao.png" alt="Em execução"> |
| Chamados que dependem de orçamento ou de outra área. | Acompanhamento do que já está com a equipe em campo. |
| **5. Concluídos** | **6. Indeferidos** |
| <img src="assets/telas-individuais/06-concluidos.png" alt="Concluídos"> | <img src="assets/telas-individuais/07-indeferidos.png" alt="Indeferidos"> |
| Histórico com data de conclusão, materiais e observações técnicas. | Pedidos recusados guardam o motivo para consulta futura. |

### Detalhe do chamado

<div align="center">
  <img src="assets/telas-individuais/08-detalhe-do-chamado.png" alt="Detalhe do chamado" width="100%">
</div>

### No celular

<div align="center">
  <img src="assets/telas-individuais/10-celular-inicio.png" alt="Celular: início" width="30%">
  &nbsp;
  <img src="assets/telas-individuais/11-celular-detalhe.png" alt="Celular: detalhe" width="30%">
  &nbsp;
  <img src="assets/telas-individuais/12-celular-execucao.png" alt="Celular: execução" width="30%">
</div>

> As imagens usam dados fictícios de demonstração.

---

## 🚀 Principais Funcionalidades

* **Triagem Ágil de Chamados:** registro de pedidos com matriz de prioridade (Emergencial, Média, Baixa) e encaminhamento por setor (Patrimônio ou Obras).
* **Gestão do Ciclo de Vida Completo:** rastreabilidade por etapas: *Pendentes*, *Planejamento*, *Em Tratativa*, *Em Execução*, *Concluídos* e *Indeferidos*.
* **Inspeção Visual Integrada:** carrossel de fotos e *lightbox* nos cartões para validação e auditoria rápida das ocorrências.
* **Filtros e Consulta Histórica:** filtro por intervalo de datas, por mês e ordenação cronológica, com o estado salvo no navegador.
* **Autenticação Segura:** controle de acesso via Supabase Auth, com visualização dos chamados por área.

---

## 🛠️ Decisões de Arquitetura e Engenharia

* **Resiliência nas Requisições HTTP:** chamadas à API com limite de tempo e novas tentativas automáticas, tratando *cold starts* e instabilidades pontuais do backend.
* **Cache Local e Atualização em Segundo Plano:** cache com tempo de validade (TTL) e atualização periódica, mantendo a interface rápida sem apagar formulários em preenchimento.
* **Zero Dependências Pesadas:** construído em JavaScript moderno (Vanilla ES6+), com carregamento rápido, baixo consumo de memória e manutenção simples.

---

## 🏛️ Contexto de Aplicação

Desenvolvido para atender às necessidades operacionais do **DMAE (Departamento Municipal de Água e Esgoto)** em parceria com o **Núcleo de Inteligência de Dados (NID)** da **Prefeitura de Uberlândia**, garantindo transparência, métricas operacionais confiáveis e menor tempo de resposta nos reparos prediais.
