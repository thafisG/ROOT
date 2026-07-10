# ROOT — Product Requirements Document (PRD)
## Documentação de Produto — Fase 4

Este documento traduz a Visão de Produto (Fase 1) e o Design System (Fase 2) em **requisitos verificáveis** — o que o produto precisa fazer, com quais critérios de aceite, para ser considerado pronto para desenvolvimento (Fase 7 em diante). Serve como contrato entre design e engenharia.

---

## 1. Sumário Executivo

| Campo | Descrição |
|---|---|
| Produto | ROOT — PWA de fitness e hábitos saudáveis |
| Diferencial | Recommendation Engine comportamental explicável |
| Plataforma | Web responsivo + PWA instalável (mobile-first) |
| Persistência v1 | localStorage, com camada de abstração para API futura |
| Público-alvo | Pessoas que já praticam alguma atividade física, mas de forma desequilibrada ou inconsistente (ver Personas, Fase 1) |
| Fora de escopo v1 | Backend real, autenticação multi-dispositivo, integração com wearables, IA generativa |

---

## 2. Objetivos e Métricas de Sucesso

### 2.1 Objetivos de Produto

1. Provar, de ponta a ponta, que um sistema de recomendação simples (baseado em regras) consegue gerar sugestões relevantes e explicáveis a partir de dados comportamentais locais.
2. Entregar uma experiência mobile-first coesa, acessível (WCAG AA) e visualmente distinta do padrão "fitness app".
3. Demonstrar uma arquitetura Angular por features, pronta para escalar para um backend real sem refatoração estrutural.

### 2.2 Métricas de Sucesso (mesmo em contexto de portfólio, tratadas como se fossem produção)

| Métrica | Definição | Meta de referência |
|---|---|---|
| Recommendation Acceptance Rate | % de recomendações aceitas (Iniciar) sobre total exibidas | ≥ 40% |
| Diversidade de categorias ativas | Nº médio de categorias distintas com registro/semana por usuário | ≥ 3 de 6 |
| Time-to-first-recommendation | Tempo entre fim do onboarding e 1ª recomendação exibida | < 2s (dado local) |
| Taxa de conclusão do onboarding | % de usuários que completam todos os passos | ≥ 85% |
| Acessibilidade | Auditoria automatizada (axe-core) | 0 erros críticos |

---

## 3. Escopo por Feature

Cada feature abaixo corresponde a um módulo da arquitetura Angular (Fase 1, seção "Arquitetura Angular") e terá sua própria pasta `features/<nome>`.

### 3.1 Recommendation (núcleo do produto)

**Descrição:** motor que analisa o histórico de interações do usuário e retorna recomendações ranqueadas e explicadas.

**Requisitos funcionais:**
- RF-01 — O sistema deve calcular um score por categoria de hábito (força, mobilidade, hidratação, sono, nutrição, cardio) com base em frequência e recência de registros.
- RF-02 — A recomendação de maior score deve ser exibida com destaque no Dashboard, sempre acompanhada de uma explicação textual gerada a partir do dado que originou o score (ver Fase 1, seção 6.4).
- RF-03 — O usuário deve poder ver recomendações alternativas (as 2-3 próximas do ranking), cada uma com sua própria explicação.
- RF-04 — Dispensar uma recomendação deve registrar um sinal fraco negativo, reduzindo temporariamente o score daquela categoria (sem penalização permanente).
- RF-05 — Aceitar uma recomendação deve registrar um sinal positivo e redirecionar para o fluxo de execução correspondente.
- RF-06 — O motor deve ser versionável: a estratégia de cálculo (v1 frequência → v5 preparado para IA, ver Fase 1) deve poder ser trocada via injeção de dependência (`RecommendationStrategy`), sem alterar o restante do sistema.

**Critérios de aceite:**
- Dado um usuário com 5 registros de força e 0 de mobilidade na última semana, o sistema deve recomendar mobilidade com uma explicação que cite o número de dias.
- Dado um usuário sem histórico suficiente (< 3 registros totais), o sistema deve exibir um estado "aprendendo seus padrões" ao invés de forçar uma recomendação de baixa confiança.
- Nenhuma recomendação pode ser exibida sem uma explicação associada — regra bloqueante de QA.

### 3.2 Dashboard

**Requisitos funcionais:**
- RF-07 — Exibir saudação contextual (nome + período do dia).
- RF-08 — Exibir streak atual (dias consecutivos com pelo menos um registro).
- RF-09 — Exibir a Recommendation Card em posição de destaque (topo, acima da dobra em mobile).
- RF-10 — Exibir treino do dia (se houver um planejado) separadamente da recomendação.
- RF-11 — Exibir gráfico semanal de atividade por categoria (ver Chart component, Fase 3).
- RF-12 — Exibir métricas rápidas: calorias, tempo ativo, hidratação, sono — cada uma como Metric Card navegável para o detalhe.
- RF-13 — Exibir até 3 objetivos em andamento com barra de progresso.
- RF-14 — Exibir lista de atividade recente (últimos 5 registros).
- RF-15 — Exibir atalhos para as ações mais frequentes do usuário (adaptativos, não fixos).

**Critérios de aceite:**
- O Dashboard deve renderizar seu conteúdo crítico (saudação + recomendação) em até 1s mesmo em dispositivos de baixo desempenho (dado local, sem chamada de rede).
- Em telas < 360px de largura, nenhum card pode quebrar layout ou cortar texto sem reticências apropriadas.

### 3.3 Workouts

**Requisitos funcionais:**
- RF-16 — Listar biblioteca de treinos filtrável por categoria.
- RF-17 — Exibir detalhe do treino (exercícios, duração estimada, nível).
- RF-18 — Permitir execução guiada do treino (passo a passo, com timer quando aplicável).
- RF-19 — Registrar conclusão do treino, alimentando o InteractionService.
- RF-20 — Exibir histórico de treinos realizados.

### 3.4 Goals

**Requisitos funcionais:**
- RF-21 — Criar objetivo com categoria, meta (frequência-alvo) e prazo opcional.
- RF-22 — Calcular e exibir progresso do objetivo em tempo real a partir dos registros existentes.
- RF-23 — Objetivos ativos devem influenciar o cálculo de score do Recommendation Engine a partir da estratégia v3 (frequência + recência + objetivo).

### 3.5 Nutrition (hidratação e refeições)

**Requisitos funcionais:**
- RF-24 — Registro rápido de hidratação (incremento por toque, sem formulário longo).
- RF-25 — Registro simplificado de refeições (categoria + horário, sem contagem calórica detalhada na v1).

### 3.6 Sleep

**Requisitos funcionais:**
- RF-26 — Registro de horário de início/fim de sono (manual na v1).
- RF-27 — Exibir tendência de sono dos últimos 7 dias.

### 3.7 Analytics

**Requisitos funcionais:**
- RF-28 — Exibir visão de equilíbrio entre categorias (ver Fase 1, seção 6.2 do Dashboard priorizado) — não apenas volume, mas distribuição.
- RF-29 — Exibir tendências de frequência e recência por categoria.
- RF-30 — Gerar relatório semanal/mensal navegável.

### 3.8 Profile & Settings

**Requisitos funcionais:**
- RF-31 — Editar dados pessoais e preferências definidos no onboarding.
- RF-32 — Gerenciar notificações (tipos, horários).
- RF-33 — Alternar aparência (toggle preparado para dark mode, mesmo sem tema escuro implementado na v1 — ver nota abaixo).
- RF-34 — Exportar/limpar dados locais (transparência de dados, já que a persistência v1 é local).

---

## 4. Requisitos Não Funcionais

| Categoria | Requisito |
|---|---|
| **Performance** | Time to Interactive < 2.5s em conexão 4G simulada; uso de lazy loading por feature module. |
| **Acessibilidade** | Conformidade WCAG 2.1 AA; navegação completa por teclado; contraste mínimo 4.5:1 (texto) e 3:1 (UI/ícones), conforme Design System Fase 2. |
| **Responsividade** | Suporte total aos 4 breakpoints definidos na Fase 2 (mobile, tablet, desktop, wide). |
| **PWA** | Instalável, funcional offline para leitura de dados já sincronizados (localStorage), com Service Worker para cache de assets estáticos. |
| **Persistência** | Toda leitura/escrita de dados deve passar por uma camada de abstração (`StorageService`) que hoje implementa localStorage e amanhã pode implementar REST/Firebase/Supabase sem alterar consumidores. |
| **Escalabilidade de código** | Arquitetura por features (Fase 1); nenhuma lógica de negócio no `shared`; Recommendation Engine isolado em serviços próprios e versionável. |
| **Segurança/Privacidade** | Dados sensíveis (peso, sono, hidratação) tratados como locais por padrão; nenhuma telemetria implícita — requisito ligado ao RF-34 (exportar/limpar dados). |
| **Internacionalização** | Estrutura de textos preparada para i18n (strings centralizadas), mesmo que a v1 seja mono-idioma (pt-BR). |

---

## 5. Modelo de Dados (visão de alto nível)

Entidades principais que a camada de persistência precisa suportar (detalhamento de schema fica para a Fase 7 — Arquitetura Angular):

- **User** — perfil, preferências, objetivo principal, data de criação.
- **Interaction** — registro atômico de qualquer ação do usuário (treino concluído, hidratação registrada, recomendação aceita/dispensada), com timestamp, categoria e metadata. É a entidade que alimenta o Recommendation Engine.
- **Recommendation** — histórico de recomendações geradas, score no momento, explicação gerada, e resposta do usuário (aceita/dispensada/ignorada).
- **Goal** — objetivo definido pelo usuário, vinculado a uma categoria.
- **Workout** — conteúdo estático da biblioteca de treinos (seed data na v1).

---

## 6. Fora de Escopo (v1)

Explicitamente **não** fazem parte da v1, para manter o foco no diferencial (Recommendation Engine) e evitar sobre-engenharia de portfólio:

- Autenticação real / múltiplos dispositivos sincronizados
- Integração com wearables (Apple Health, Google Fit, etc.)
- Contagem calórica detalhada de refeições
- Recomendações baseadas em modelo de ML treinado (arquitetura preparada, mas v1 usa regras — ver Fase 1, versionamento v1-v5)
- Funcionalidades sociais (compartilhamento, comparação entre usuários)
- Notificações push reais (a UI de configuração existe — RF-32 — mas o envio efetivo é simulado/local)

---

## 7. Priorização (MoSCoW)

| Prioridade | Itens |
|---|---|
| **Must have** | Onboarding, Dashboard, Recommendation Engine v1-v2, Workouts (biblioteca + execução), registro de hidratação, Goals básico |
| **Should have** | Analytics (visão de equilíbrio), Sleep tracking, Recommendation Engine v3 (objetivo) |
| **Could have** | Relatórios mensais avançados, Recommendation Engine v4 (regras configuráveis pelo usuário) |
| **Won't have (v1)** | Recommendation Engine v5 (IA), integrações externas, autenticação multi-dispositivo |

---

## 8. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Recomendações parecerem aleatórias/genéricas sem dados suficientes | Alto — mina o diferencial central do produto | Estado explícito de "aprendendo seus padrões" (RF crítico da seção 3.1) em vez de forçar recomendação com baixa confiança |
| Excesso de densidade no Dashboard prejudicar clareza | Médio | Hierarquia de conteúdo rígida definida na Fase 1 (seção 6.2), validada em wireframes antes de mockup final |
| Persistência local (localStorage) limitar demonstração de "produto real" | Médio | Camada de abstração `StorageService` documentada e testável, permitindo mostrar a troca de storage como exercício de arquitetura no portfólio |
| Paleta terrosa de baixo contraste falhar em acessibilidade | Alto | Verificação AA já embutida no Design System (Fase 2), a ser validada com axe-core em CI |