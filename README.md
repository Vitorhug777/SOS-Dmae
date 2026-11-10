# 🏢 SOS Manutenção Predial

> **Plataforma web para gestão, triagem operacional e acompanhamento do ciclo de vida de ordens de serviço e manutenção predial pública.**

![Status](https://img.shields.io/badge/Status-Em%20Produção-004790?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<div align="center">
  <img src="capa-1200x627.png" alt="SOS Manutenção Predial" width="100%">
</div>

---

## 📌 Visão Geral

O **SOS Manutenção Predial** foi desenvolvido para modernizar e centralizar o fluxo de chamados de manutenção e infraestrutura do setor público. A solução substitui o controle descentralizado por um sistema com atualização contínua, galeria de fotos para inspeção e controle de acesso por departamento.

---

## 🖼️ Telas do Sistema

| | |
|:---:|:---:|
| <img src="carrossel-1.png" alt="Visão geral" width="100%"> | <img src="carrossel-2.png" alt="Triagem" width="100%"> |
| <img src="carrossel-3.png" alt="Planejamento" width="100%"> | <img src="carrossel-4.png" alt="Em tratativa e em execução" width="100%"> |
| <img src="carrossel-5.png" alt="Concluídos" width="100%"> | <img src="carrossel-6.png" alt="Detalhe do chamado" width="100%"> |
| <img src="carrossel-7.png" alt="No celular" width="100%"> | <img src="carrossel-8.png" alt="Funcionalidades" width="100%"> |

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
