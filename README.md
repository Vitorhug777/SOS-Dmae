# 🏢 SOS Manutenção Predial

> **Plataforma web para gestão, triagem operacional e acompanhamento do ciclo de vida de ordens de serviço e manutenção pública.**

![Status](https://img.shields.io/badge/Status-Em%20Produção-004790?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=for-the-badge&logo=google&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

---

## 📌 Visão Geral

O **SOS Manutenção Predial** foi desenvolvido para modernizar e centralizar o fluxo de chamados de manutenção e infraestrutura do setor público. A solução substitui o controlo descentralizado por um ecossistema com atualização em tempo real, galerias interativas de inspeção e controlo de acessos por departamento.

<div align="center">
  <img src="assets/preview.png" alt="Pré-visualização do Painel SOS Manutenção Predial" width="100%">
</div>

---

## 🚀 Principais Funcionalidades

* **Triagem Ágil de Chamados:** Registo de pedidos com matriz de prioridade (Emergencial, Média, Baixa) e encaminhamento setorial (Património ou Obras).
* **Gestão de Ciclo de Vida Completo:** Rastreabilidade por estados: *Pendentes*, *Planeamento*, *Em Tratativa*, *Em Execução*, *Concluídos* e *Indeferidos*.
* **Inspeção Visual Integrada:** Carrossel fotográfico e sistema *Lightbox* nos cartões para validação e auditoria rápida das ocorrências.
* **Filtros e Consulta Histórica:** Filtragem por intervalo de datas, meses específicos e ordenação cronológica com persistência do estado no navegador.
* **Autenticação Segura:** Controlo de acessos via Supabase Auth integrado com políticas de permissões por área.

---

## 🛠️ Decisões de Arquitetura e Engenharia

* **Resiliência e Retentativas HTTP:** Implementação de um interceptor nativo sobre a API `fetch` com limite de tempo e retentativas automáticas, tratando *cold starts* e instabilidades pontuais no backend.
* **Cache em Memória e Atualização em Background:** Utilização de cache local com TTL e mecanismo de *polling* inteligente, mantendo a interface reativa sem sobrescrever formulários durante o preenchimento.
* **Zero Dependências Pesadas:** Construído em JavaScript moderno (Vanilla ES6+), garantindo carregamento rápido, baixo consumo de memória e fácil manutenção.

---

## 🏛️ Contexto de Aplicação

Desenvolvido para atender às necessidades operacionais do **DMAE (Departamento Municipal de Água e Esgoto)** em articulação com o **Núcleo de Inteligência de Dados (NID)** da **Prefeitura de Uberlândia**, assegurando transparência, métricas operacionais fiáveis e redução no tempo de resposta a reparações prediais.
