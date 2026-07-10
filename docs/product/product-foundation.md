# ROOT — Build better habits, one workout at a time.
## Documentação de Produto — Fase 1: Estratégia e Fundamentos de UX

---

## 1. Visão do Produto

### 1.1 Problema

A maioria dos apps de fitness resolve apenas um problema: **registrar treinos**.
Eles assumem que o usuário já sabe o que fazer, quando fazer e por que fazer.

Na prática, o comportamento real de quem treina é irregular:

- excesso de foco em um único tipo de treino (ex: força)
- abandono silencioso de hábitos importantes (mobilidade, hidratação, sono)
- perda de consistência sem que o usuário perceba o padrão
- falta de contexto sobre *por que* algo é recomendado, o que gera desconfiança em apps "genéricos"

O resultado é abandono do app em poucas semanas — o problema não é falta de motivação, é **falta de direção personalizada e contínua**.

### 1.2 Visão

> Ser o sistema que entende o comportamento de cada pessoa em relação à sua saúde e a guia, dia após dia, para hábitos mais equilibrados — não através de metas genéricas, mas de recomendações que fazem sentido para *aquela* pessoa, naquele momento.

### 1.3 Proposta de Valor

**ROOT não é um diário de treinos. É um sistema de recomendação comportamental aplicado à saúde.**

| Apps tradicionais | ROOT |
|---|---|
| Usuário decide o que fazer | Sistema sugere com base em padrões reais |
| Métricas isoladas | Padrões cruzados (frequência × recência × objetivo) |
| Recomendação genérica ("beba água") | Recomendação contextual e explicada |
| Foco em um pilar (treino OU dieta OU sono) | Visão holística de hábitos |
| Engajamento por gamificação vazia | Engajamento por relevância e clareza |

### 1.4 North Star Metric

**Consistência comportamental equilibrada** — medida como a % de usuários que, ao longo de 4 semanas, mantêm atividade em pelo menos 3 categorias de hábito diferentes (ex: força, mobilidade, hidratação), não apenas uma.

Métricas de suporte:
- Taxa de aceitação de recomendações (recommendation acceptance rate)
- Diversidade de categorias ativas por usuário/semana
- Retenção D7 / D30
- Tempo até a primeira recomendação aceita (time-to-value)

### 1.5 Objetivos de Negócio (para o contexto de portfólio)

1. Demonstrar um **Recommendation Engine funcional, explicável e evolutivo** (arquitetura em camadas, de regras simples a preparação para ML).
2. Demonstrar **arquitetura Angular enterprise** por features, com separação clara de responsabilidades.
3. Demonstrar **maturidade em UX**: decisões justificadas, não estéticas gratuitas.
4. Entregar um produto **visualmente coeso e emocionalmente distinto** (identidade "chalk/nature/editorial"), fugindo do padrão visual saturado de apps fitness (neon, gamificado, agressivo).

### 1.6 Princípios de Produto

1. **Toda recomendação é explicável.** Nunca uma sugestão "porque sim" — sempre com o motivo declarado.
2. **Calma antes de estímulo.** Nenhuma notificação ou cor grita pela atenção do usuário.
3. **O sistema se adapta ao usuário, não o contrário.** Menos configuração manual, mais inferência de comportamento.
4. **Equilíbrio é o objetivo, não intensidade.** ROOT não empurra "treinar mais" — empurra "treinar melhor e mais completo".
5. **Progresso visível, mas não ansiogênico.** Métricas mostradas com contexto, nunca como cobrança.

---

## 2. Personas

### 2.1 Marina Torres — "A atleta desequilibrada"

**33 anos · Designer · Treina musculação há 2 anos · São Paulo, SP**

> "Eu sei que deveria alongar. Só não... faço."

- **Comportamento real:** treina força 5-6x por semana, extremamente consistente. Nunca faz mobilidade ou alongamento. Ignora hidratação.
- **Objetivo:** manter a estética e a força conquistadas, sem se machucar no processo.
- **Frustração:** apps de treino só reforçam o que ela já faz bem (mais treinos de força), nunca o que ela evita.
- **Gatilho de valor:** uma recomendação que nomeia especificamente o padrão que ela está evitando, com dado concreto ("5 dias consecutivos de força, 0 de mobilidade").
- **Job to be Done:** "Quando eu abro o app depois do treino, quero saber o que estou negligenciando, para não me machucar nem estagnar."

### 2.2 Rafael Andrade — "O iniciante intermitente"

**27 anos · Analista financeiro · Começou a treinar há 3 meses · Recife, PE**

> "Eu quero treinar, mas nunca sei se hoje é dia de treino ou de descanso."

- **Comportamento real:** treina de forma irregular (2-4x por semana, sem padrão fixo). Abandona sequências de dias após qualquer treino mais puxado.
- **Objetivo:** criar consistência real, sem se sentir cobrado.
- **Frustração:** apps com métricas de "streak" o fazem sentir culpa quando falha, o que o leva a desistir de vez.
- **Gatilho de valor:** recomendações leves e acessíveis em dias de baixa energia, ao invés de sempre empurrar o próximo nível.
- **Job to be Done:** "Quando eu não sei o que fazer hoje, quero uma sugestão simples que se encaixe no meu momento, para eu não travar e desistir."

### 2.3 Beatriz Lima — "A guerreira de fim de semana"

**41 anos · Empresária, mãe de 2 · Vida corrida durante a semana · Curitiba, PR**

> "De segunda a sexta eu mal tenho tempo de beber água direito. No fim de semana eu tento compensar tudo."

- **Comportamento real:** quase inativa durante a semana; concentra treinos intensos no sábado/domingo. Sono irregular, hidratação baixa.
- **Objetivo:** cuidar da saúde sem precisar de grandes blocos de tempo livre.
- **Frustração:** sente que "não tem perfil de app fitness" porque não treina todo dia.
- **Gatilho de valor:** o sistema reconhece o padrão de fim de semana como válido e sugere micro-hábitos (2-5 min) durante a semana, ao invés de exigir treinos completos.
- **Job to be Done:** "Quando estou sem tempo durante a semana, quero pequenas ações viáveis, para não sentir que estou falhando com minha saúde."

---

## 3. Jornada do Usuário (Customer Journey Map)

### Etapa 1 — Descoberta
**Ação:** encontra o ROOT via indicação ou busca por "app de hábitos saudáveis".
**Pensamento:** "Mais um app de treino? Já tentei vários."
**Emoção:** cética, neutra.
**Oportunidade de design:** onboarding precisa comunicar a diferenciação (recomendação inteligente) em segundos, não em textos longos.

### Etapa 2 — Onboarding
**Ação:** responde perguntas curtas sobre objetivo, rotina atual e preferências.
**Pensamento:** "Ok, ele está perguntando coisas diferentes — não só peso e altura."
**Emoção:** curiosidade.
**Oportunidade de design:** onboarding curto (≤ 5 passos), com copywriting acolhedor, sem jargão técnico.

### Etapa 3 — Primeira Semana
**Ação:** registra 2-3 treinos, explora o dashboard.
**Pensamento:** "O sistema ainda não me conhece direito."
**Emoção:** experimentação, baixa confiança nas recomendações.
**Oportunidade de design:** primeiras recomendações devem ser conservadoras e transparentes sobre terem poucos dados ainda ("Ainda estamos aprendendo seus padrões").

### Etapa 4 — Padrão Comportamental Emerge (Semana 2-4)
**Ação:** o sistema já identifica tendências (ex: excesso de força, falta de mobilidade).
**Pensamento:** "Ele realmente notou que eu não alongo. Isso é preciso."
**Emoção:** confiança crescente, sensação de ser "visto" pelo produto.
**Oportunidade de design:** este é o **momento-chave de valor** (aha moment) — a explicabilidade da recomendação precisa ser impecável aqui.

### Etapa 5 — Hábito de Checar o App
**Ação:** usuário passa a abrir o ROOT não para "logar treino", mas para ver "o que o sistema recomenda hoje".
**Pensamento:** "Deixa eu ver o que ele sugere hoje."
**Emoção:** hábito confortável, baixo esforço cognitivo.
**Oportunidade de design:** dashboard precisa priorizar a recomendação do dia acima de qualquer outra informação.

### Etapa 6 — Retenção de Longo Prazo
**Ação:** usuário mantém múltiplas categorias de hábito ativas (não só treino de força).
**Pensamento:** "Estou mais equilibrado do que antes."
**Emoção:** realização, senso de progresso real (não só estético).
**Oportunidade de design:** relatórios semanais/mensais que mostram a evolução do *equilíbrio*, não apenas volume de treino.

---

## 4. User Flow (fluxos principais)

### 4.1 Fluxo de Onboarding
```
Abrir app → Tela de boas-vindas (proposta de valor)
   → Objetivo principal (força / saúde geral / perda de peso / mobilidade / bem-estar)
   → Rotina atual (dias disponíveis por semana)
   → Nível de experiência
   → Preferências (tipos de atividade que gosta / evita)
   → Resumo + confirmação
   → Dashboard inicial (com estado "aprendendo seus padrões")
```

### 4.2 Fluxo de Recomendação Diária
```
Usuário abre Dashboard
   → RecommendationService consulta InteractionService (histórico)
   → ScoreService calcula relevância por categoria
   → RankingService ordena candidatos
   → Card de Recomendação exibido com explicação
   → Usuário: [Aceitar e iniciar] / [Ver outras opções] / [Dispensar]
       → Aceitar → Fluxo de execução do treino/hábito
       → Ver outras → Lista alternativa com explicações individuais
       → Dispensar → InteractionService registra feedback (sinal negativo fraco)
```

### 4.3 Fluxo de Registro de Hábito (ex: hidratação, sono)
```
Dashboard → Card de Métrica (ex: Hidratação)
   → Tap rápido → Bottom Sheet de registro
   → Input rápido (quantidade / qualidade / duração)
   → Confirmação visual (micro-animação)
   → Atualização em tempo real do progresso do dia
```

### 4.4 Fluxo de Definição de Objetivo
```
Perfil → Objetivos → [Novo Objetivo]
   → Categoria (força, mobilidade, sono, hidratação, etc.)
   → Meta (frequência ou métrica-alvo)
   → Prazo (opcional)
   → Confirmação → Goal Card criado no Dashboard
   → Recommendation Engine passa a considerar esse objetivo no cálculo de score (v3+)
```

---

## 5. Sitemap

```
ROOT
├── Onboarding
│   ├── Boas-vindas
│   ├── Objetivo
│   ├── Rotina
│   ├── Experiência
│   ├── Preferências
│   └── Resumo
│
├── Dashboard (Home)
│   ├── Saudação + Streak
│   ├── Recomendação do dia (destaque)
│   ├── Treino do dia
│   ├── Gráfico semanal
│   ├── Métricas rápidas (calorias, tempo ativo, hidratação, sono)
│   ├── Objetivos em andamento
│   ├── Atividade recente
│   └── Atalhos
│
├── Recomendações
│   ├── Recomendação principal
│   ├── Alternativas
│   └── Histórico de recomendações (aceitas/dispensadas)
│
├── Treinos (Workouts)
│   ├── Biblioteca de treinos
│   ├── Detalhe do treino
│   ├── Execução do treino
│   └── Histórico
│
├── Objetivos (Goals)
│   ├── Lista de objetivos
│   ├── Novo objetivo
│   └── Detalhe/progresso do objetivo
│
├── Nutrição
│   ├── Registro de refeições
│   └── Hidratação
│
├── Sono
│   ├── Registro de sono
│   └── Histórico/tendências
│
├── Analytics
│   ├── Visão geral de equilíbrio (categorias)
│   ├── Tendências (frequência, recência)
│   └── Relatórios semanais/mensais
│
├── Perfil
│   ├── Dados pessoais
│   ├── Preferências
│   └── Metas físicas
│
└── Configurações
    ├── Notificações
    ├── Privacidade e dados
    ├── Aparência (dark mode preparado)
    └── Sobre / Ajuda
```

---

## 6. Arquitetura da Informação

### 6.1 Princípios de Navegação

- **Navegação primária (mobile):** Bottom Navigation com 5 itens fixos — *Início, Treinos, Recomendações (ação central em destaque), Analytics, Perfil*.
- **Navegação primária (desktop):** Sidebar fixa expandida, mesma hierarquia.
- **Profundidade máxima:** 3 níveis de navegação até qualquer ação principal (princípio de baixo esforço cognitivo).
- **A recomendação do dia nunca fica a mais de 1 tap/clique do ponto de entrada** — é o elemento de maior prioridade visual do sistema.

### 6.2 Hierarquia de Conteúdo no Dashboard (ordem de prioridade)

1. Saudação contextual + streak (orientação temporal e emocional)
2. **Recomendação inteligente do dia** (núcleo do produto — sempre acompanhada da explicação)
3. Treino do dia / próxima ação sugerida
4. Métricas de progresso (resumo visual, não números crus)
5. Gráfico semanal (contexto de tendência)
6. Objetivos ativos
7. Atividade recente
8. Atalhos secundários

### 6.3 Modelo Mental do Usuário

O usuário não pensa em "categorias de dados" (força, mobilidade, sono) como o sistema pensa internamente. Ele pensa em **"o que eu devo fazer agora"**. Por isso:

- A interface é organizada por **momento e intenção** (o que fazer hoje), não por módulo técnico.
- A categorização por hábito (força, mobilidade, hidratação, sono) existe no motor de recomendação e nas telas de Analytics, mas não fragmenta a experiência do Dashboard.

### 6.4 Sistema de Explicabilidade (regra transversal)

Toda superfície que exibe uma recomendação segue o padrão:

```
[Ícone da categoria] [Título da recomendação]
"[Explicação em 1 frase, com dado concreto]"
[Ação primária] [Ação secundária: ver alternativas / dispensar]
```

Exemplo real:
> 🧘 Mobilidade recomendada
> "Você treinou força por 5 dias consecutivos e ainda não fez mobilidade esta semana."
> [Iniciar treino de 10 min] [Ver outras opções]

Essa estrutura é **obrigatória em todas as features** que envolvem sugestão do sistema (Dashboard, Recomendações, Notificações, Analytics).