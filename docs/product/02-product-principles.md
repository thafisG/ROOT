# ROOT — Product Principles

## O que são os Product Principles?

Os Product Principles são os princípios fundamentais que orientam todas as decisões do ROOT.

Eles funcionam como uma referência para Product Managers, Designers e Desenvolvedores durante todo o ciclo de evolução do produto.

Sempre que surgir uma dúvida sobre adicionar uma funcionalidade, alterar uma interface ou implementar uma nova regra de negócio, a decisão deve ser validada contra estes princípios.

---

# 1. Recommendation First

A recomendação personalizada é o coração do produto.

O usuário não abre o ROOT apenas para registrar atividades.

Ele abre para descobrir qual é a melhor ação para aquele momento.

Por isso, toda experiência do aplicativo deve priorizar a recomendação antes de qualquer informação secundária.

### Isso significa:

- O Dashboard sempre destaca a recomendação do dia.
- O Recommendation Engine é uma feature central.
- Novas funcionalidades devem complementar o mecanismo de recomendação.

---

# 2. Every Recommendation Must Be Explainable

Nenhuma recomendação pode parecer aleatória.

Sempre que o sistema sugerir alguma atividade, ele deve explicar o motivo daquela recomendação.

Exemplo:

> Você treinou força durante cinco dias consecutivos e ainda não realizou nenhuma sessão de mobilidade nesta semana.

Nunca utilizar mensagens genéricas como:

❌ "Recomendado para você."

Toda recomendação deve responder:

> "Por que estou vendo isso?"

---

# 3. The Product Learns Continuously

O ROOT é um sistema adaptativo.

Cada interação do usuário representa uma oportunidade de aprendizado.

O sistema deve atualizar continuamente seu entendimento sobre os hábitos do usuário.

Exemplos de sinais:

- Treinos iniciados
- Treinos concluídos
- Treinos abandonados
- Hábitos registrados
- Recomendações aceitas
- Recomendações ignoradas
- Frequência de acesso
- Recência das atividades

Toda evolução do Recommendation Engine deve aproveitar esses sinais.

---

# 4. Balance Over Intensity

O objetivo do ROOT não é fazer o usuário treinar mais.

O objetivo é ajudá-lo a construir uma rotina equilibrada.

Uma recomendação deve incentivar comportamentos negligenciados.

Exemplo:

Se um usuário realiza musculação cinco vezes por semana e nunca faz mobilidade, o sistema deve priorizar exercícios complementares.

O sucesso não é definido pelo volume de atividades, mas pelo equilíbrio entre diferentes hábitos.

---

# 5. Calm Before Stimulation

O ROOT deve transmitir tranquilidade.

A interface nunca deve competir pela atenção do usuário.

Evitar:

- excesso de notificações
- cores agressivas
- animações exageradas
- gamificação excessiva
- pressão psicológica

Toda decisão visual deve transmitir:

- calma
- clareza
- acolhimento
- bem-estar

---

# 6. Reduce Cognitive Load

O usuário nunca deve pensar demais para executar uma ação.

Cada tela deve responder rapidamente:

- Onde estou?
- O que devo fazer agora?
- Qual é a próxima ação?

Toda interface deve minimizar esforço cognitivo.

Preferimos:

- poucas opções
- boas hierarquias
- linguagem simples
- ações claras

---

# 7. Progress Without Anxiety

O ROOT acompanha evolução.

Ele nunca pune.

Não utilizaremos elementos que façam o usuário sentir culpa.

Evitar:

- streaks punitivos
- mensagens negativas
- comparações tóxicas

Preferimos incentivar pequenas evoluções contínuas.

O progresso deve ser percebido como uma conquista, nunca como obrigação.

---

# 8. Accessibility Is Mandatory

A acessibilidade faz parte do produto desde o início.

Não será tratada como uma etapa posterior.

Todas as interfaces devem considerar:

- contraste adequado
- navegação por teclado
- leitores de tela
- foco visível
- tamanhos mínimos de toque
- tipografia legível

A acessibilidade é um requisito funcional do ROOT.

---

# 9. Consistency Creates Trust

A confiança nasce da consistência.

Todos os componentes devem seguir o Design System.

Isso inclui:

- cores
- espaçamentos
- tipografia
- componentes
- animações
- nomenclatura

O usuário nunca deve perceber comportamentos diferentes para ações semelhantes.

---

# 10. Build for Evolution

O ROOT será desenvolvido pensando em crescimento.

Nenhuma decisão técnica deve limitar futuras evoluções.

O produto deve permitir facilmente a introdução de:

- Backend
- Sincronização em nuvem
- Machine Learning
- Inteligência Artificial
- Novos algoritmos de recomendação
- Novas categorias de hábitos

A arquitetura deve privilegiar desacoplamento e extensibilidade.

---

# Decision Checklist

Antes de aprovar qualquer funcionalidade, responda às perguntas abaixo.

- A funcionalidade melhora a experiência do usuário?
- Ela fortalece o Recommendation Engine?
- Está alinhada aos princípios do produto?
- É consistente com o Design System?
- Mantém a interface simples?
- É acessível?
- Pode evoluir sem grandes refatorações?
- Gera valor real para o usuário?

Se alguma resposta for "não", a solução deve ser reavaliada.

---

# Nosso Compromisso

O ROOT não pretende ser apenas mais um aplicativo de fitness.

Nosso objetivo é construir uma plataforma capaz de compreender o comportamento humano e incentivar hábitos saudáveis através de recomendações inteligentes, transparentes e respeitosas.

Toda decisão de produto, design e engenharia deve refletir esse compromisso.