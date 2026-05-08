# Estrutural — Plataformas Salomone

Portal central publicado em **https://fsalomone.web.app** para listar e direcionar o acesso às suas outras plataformas.

## Stack

- **Next.js 16** com export estático
- **Firebase Hosting** para publicação do portal
- **Firebase Auth + Firestore + Storage** para login admin, catálogo e ícones
- **GitHub Actions** para deploy automático no `main`

## Documentação de referência

- [Arquitetura](docs/ARQUITETURA.md)
- [Operações](docs/OPERACOES.md)
- [Indexação e Cache](docs/INDEXACAO-CACHE.md)
- [Verificação](docs/VERIFICACAO.md)

## Estado atual

- Projeto Firebase: `hocapp-44760`
- Site de Hosting: `fsalomone`
- URL pública: `https://fsalomone.web.app`
- Web App Firebase: `Plataformas Salomone`
- Admin autorizado no front e nas rules: `fsalamoni@gmail.com`

## O que já está configurado no repositório

- `.firebaserc` aponta para `hocapp-44760`
- `firebase.json` publica o build estático em `fsalomone`
- `.env.local` foi preenchido com o SDK config do app web correto
- Regras de Firestore e Storage restringem escrita ao e-mail admin
- Workflow de CI/CD foi trocado para Firebase Hosting
- `npm run build` já gera o site estático com sucesso

## Papel da Estrutural

- A Estrutural funciona apenas como portal central e catálogo de acesso.
- Cada card aponta para uma plataforma independente, com autenticação, código e deploy próprios.
- Alterações aqui só afetam o catálogo da Estrutural: nome, descrição, categoria, ícone, ordem, visibilidade e URL de acesso.

## Taxonomia operacional do catálogo

As categorias canônicas usadas no portal são:

- `Trabalho`
- `IA`
- `RPG`
- `Jogos`
- `Outros`

## Deploy manual

```bash
npm install
npm run build
npx firebase-tools deploy --project hocapp-44760 --only hosting,firestore:rules,firestore:indexes,storage
```

## Deploy automático no GitHub

No repositório GitHub, mantenha estes secrets:

- `FIREBASE_SERVICE_ACCOUNT`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

O workflow em [.github/workflows/deploy.yml](.github/workflows/deploy.yml) usa esses valores para buildar e publicar no site `fsalomone`.

## Authentication

Para o painel admin funcionar em produção, confirme no Firebase Console:

1. `Authentication > Sign-in method`: Email/Password e Google habilitados.
2. `Authentication > Settings > Authorized domains`: garantir `fsalomone.web.app` e `localhost`.
3. O usuário `fsalamoni@gmail.com` precisa existir no Authentication.

## Como adicionar suas outras plataformas

O portal já está pronto para isso. No admin, cada item tem:

- nome
- descrição
- categoria
- ícone
- ordem
- visibilidade
- `URL de Acesso`

Se você publicar um Worker, basta cadastrar a URL pública dele nesse campo. O portal atua como hub e direcionador; não precisa de nova mudança estrutural para começar a adicionar destinos.

## Desenvolvimento local

```bash
npm install
npm run dev
```

- Landing: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Observação operacional

O fluxo ativo de build e publicação deste projeto é exclusivamente via Firebase Hosting.
