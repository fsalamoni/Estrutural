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

Use `.env.local` com os mesmos valores do app web do Firebase e mantenha `NEXT_PUBLIC_ADMIN_EMAIL` alinhado com o e-mail autorizado nas Rules.

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