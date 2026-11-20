# ROOT — Design System

## Documentação de Produto — Fase 2

Este documento define os **Design Tokens** oficiais do ROOT: a fonte única de verdade para cor, tipografia, espaçamento, forma, sombra, movimento e layout. Todo componente e toda tela (Fases 3–6) devem referenciar exclusivamente estes tokens — nunca valores "mágicos" hardcoded.

Convenção de nomenclatura: `categoria-propriedade-variante-escala`, ex: `color-primary-500`, `space-16`, `radius-lg`.

---

## 1. Color Tokens

### 1.1 Filosofia da paleta

Paleta de neutros frios com coral energético, teal de recuperação e âmbar de nutrição. A interface preserva calma e legibilidade, enquanto as cores de categoria conectam visualmente com academia e movimento. Cada família usa fundos suaves e tons mais escuros para texto e ações.

### 1.2 Neutros — "Paper & Stone" (base da interface)

| Token               | Hex       | Uso                                           |
| ------------------- | --------- | --------------------------------------------- |
| `color-neutral-0`   | `#F8F9FA` | Fundo principal                               |
| `color-neutral-50`  | `#F0F2F4` | Fundo secundário                              |
| `color-neutral-100` | `#E4E7EB` | Superfícies elevadas                          |
| `color-neutral-200` | `#D3D8DE` | Bordas sutis, divisores                       |
| `color-neutral-300` | `#B4BDC7` | Bordas de destaque, ícones inativos           |
| `color-neutral-400` | `#8995A3` | Texto terciário / placeholder                 |
| `color-neutral-500` | `#687483` | Texto secundário                              |
| `color-neutral-600` | `#4D5967` | Texto secundário forte                        |
| `color-neutral-700` | `#37414D` | Texto de alto contraste                       |
| `color-neutral-800` | `#252E38` | Texto primário forte                          |
| `color-neutral-900` | `#171D24` | Texto primário / títulos                      |

### 1.3 Primária — "Terracotta" (marca, CTAs, recomendação ativa)

| Token               | Hex       | Uso                                         |
| ------------------- | --------- | ------------------------------------------- |
| `color-primary-50`  | `#FCEDE8` | Fundo de destaque leve                      |
| `color-primary-100` | `#F7D6CB` | Fundo de badge/chip                         |
| `color-primary-200` | `#EBAF9A` | Hover suave                                 |
| `color-primary-300` | `#DC856A` | Ícones e acentos                            |
| `color-primary-400` | `#D4694A` | Estado hover de botão primário              |
| `color-primary-500` | `#C65332` | **Cor de marca principal** — CTA primário   |
| `color-primary-600` | `#A83F26` | Estado pressed                              |
| `color-primary-700` | `#84321F` | Texto sobre fundo primary-50/100            |
| `color-primary-800` | `#612719` | Texto de alto contraste sobre fundos claros |
| `color-primary-900` | `#3A1C12` | Reservado / dark mode                       |

### 1.4 Secundária — "Teal" (recuperação, mobilidade e confirmações)

| Token                 | Hex       | Uso                                                   |
| --------------------- | --------- | ----------------------------------------------------- |
| `color-secondary-50`  | `#E8F3F1` | Fundo leve                                            |
| `color-secondary-100` | `#CDE5E1` | Fundo de badge                                        |
| `color-secondary-300` | `#80B8AF` | Acentos                                               |
| `color-secondary-500` | `#34786F` | **Cor de recuperação e mobilidade**                  |
| `color-secondary-700` | `#24544E` | Texto sobre fundo secondary-50/100                    |
| `color-secondary-900` | `#1D2013` | Reservado / dark mode                                 |

### 1.5 Acento — "Amber" (nutrição e destaques pontuais)

| Token              | Hex       | Uso                              |
| ------------------ | --------- | -------------------------------- |
| `color-accent-50`  | `#FFF4DF` | Fundo leve de aviso              |
| `color-accent-300` | `#E7B95D` | Ícones de atenção                |
| `color-accent-500` | `#B87916` | **Nutrição / warning**           |
| `color-accent-700` | `#76500D` | Texto sobre fundo accent-50      |

### 1.6 Semânticas

| Token           | Hex                               | Uso                                 |
| --------------- | --------------------------------- | ----------------------------------- |
| `color-success` | `color-secondary-500` `#34786F`   | Confirmações, metas atingidas       |
| `color-warning` | `color-accent-500` `#B87916`      | Atenção leve (ex: hidratação baixa) |
| `color-error`   | `#A8462F` (clay-red, dessaturado) | Erros de formulário, falhas de sync |
| `color-info`    | `#3579A8` (blue)                  | Mensagens neutras do sistema        |

### 1.7 Categorias de Hábito (usadas em ícones, tags e gráficos — nunca no texto corrido)

| Categoria  | Token                 | Hex                           |
| ---------- | --------------------- | ----------------------------- |
| Força      | `color-cat-strength`  | `#A83F26` (primary-600)       |
| Mobilidade | `color-cat-mobility`  | `#34786F` (secondary-500)     |
| Hidratação | `color-cat-hydration` | `#3579A8` (blue)              |
| Sono       | `color-cat-sleep`     | `#66568D` (violet)            |
| Nutrição   | `color-cat-nutrition` | `#B87916` (accent-500)        |
| Cardio     | `color-cat-cardio`    | `#D85C3B` (coral)              |

### 1.8 Aplicação (light mode)

| Papel             | Token                                                  |
| ----------------- | ------------------------------------------------------ |
| `bg-page`         | `color-neutral-0`                                      |
| `bg-surface`      | `color-neutral-50`                                     |
| `bg-card`         | `#FFFFFF` (superfície elevada)                         |
| `border-default`  | `color-neutral-200`                                    |
| `border-strong`   | `color-neutral-300`                                    |
| `text-primary`    | `color-neutral-900`                                    |
| `text-secondary`  | `color-neutral-600`                                    |
| `text-muted`      | `color-neutral-400`                                    |
| `text-on-primary` | `color-neutral-0` (texto sobre botão primary-500)      |
| `icon-default`    | `color-neutral-500`                                    |

### 1.9 Racional de Design — por que esta paleta

**Por que neutros frios com coral, teal e âmbar?**
Neutros frios dão clareza de painel e se conectam com ferramentas de treino. Coral traz energia para ações, teal representa recuperação e âmbar destaca nutrição. A paleta evita tanto a estética de produtos naturais quanto o neon que pode transformar progresso em cobrança.

**Por que coral como cor de marca, e não um verde dominante?**
Coral conecta com energia e movimento. Teal fica reservado para recuperação, mobilidade e sucesso; âmbar destaca nutrição. As categorias têm acentos próprios para diferenciar treino e hábitos sem depender de uma cor única de "saúde".

**Por que 10 estágios por família em vez de 5?**
Uma escala de neutros frios mantém a leitura clara e dá contraste aos acentos de categoria. Os níveis distinguem fundo (50–100), estados interativos (300–500) e texto (700–900).

**Por que uma cor dedicada por categoria de hábito (seção 1.7)?**
O motor de recomendação (Fase 8) precisa comunicar rapidamente "que tipo" de sugestão está sendo feita, antes mesmo do usuário ler o texto — reconhecimento visual reduz esforço cognitivo (princípio de UX do briefing). Cor por categoria também é o que permite ao gráfico de Analytics (seção 6.3 da Fase 1, "visão geral de equilíbrio") ser lido em segundos. Essas cores são deliberadamente restritas a contextos de dado/categorização — nunca usadas como cor de texto corrido, para não competir com a paleta funcional (primária/neutra).

**Por que o cuidado extra com contraste (WCAG AA)?**
Combinações de texto e fundo precisam ser verificadas para manter contraste WCAG AA. Tons escuros da paleta são usados para texto; cores de categoria identificam dados e ícones.

---

## 2. Dark Mode (preparado, não implementado na v1)

Estratégia: inversão de elevação com neutros frios, mantendo coral, teal e âmbar em tons ajustados para contraste.

| Papel                       | Token light         | Token dark                                             |
| --------------------------- | ------------------- | ------------------------------------------------------ |
| `bg-page`                   | `#F8F9FA`           | `#171D24`                                              |
| `bg-surface`                | `#F0F2F4`           | `#252E38`                                              |
| `bg-card`                   | `#FFFFFF`           | `#303B47`                                              |
| `border-default`            | `color-neutral-200` | `#3A322A`                                              |
| `text-primary`              | `color-neutral-900` | `#F2ECE1`                                              |
| `text-secondary`            | `color-neutral-600` | `#C9B99C`                                              |
| `color-primary-500` (marca) | `#C65332`           | `#EBAF9A` (mais claro, para contraste em fundo escuro) |
| `color-secondary-500`       | `#34786F`           | `#80B8AF`                                              |

**Racional:** manter níveis de elevação distintos e clarear os acentos de marca para preservar contraste em fundos escuros. O tema escuro continua planejado, ainda sem implementação.

---

## 3. Typography Tokens

### 3.1 Famílias

| Token                  | Família              | Uso                                                                                       |
| ---------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| `font-display`         | **Inter Semibold** | Títulos, headlines, saudação do dashboard, números de destaque (streak, métricas grandes) |
| `font-body`            | **Inter**            | Corpo de texto, labels, botões, navegação, formulários                                    |
| `font-mono` (opcional) | JetBrains Mono       | Dados técnicos/debug (não usado em produção visível)                                      |

**Justificativa de UX:** Inter mantém os títulos compactos e legíveis, com uma hierarquia visual mais próxima de ferramentas de treino e painéis de atividade.

**Por que serifada nos títulos, contrariando a maioria dos apps mobile?**
Títulos e números usam a mesma sans-serif para que listas, métricas e ações tenham uma linguagem visual consistente em todas as telas.

**Por que Inter e não outra grotesca (ex: Manrope, sugerida como alternativa no briefing)?**
Ambas cumpririam o papel; Inter foi escolhida por ter otimização específica para telas (hinting em tamanhos pequenos) e uma família de pesos mais completa, importante para diferenciar hierarquia (label 500 vs. body 400) sem depender de tamanho de fonte como único sinal — o que ajuda usuários com baixa acuidade visual a diferenciar níveis de informação mesmo em zoom.

**Por que números de destaque (`type-numeric-lg`) usam a serifada, e não uma fonte "display" numérica?**
Métricas como sequência, XP e atividades concluídas usam o mesmo sistema tipográfico do restante do painel para comunicar progresso sem criar cobrança.

### 3.2 Escala Tipográfica (mobile-first, `rem`, base 16px)

| Token             | Tamanho          | Line-height | Peso | Família          | Uso                                                           |
| ----------------- | ---------------- | ----------- | ---- | ---------------- | ------------------------------------------------------------- |
| `type-display-lg` | 2.5rem / 40px    | 1.1         | 600  | Inter            | Hero / saudação principal (desktop)                           |
| `type-display-md` | 2rem / 32px      | 1.15        | 600  | Inter            | Saudação (mobile), títulos de página                          |
| `type-display-sm` | 1.5rem / 24px    | 1.2         | 600  | Inter            | Títulos de seção, headline de card grande                     |
| `type-heading-lg` | 1.25rem / 20px   | 1.3         | 600  | Inter            | Títulos de card (Workout Card, Goal Card)                     |
| `type-heading-md` | 1.125rem / 18px  | 1.35        | 600  | Inter            | Subtítulos                                                    |
| `type-heading-sm` | 1rem / 16px      | 1.4         | 600  | Inter            | Títulos de componentes pequenos                               |
| `type-body-lg`    | 1rem / 16px      | 1.6         | 400  | Inter            | Corpo de texto principal                                      |
| `type-body-md`    | 0.875rem / 14px  | 1.55        | 400  | Inter            | Corpo secundário, descrições                                  |
| `type-body-sm`    | 0.75rem / 12px   | 1.5         | 400  | Inter            | Legendas, metadados                                           |
| `type-label`      | 0.8125rem / 13px | 1.4         | 500  | Inter            | Labels de formulário, tabs                                    |
| `type-caption`    | 0.6875rem / 11px | 1.4         | 500  | Inter            | Timestamps, tags pequenas (uppercase + letter-spacing 0.04em) |
| `type-numeric-lg` | 2.25rem / 36px   | 1           | 700  | Inter            | Números de destaque (XP e atividades)                         |
| `type-numeric-md` | 1.5rem / 24px    | 1.1         | 500  | Inter            | Números secundários em métricas                               |

**Desktop (≥1024px):** `type-display-lg` sobe para 3rem/48px; `type-display-md` para 2.25rem/36px. Demais tamanhos permanecem estáveis (Inter já otimizada para leitura em qualquer tela).

---

## 4. Spacing Tokens

Escala base **4px**, progressão quase-geométrica para cobrir microespaçamento (ícone+texto) e macroespaçamento (seções):

| Token      | Valor |
| ---------- | ----- |
| `space-2`  | 2px   |
| `space-4`  | 4px   |
| `space-8`  | 8px   |
| `space-12` | 12px  |
| `space-16` | 16px  |
| `space-20` | 20px  |
| `space-24` | 24px  |
| `space-32` | 32px  |
| `space-40` | 40px  |
| `space-48` | 48px  |
| `space-64` | 64px  |
| `space-80` | 80px  |
| `space-96` | 96px  |

**Convenções de uso:**

- Padding interno de card: `space-16` (mobile) / `space-24` (desktop)
- Gap entre elementos de um grupo (ícone+label): `space-8`
- Gap entre cards em uma grid: `space-16`
- Margem entre seções do dashboard: `space-32` / `space-48`

**Racional:** a base 4px (em vez de 8px, comum em outros sistemas) foi escolhida porque o Dashboard do ROOT é intencionalmente denso em informação (streak, recomendação, treino do dia, métricas, gráfico, objetivos, atividade — seção "Dashboard" do briefing). Uma escala mais granular permite ajustar micro-espaçamentos (ex: ícone+label a 8px) sem "sobrar" espaço em componentes compactos como Chips e Badges, mantendo a densidade sob controle sem parecer apertado. Os saltos maiores (64/80/96) existem especificamente para separar seções inteiras do Dashboard, criando pausas visuais que comunicam calma mesmo em uma tela com muito conteúdo — respiro é tratado como token de primeira classe, não como sobra.

---

## 5. Radius Tokens

Bordas moderadamente arredondadas para manter os componentes confortáveis e firmes, sem formas excessivamente orgânicas:

| Token         | Valor | Uso                                                          |
| ------------- | ----- | ------------------------------------------------------------ |
| `radius-sm`   | 8px   | Inputs, chips, botões pequenos                               |
| `radius-md`   | 12px  | Botões padrão, badges                                        |
| `radius-lg`   | 16px  | Cards padrão                                                 |
| `radius-xl`   | 24px  | Cards de destaque (Recommendation Card), Bottom Sheet (topo) |
| `radius-2xl`  | 32px  | Modais grandes, ilustrações contidas                         |
| `radius-full` | 999px | Avatares, FAB, Switch, Progress circular                     |

**Racional:** cantos de 8–24px diferenciam campos, botões e cards mantendo uma apresentação atual. O raio de 32px fica reservado a modais grandes.

---

## 6. Shadow Tokens (elevação visual)

Sombras suaves e neutras para distinguir superfícies sem competir com dados ou ações:

| Token          | Valor (CSS)                          | Uso                                                    |
| -------------- | ------------------------------------ | ------------------------------------------------------ |
| `shadow-xs`    | `0 1px 2px rgba(54, 46, 36, 0.06)`   | Botões, inputs em foco                                 |
| `shadow-sm`    | `0 2px 6px rgba(54, 46, 36, 0.08)`   | Cards em repouso                                       |
| `shadow-md`    | `0 6px 16px rgba(54, 46, 36, 0.10)`  | Cards em hover/destaque, dropdowns                     |
| `shadow-lg`    | `0 12px 32px rgba(54, 46, 36, 0.14)` | Bottom Sheet, Modal                                    |
| `shadow-focus` | `0 0 0 3px rgba(179, 94, 52, 0.25)`  | Anel de foco em elementos interativos (acessibilidade) |

**Racional:** as sombras usam o neutro principal em baixa opacidade, mantendo hierarquia visual sem aparência pesada.

---

## 7. Motion Tokens

Movimento calmo e funcional — nunca "bounce" exagerado ou efeitos chamativos:

| Token                 | Valor                              | Uso                                                       |
| --------------------- | ---------------------------------- | --------------------------------------------------------- |
| `duration-instant`    | 100ms                              | Feedback de tap (scale de botão)                          |
| `duration-fast`       | 150ms                              | Hover, troca de ícone                                     |
| `duration-base`       | 250ms                              | Transições padrão (abrir card, trocar tab)                |
| `duration-slow`       | 400ms                              | Bottom Sheet, Modal (entrada)                             |
| `duration-deliberate` | 600ms                              | Animações de celebração (meta atingida) — uso raro        |
| `ease-standard`       | `cubic-bezier(0.4, 0, 0.2, 1)`     | Transições gerais                                         |
| `ease-out-soft`       | `cubic-bezier(0, 0, 0.2, 1)`       | Entrada de elementos (aparecer)                           |
| `ease-in-soft`        | `cubic-bezier(0.4, 0, 1, 1)`       | Saída de elementos (desaparecer)                          |
| `ease-emphasis`       | `cubic-bezier(0.34, 1.1, 0.64, 1)` | Único caso com leve overshoot — celebração de meta/streak |

**Princípio:** nenhuma animação de UI comum (navegação, cards, toasts) deve ultrapassar 400ms. Overshoot/spring é reservado exclusivamente para momentos de celebração, para não comprometer a sensação de calma.

**Racional:** o teto de 400ms existe porque animações longas em navegação cotidiana (abrir um card, trocar de aba) acumulam fricção percebida com o uso repetido — o usuário sente o app "lento" mesmo que a curva seja bonita. Reservar overshoot (`ease-emphasis`) só para celebração de meta/streak é uma decisão de hierarquia emocional: se tudo balança e "ricocheteia", nada parece especial; ao restringir esse efeito a um único momento, ele carrega significado (conquista) em vez de virar ruído visual — coerente com o princípio "progresso visível, mas não ansiogênico" definido na Fase 1.

---

## 8. Opacity Tokens

| Token                     | Valor | Uso                                          |
| ------------------------- | ----- | -------------------------------------------- |
| `opacity-disabled`        | 0.4   | Elementos desabilitados                      |
| `opacity-hover-overlay`   | 0.06  | Overlay em hover sobre superfícies           |
| `opacity-pressed-overlay` | 0.12  | Overlay em pressed                           |
| `opacity-scrim`           | 0.5   | Fundo escurecido atrás de Modal/Bottom Sheet |
| `opacity-skeleton`        | 0.08  | Base de loading skeleton (sobre neutral-900) |

**Racional:** o scrim de fundo usa 0.5 (50%) em vez do 0.7-0.8 comum em outros sistemas — um scrim muito escuro cria uma transição abrupta e "pesada" ao abrir um Modal/Bottom Sheet, contrária à sensação de leveza do briefing. 50% ainda cumpre a função funcional (foco no conteúdo do modal, escurecimento perceptível) sem o efeito dramático de um blackout quase total.

---

## 9. Elevation (z-index scale)

| Token            | Valor | Uso                            |
| ---------------- | ----- | ------------------------------ |
| `z-base`         | 0     | Conteúdo padrão                |
| `z-sticky`       | 10    | Header/Navbar fixos            |
| `z-dropdown`     | 20    | Selects, menus de contexto     |
| `z-overlay`      | 30    | Scrim de fundo                 |
| `z-drawer`       | 40    | Drawer lateral                 |
| `z-bottom-sheet` | 45    | Bottom Sheet                   |
| `z-modal`        | 50    | Modal                          |
| `z-toast`        | 60    | Toast / Snackbar               |
| `z-tooltip`      | 70    | Tooltip (sempre acima de tudo) |

**Racional:** a escala usa saltos de 10 (em vez de 1, 2, 3...) deliberadamente, para deixar espaço de inserção futura entre camadas sem precisar renumerar tudo — decisão de arquitetura de longo prazo, já que o app crescerá em features (Fase 1, seção "Sitemap") e cada nova feature pode precisar de uma camada intermediária (ex: um segundo nível de overlay dentro de um Drawer).

---

## 10. Breakpoints

| Token        | Faixa         | Dispositivo alvo                   |
| ------------ | ------------- | ---------------------------------- |
| `bp-mobile`  | 0 – 599px     | Smartphones                        |
| `bp-tablet`  | 600 – 1023px  | Tablets, mobile grande em paisagem |
| `bp-desktop` | 1024 – 1439px | Notebooks, desktops padrão         |
| `bp-wide`    | ≥ 1440px      | Monitores grandes                  |

**Racional:** os cortes seguem os pontos de inflexão reais de uso de fitness apps (majoritariamente mobile, com uma minoria relevante em tablet durante treino em casa e desktop para consulta de analytics/planejamento) em vez de seguir cegamente breakpoints genéricos de framework CSS. O corte em 1024px (não 960 ou 992, comuns em outros sistemas) reserva a faixa 768-1023 inteira para tablets em retrato, onde a Bottom Navigation mobile ainda faz mais sentido do que uma Sidebar desktop.

---

## 11. Grid & Container

| Breakpoint | Colunas | Gutter | Margem lateral      | Container máx. |
| ---------- | ------- | ------ | ------------------- | -------------- |
| Mobile     | 4       | 16px   | 16px                | 100%           |
| Tablet     | 8       | 20px   | 32px                | 100%           |
| Desktop    | 12      | 24px   | 48px                | 1120px         |
| Wide       | 12      | 24px   | auto (centralizado) | 1280px         |

**Regra de composição:** Dashboard e telas de conteúdo denso usam a grid completa; telas de foco único (onboarding, execução de treino) usam container reduzido (max 480px) mesmo em desktop, para manter leitura vertical e baixo esforço cognitivo.

---

## 12. Iconografia (tokens de uso)

| Token               | Valor | Uso                                                           |
| ------------------- | ----- | ------------------------------------------------------------- |
| `icon-size-sm`      | 16px  | Inline com texto pequeno                                      |
| `icon-size-md`      | 20px  | Padrão em botões, listas                                      |
| `icon-size-lg`      | 24px  | Navegação (Bottom Nav, headers)                               |
| `icon-size-xl`      | 32px  | Empty states, destaque                                        |
| `icon-stroke-width` | 1.5px | Espessura padrão (outline, consistente com estilo hand-drawn) |

---

## Resumo de Governança

- Nenhuma cor, espaçamento, radius ou sombra deve ser escrito como valor literal em componentes — sempre via token.
- Qualquer novo token proposto passa por esta documentação antes de ser usado em tela.
- Dark mode já possui mapeamento definido (seção 2), mas fica fora do escopo de implementação da v1.
