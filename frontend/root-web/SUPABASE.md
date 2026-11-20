# Configurar o Supabase

O app usa o projeto `vcohnukfppsbvcicjfvl`. Para habilitar autenticação:

1. A URL e a chave **publishable** do projeto já estão em `src/environments/environment.ts`. Essa chave pode ser usada no navegador; nunca coloque ali uma chave `service_role` ou `secret`.
2. No SQL Editor do projeto, execute `supabase/migrations/202611170001_initial_profiles.sql`.
3. Em **Authentication → URL Configuration**, defina a URL local (`http://localhost:4200`) como Site URL durante o desenvolvimento e permita esse endereço em Redirect URLs.

A migration cria a tabela de perfis, ativa RLS e limita leitura e edição ao usuário autenticado. As atividades, refeições e treinos ainda ficam no armazenamento local neste primeiro passo; a migração desses dados para tabelas com RLS é uma etapa separada. O client web renova e persiste sessões no navegador; middleware e `@supabase/ssr` são específicos de apps Next.js e não são usados neste Angular SPA.
