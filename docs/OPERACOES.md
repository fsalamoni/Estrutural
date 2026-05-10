# Operacoes

## Ambientes

- Producao: projeto Firebase `hocapp-44760`, site Hosting `fsalomone`
- Staging: deve existir como projeto separado antes de endurecimentos de regra e migracoes de dados

## Segredos obrigatorios no GitHub

- `FIREBASE_SERVICE_ACCOUNT`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Variaveis locais obrigatorias

Use `.env.local` com os mesmos valores do app web do Firebase e mantenha `NEXT_PUBLIC_ADMIN_EMAIL` alinhado com o e-mail autorizado nas Rules e no secret do GitHub Actions.

Para staging dedicado, use o projeto `hocapp-staging-44760`, o site `hocapp-staging-44760` e os valores de [.env.staging.example](.env.staging.example). O script `npm run deploy:staging` usa `.env.staging.local` se ele existir e, se o bucket padrao ainda nao existir, publica apenas Hosting e Firestore.

Estado validado de staging: Hosting e Firestore estao ativos. Storage continua bloqueado por infraestrutura porque o bucket padrao nao pode ser criado sem billing no projeto. Auth ainda nao esta completamente provisionado; a API administrativa retorna `CONFIGURATION_NOT_FOUND`, entao Email/Password, Google e authorized domains ainda precisam ser inicializados no projeto de staging.

O portal publico tem um catalogo de contingencia empacotado no build para manter a landing funcional mesmo quando a leitura publica do Firestore falha. Esse fallback precisa ser mantido alinhado com o catalogo oficial sempre que uma plataforma nova for adicionada e antes de um deploy de producao.

## Build local

```bash
npm install
npm run type-check
npm run lint
npm run build
```

## Deploy manual

```bash
npx firebase-tools deploy --project hocapp-44760 --only hosting,firestore:rules,firestore:indexes,storage
```

## Deploy automatico

Depois do deploy em producao, rode o smoke check da homepage se precisar validar manualmente:

```bash
node scripts/smoke-public-homepage.mjs https://fsalomone.web.app/
```

O workflow em `.github/workflows/deploy.yml` faz:

1. `npm ci --legacy-peer-deps`
2. `npm run type-check`
3. `npm run lint`
4. validacao de secrets
5. `npm run build`
6. deploy de hosting, rules, indexes e storage

## CORS do Storage

O arquivo `storage.cors.json` precisa ser aplicado ao bucket real. Exemplo:

```bash
gsutil cors set storage.cors.json gs://hocapp-44760.appspot.com
```

Sempre confirme se a origem publica ativa do portal esta listada.

## Rollback

1. Identificar o ultimo commit verde em `main`.
2. Reverter o commit ou reaplicar o deploy manual daquele estado.
3. Reaplicar `firestore.rules`, `firestore.indexes.json` e `storage.rules` do ponto de rollback.
4. Se houver migracao de dados, restaurar backup do Firestore e revisar icones no Storage.