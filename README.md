# ROOT

ROOT é um app de bem-estar que combina hábitos saudáveis, treinos de academia, nutrição e gamificação. O usuário pode montar fichas, registrar refeições e atividades, acompanhar o progresso e colecionar cartas de treino.

## Requisitos

- Node.js `22.22.3` (versão em `.nvmrc`)
- npm `11.13.0`

## Desenvolvimento local

Na raiz do repositório:

```bash
cd frontend/root-web
npm ci
npm start
```

Acesse `http://localhost:4200`. O Angular recarrega o app quando os arquivos mudam.

## Build e publicação

```bash
cd frontend/root-web
npm run build
```

O build estático é gerado em `frontend/root-web/dist/root-web/browser`. No Cloudflare Pages, use `frontend/root-web` como diretório raiz, `npm run build` como comando e `dist/root-web/browser` como pasta de saída. A publicação de produção deve acompanhar a branch `main`.

## Supabase

A configuração do client e os passos da migration estão em [SUPABASE.md](frontend/root-web/SUPABASE.md). A autenticação usa o Supabase; atividades, treinos e refeições ainda são salvos localmente no navegador.

## Comandos úteis

```bash
npm run watch  # build de desenvolvimento contínuo
npm test       # testes unitários
npm run lint   # análise estática
```

## Estrutura

- `frontend/root-web/`: app Angular
- `frontend/root-web/src/app/core/`: autenticação, armazenamento, interações e recomendações
- `frontend/root-web/src/app/features/`: treinos, nutrição, perfil, recomendações e painel
- `docs/product/`: documentação de produto e design

## Licença

Este projeto está licenciado sob a licença MIT.
