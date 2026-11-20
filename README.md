# ROOT

ROOT é um protótipo de bem-estar que ajuda a criar hábitos saudáveis por meio de recomendações e acompanhamento de atividades. O projeto também documenta uma visão futura de integração entre treino, nutrição e apoio profissional.

## Estado atual

A aplicação Angular tem onboarding, painel inicial, recomendações de atividades e registro local de interações. Os dados do protótipo ficam no `localStorage` do navegador, portanto não são sincronizados entre dispositivos.

As rotas de treinos, histórico de recomendações, analytics e perfil ainda exibem páginas de placeholder nesta versão da `main`.

## Requisitos

- Node.js `22.22.3` (versão indicada em `frontend/root-web/.nvmrc`)
- npm `11.13.0`

## Executar localmente

Na raiz do repositório:

```bash
cd frontend/root-web
npm ci
npm start
```

Abra `http://localhost:4200`. O servidor de desenvolvimento recarrega a aplicação quando os arquivos são alterados. Não é necessário configurar variáveis de ambiente para executar o protótipo atual.

## Build de produção

```bash
cd frontend/root-web
npm run build
```

Os arquivos compilados são gerados em `frontend/root-web/dist/root-web`. A compilação não baixa fontes do Google; o navegador ainda pode carregá-las remotamente quando houver conexão.

## Comandos úteis

```bash
npm run watch  # build de desenvolvimento contínuo
npm test       # testes unitários
npm run lint   # análise estática
```

## Estrutura do projeto

- `frontend/root-web/`: aplicação Angular, estilos e configuração de build
- `frontend/root-web/src/app/core/`: serviços de armazenamento, usuário, interação e recomendações
- `docs/product/`: princípios, requisitos, sistema visual e visão do mecanismo de recomendações

## Licença

Este projeto está licenciado sob a licença MIT.
