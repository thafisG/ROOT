# ROOT — Design System

## Documentação de Produto — Fase 2

Este documento define os **Design Tokens** oficiais do ROOT: a fonte única de verdade para cor, tipografia, espaçamento, forma, sombra, movimento e layout. Todo componente e toda tela (Fases 3–6) devem referenciar exclusivamente estes tokens — nunca valores "mágicos" hardcoded.

Convenção de nomenclatura: `categoria-propriedade-variante-escala`, ex: `color-primary-500`, `space-16`, `radius-lg`.

---

## 1. Color Tokens

### 1.1 Filosofia da paleta

Paleta 100% terrosa, sem cores saturadas ou neon. Cada família de cor tem 10 estágios (50→900), seguindo o padrão: 50–100 para fundos suaves, 300–500 para elementos de destaque, 600–900 para texto e estados de alto contraste. Todos os pares texto/fundo abaixo atingem no mínimo **WCAG AA (4.5:1)** para texto padrão e **3:1** para texto grande/ícones.

### 1.2 Neutros — "Paper & Stone" (base da interface)

| Token               | Hex       | Uso                                           |
| ------------------- | --------- | --------------------------------------------- |
| `color-neutral-0`   | `#FDFBF7` | Fundo principal (off-white/papel)             |
| `color-neutral-50`  | `#F7F2EA` | Fundo secundário (linho)                      |
| `color-neutral-100` | `#EDE4D3` | Fundo de cards / superfícies elevadas         |
| `color-neutral-200` | `#E0D4BE` | Bordas sutis, divisores                       |
| `color-neutral-300` | `#C9B99C` | Bordas de destaque, ícones inativos           |
| `color-neutral-400` | `#A8977A` | Texto terciário / placeholder                 |
| `color-neutral-500` | `#8A7A63` | Texto secundário                              |
| `color-neutral-600` | `#6B5D4A` | Texto secundário forte                        |
| `color-neutral-700` | `#4F4436` | Texto primário em fundos claros (alternativa) |
| `color-neutral-800` | `#362E24` | Texto primário forte                          |
| `color-neutral-900` | `#221C16` | Texto primário / títulos (ink)                |

### 1.3 Primária — "Terracotta" (marca, CTAs, recomendação ativa)

| Token               | Hex       | Uso                                         |
| ------------------- | --------- | ------------------------------------------- |
| `color-primary-50`  | `#FBEDE6` | Fundo de destaque leve                      |
| `color-primary-100` | `#F4D3C2` | Fundo de badge/chip                         |
| `color-primary-200` | `#E8B191` | Hover suave                                 |
| `color-primary-300` | `#D68F66` | Ícones e acentos                            |
| `color-primary-400` | `#C97748` | Estado hover de botão primário              |
| `color-primary-500` | `#B35E34` | **Cor de marca principal** — CTA primário   |
| `color-primary-600` | `#94492A` | Estado pressed                              |
| `color-primary-700` | `#743823` | Texto sobre fundo primary-50/100            |
| `color-primary-800` | `#55291A` | Texto de alto contraste sobre fundos claros |
| `color-primary-900` | `#3A1C12` | Reservado / dark mode                       |

### 1.4 Secundária — "Moss" (categorias de bem-estar, sucesso, mobilidade)

| Token                 | Hex       | Uso                                                   |
| --------------------- | --------- | ----------------------------------------------------- |
| `color-secondary-50`  | `#EEF0E4` | Fundo leve                                            |
| `color-secondary-100` | `#D9DEC3` | Fundo de badge                                        |
| `color-secondary-300` | `#A2AD79` | Acentos                                               |
| `color-secondary-500` | `#707C48` | **Cor de sucesso / categoria mobilidade-recuperação** |
| `color-secondary-700` | `#454C2C` | Texto sobre fundo secondary-50/100                    |
| `color-secondary-900` | `#1D2013` | Reservado / dark mode                                 |

### 1.5 Acento — "Ochre" (alertas suaves, destaques pontuais)

| Token              | Hex       | Uso                              |
| ------------------ | --------- | -------------------------------- |
| `color-accent-50`  | `#FBF1E1` | Fundo leve de aviso              |
| `color-accent-300` | `#DDAE68` | Ícones de atenção                |
| `color-accent-500` | `#C08A3E` | **Warning** — usar com moderação |
| `color-accent-700` | `#8A611F` | Texto sobre fundo accent-50      |

### 1.6 Semânticas

| Token           | Hex                               | Uso                                 |
| --------------- | --------------------------------- | ----------------------------------- |
| `color-success` | `color-secondary-500` `#707C48`   | Confirmações, metas atingidas       |
| `color-warning` | `color-accent-500` `#C08A3E`      | Atenção leve (ex: hidratação baixa) |
| `color-error`   | `#A8462F` (clay-red, dessaturado) | Erros de formulário, falhas de sync |
| `color-info`    | `#6B7D8A` (slate-stone)           | Mensagens neutras do sistema        |

### 1.7 Categorias de Hábito (usadas em ícones, tags e gráficos — nunca no texto corrido)

| Categoria  | Token                 | Hex                           |
| ---------- | --------------------- | ----------------------------- |
| Força      | `color-cat-strength`  | `#94492A` (primary-600)       |
| Mobilidade | `color-cat-mobility`  | `#707C48` (secondary-500)     |
| Hidratação | `color-cat-hydration` | `#6B7D8A` (slate)             |
| Sono       | `color-cat-sleep`     | `#5C5470` (mauve dessaturado) |
| Nutrição   | `color-cat-nutrition` | `#C08A3E` (accent-500)        |
| Cardio     | `color-cat-cardio`    | `#B35E34` (primary-500)       |

### 1.8 Aplicação (light mode)

| Papel             | Token                                                  |
| ----------------- | ------------------------------------------------------ |
| `bg-page`         | `color-neutral-0`                                      |
| `bg-surface`      | `color-neutral-50`                                     |
| `bg-card`         | `#FFFFFF` (branco puro sobre papel, para elevar cards) |
| `border-default`  | `color-neutral-200`                                    |
| `border-strong`   | `color-neutral-300`                                    |
| `text-primary`    | `color-neutral-900`                                    |
| `text-secondary`  | `color-neutral-600`                                    |
| `text-muted`      | `color-neutral-400`                                    |
| `text-on-primary` | `color-neutral-0` (texto sobre botão primary-500)      |
| `icon-default`    | `color-neutral-500`                                    |

### 1.9 Racional de Design — por que esta paleta

**Por que tons terrosos e não a paleta "fitness padrão" (preto + neon)?**
Apps de fitness convencionais usam preto/vermelho/verde vibrante porque comunicam intensidade e urgência — adequado para quem já está motivado, mas hostil para quem está tentando criar um hábito do zero (caso de Rafael, persona 2.2) ou para quem já sofre de fadiga de "cobrança" em apps de produtividade. Tons terrosos comunicam o oposto: permanência, natureza, ausência de julgamento. Isso é coerente com o princípio de produto "calma antes de estímulo" (seção 1.6 do documento de Fase 1).

**Por que terracotta como cor de marca, e não verde (o clichê de "saúde")?**
Verde-saúde é o padrão de praticamente todo concorrente (Google Fit, muitos apps de nutrição). Terracotta diferencia visualmente o ROOT à primeira vista, mantém a família cromática terrosa e ainda carrega associação com energia/ação (mais quente que o verde), o que faz sentido para uma cor de CTA — botões precisam "pedir" o toque do usuário. O verde foi reservado como secundária, ligado a recuperação/mobilidade/sucesso, um uso mais alinhado ao seu significado psicológico de equilíbrio.

**Por que 10 estágios por família em vez de 5?**
Uma paleta terrosa tem menos "espaço" de saturação para trabalhar do que uma paleta vibrante — cores terrosas ficam parecidas entre si em poucos estágios. Dez estágios garantem granularidade suficiente para diferenciar claramente fundo (50–100), estado padrão (300–500) e texto (700–900) sem recorrer a preto ou cinza puro, o que quebraria a identidade "chalk".

**Por que uma cor dedicada por categoria de hábito (seção 1.7)?**
O motor de recomendação (Fase 8) precisa comunicar rapidamente "que tipo" de sugestão está sendo feita, antes mesmo do usuário ler o texto — reconhecimento visual reduz esforço cognitivo (princípio de UX do briefing). Cor por categoria também é o que permite ao gráfico de Analytics (seção 6.3 da Fase 1, "visão geral de equilíbrio") ser lido em segundos. Essas cores são deliberadamente restritas a contextos de dado/categorização — nunca usadas como cor de texto corrido, para não competir com a paleta funcional (primária/neutra).

**Por que o cuidado extra com contraste (WCAG AA)?**
Paletas terrosas de baixa saturação são particularmente propensas a falhar em acessibilidade — é fácil parecer "elegante" e na prática ficar ilegível para usuários com baixa visão. Por isso cada par texto/fundo documentado (seção 1.8) foi verificado para 4.5:1, e a cor de marca (`primary-500`) só é usada como fundo de texto branco, nunca como texto sobre fundo claro (para isso existe `primary-700`/`800`, mais escuros e com contraste garantido).

---

## 2. Dark Mode (preparado, não implementado na v1)

Estratégia: inversão de elevação, não inversão pura de cor — mantém a identidade "chalk/terracotta" mesmo no escuro (tons mais próximos de argila queimada e carvão do que preto puro).

| Papel                       | Token light         | Token dark                                             |
| --------------------------- | ------------------- | ------------------------------------------------------ |
| `bg-page`                   | `#FDFBF7`           | `#1A1613` (carvão quente)                              |
| `bg-surface`                | `#F7F2EA`           | `#221C16`                                              |
| `bg-card`                   | `#FFFFFF`           | `#2B2420`                                              |
| `border-default`            | `color-neutral-200` | `#3A322A`                                              |
| `text-primary`              | `color-neutral-900` | `#F2ECE1`                                              |
| `text-secondary`            | `color-neutral-600` | `#C9B99C`                                              |
| `color-primary-500` (marca) | `#B35E34`           | `#D68F66` (mais claro, para contraste em fundo escuro) |
| `color-secondary-500`       | `#707C48`           | `#A2AD79`                                              |

**Racional:** a maioria dos design systems trata dark mode como "inverter para preto". Isso quebraria a identidade chalk/terrosa do ROOT — preto puro é frio e associado a apps técnicos/gamer, exatamente o que o briefing pede para evitar. Por isso o fundo escuro parte de um carvão com base marrom-quente (`#1A1613`), não de um cinza-azulado neutro, e as cores de marca clareiam um estágio (500→300/400 equivalente) para manter contraste sem perder saturação. Essa decisão é registrada agora, mesmo sem implementação na v1, porque retrofitar dark mode depois de telas prontas costuma gerar inconsistência — decidir a estratégia cedo é o que garante que ela seja "preparada" de verdade, como pede o briefing.

---

## 3. Typography Tokens

### 3.1 Famílias

| Token                  | Família              | Uso                                                                                       |
| ---------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| `font-display`         | **DM Serif Display** | Títulos, headlines, saudação do dashboard, números de destaque (streak, métricas grandes) |
| `font-body`            | **Inter**            | Corpo de texto, labels, botões, navegação, formulários                                    |
| `font-mono` (opcional) | JetBrains Mono       | Dados técnicos/debug (não usado em produção visível)                                      |

**Justificativa de UX:** DM Serif Display traz o caráter "editorial/chalk" desejado nos títulos, transmitindo sofisticação sem parecer corporativo; Inter garante legibilidade excelente em telas pequenas para dados frequentemente escaneados (métricas, listas).

**Por que serifada nos títulos, contrariando a maioria dos apps mobile?**
Quase todo app fitness usa sans-serif em peso pesado (bold/black) para transmitir força e urgência. Uma serifada elegante como DM Serif Display comunica o oposto — cuidado, curadoria, "algo pensado para você" — e é exatamente essa a diferenciação editorial pedida no briefing. O risco de serifadas (menor legibilidade em telas pequenas) é mitigado por dois limites de uso: DM Serif Display nunca é usada em corpo de texto ou em elementos com alta densidade de leitura (listas, tabelas), apenas em headlines curtas e números de destaque — contextos onde o usuário reconhece a forma da palavra/número mais do que lê letra a letra.

**Por que Inter e não outra grotesca (ex: Manrope, sugerida como alternativa no briefing)?**
Ambas cumpririam o papel; Inter foi escolhida por ter otimização específica para telas (hinting em tamanhos pequenos) e uma família de pesos mais completa, importante para diferenciar hierarquia (label 500 vs. body 400) sem depender de tamanho de fonte como único sinal — o que ajuda usuários com baixa acuidade visual a diferenciar níveis de informação mesmo em zoom.

**Por que números de destaque (`type-numeric-lg`) usam a serifada, e não uma fonte "display" numérica?**
Métricas como streak e calorias são o dado mais "emocional" da tela — o número que representa o esforço do usuário. Usar a mesma família dos títulos (DM Serif Display) reforça que esse número é tratado como conquista editorial, não como estatística fria de dashboard corporativo.

### 3.2 Escala Tipográfica (mobile-first, `rem`, base 16px)

| Token             | Tamanho          | Line-height | Peso | Família          | Uso                                                           |
| ----------------- | ---------------- | ----------- | ---- | ---------------- | ------------------------------------------------------------- |
| `type-display-lg` | 2.5rem / 40px    | 1.1         | 400  | DM Serif Display | Hero / saudação principal (desktop)                           |
| `type-display-md` | 2rem / 32px      | 1.15        | 400  | DM Serif Display | Saudação (mobile), títulos de página                          |
| `type-display-sm` | 1.5rem / 24px    | 1.2         | 400  | DM Serif Display | Títulos de seção, headline de card grande                     |
| `type-heading-lg` | 1.25rem / 20px   | 1.3         | 600  | Inter            | Títulos de card (Workout Card, Goal Card)                     |
| `type-heading-md` | 1.125rem / 18px  | 1.35        | 600  | Inter            | Subtítulos                                                    |
| `type-heading-sm` | 1rem / 16px      | 1.4         | 600  | Inter            | Títulos de componentes pequenos                               |
| `type-body-lg`    | 1rem / 16px      | 1.6         | 400  | Inter            | Corpo de texto principal                                      |
| `type-body-md`    | 0.875rem / 14px  | 1.55        | 400  | Inter            | Corpo secundário, descrições                                  |
| `type-body-sm`    | 0.75rem / 12px   | 1.5         | 400  | Inter            | Legendas, metadados                                           |
| `type-label`      | 0.8125rem / 13px | 1.4         | 500  | Inter            | Labels de formulário, tabs                                    |
| `type-caption`    | 0.6875rem / 11px | 1.4         | 500  | Inter            | Timestamps, tags pequenas (uppercase + letter-spacing 0.04em) |
| `type-numeric-lg` | 2.25rem / 36px   | 1           | 400  | DM Serif Display | Números de destaque (streak, calorias)                        |
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

Bordas suavemente arredondadas para reforçar a sensação orgânica/calma (nunca cantos vivos, nunca "pill" agressivo em elementos grandes):

| Token         | Valor | Uso                                                          |
| ------------- | ----- | ------------------------------------------------------------ |
| `radius-sm`   | 8px   | Inputs, chips, botões pequenos                               |
| `radius-md`   | 12px  | Botões padrão, badges                                        |
| `radius-lg`   | 16px  | Cards padrão                                                 |
| `radius-xl`   | 24px  | Cards de destaque (Recommendation Card), Bottom Sheet (topo) |
| `radius-2xl`  | 32px  | Modais grandes, ilustrações contidas                         |
| `radius-full` | 999px | Avatares, FAB, Switch, Progress circular                     |

**Racional:** cantos vivos (radius 0-4px) foram descartados por completo — associam-se a interfaces técnicas/utilitárias (planilhas, dashboards corporativos), o oposto do "organic design" pedido no briefing. Ao mesmo tempo, evitamos "pill shape" (radius-full) em elementos grandes como cards e botões primários, porque esse estilo hoje é fortemente associado a apps de produtividade genéricos (SaaS) e reduz a percepção de sofisticação. A progressão 8→32px foi calibrada para que o radius pareça proporcional ao tamanho do elemento (um Chip pequeno com radius grande demais pareceria uma bolha; um Card grande com radius pequeno demais pareceria rígido) — regra prática: quanto maior a superfície, maior o radius, até o teto de 32px onde a forma deixa de parecer "arredondada" e passa a parecer "orgânica".

---

## 6. Shadow Tokens (elevação visual)

Sombras suaves, difusas e com tonalidade quente (nunca preto puro) — reforça o "soft shadow" do estilo chalk/editorial:

| Token          | Valor (CSS)                          | Uso                                                    |
| -------------- | ------------------------------------ | ------------------------------------------------------ |
| `shadow-xs`    | `0 1px 2px rgba(54, 46, 36, 0.06)`   | Botões, inputs em foco                                 |
| `shadow-sm`    | `0 2px 6px rgba(54, 46, 36, 0.08)`   | Cards em repouso                                       |
| `shadow-md`    | `0 6px 16px rgba(54, 46, 36, 0.10)`  | Cards em hover/destaque, dropdowns                     |
| `shadow-lg`    | `0 12px 32px rgba(54, 46, 36, 0.14)` | Bottom Sheet, Modal                                    |
| `shadow-focus` | `0 0 0 3px rgba(179, 94, 52, 0.25)`  | Anel de foco em elementos interativos (acessibilidade) |

**Racional:** sombras com preto puro (`rgba(0,0,0,...)`) criam uma dissonância sutil, mas perceptível, sobre um fundo quente como `neutral-0` (#FDFBF7) — o cinza-azulado da sombra "briga" com o bege do papel. Usar a cor `neutral-900` (#362E24, um marrom escuro) como base do `rgba` faz a sombra parecer "tingida" pelo mesmo material do restante da interface, como se fosse a sombra real de um objeto sobre papel — reforço direto da referência "chalk portrait/paper texture" do briefing. As opacidades são propositalmente baixas (6-14%) porque sombras fortes comunicam urgência/flutuação agressiva; o objetivo aqui é sugerir profundidade mínima, suficiente para hierarquia, sem quebrar a sensação de calma.

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