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
- Projeto staging: `hocapp-staging-44760`
- URL staging: `https://hocapp-staging-44760.web.app`
- Ultima validacao remota: workflow de deploy em `main` verde com smoke check da homepage aprovado

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

## Deploy manual de staging

`npm run deploy:staging` carrega automaticamente `.env.staging.local` se ele existir; caso contrario usa [.env.staging.example](.env.staging.example).

O deploy de staging publica Hosting, Firestore e Storage. Se o bucket padrao do projeto ainda nao existir, o script pula Storage automaticamente e informa esse estado.

No estado atual, o projeto `hocapp-staging-44760` ja esta com Hosting, Firestore, Storage e Authentication provisionados em `https://hocapp-staging-44760.web.app`.

A home publica agora tem um catalogo de contingencia embutido no build. Em operacao normal, a landing continua consumindo o Firestore publico; se essa leitura voltar a falhar, o portal continua servindo os cards publicados em vez de cair para erro total.

```bash
npm install
npm run deploy:staging
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

E mantenha também este secret no GitHub Actions:

- `NEXT_PUBLIC_ADMIN_EMAIL`

O workflow em [.github/workflows/deploy.yml](.github/workflows/deploy.yml) usa esses valores para buildar e publicar no site `fsalomone`.

Depois do deploy, o workflow tambem executa um smoke check da homepage publica para garantir `200`, presenca de cards criticos e ausencia do estado de erro do catalogo.

## Authentication

Para o painel admin funcionar em produção, confirme no Firebase Console:

1. `Authentication > Sign-in method`: Email/Password e Google habilitados.
2. `Authentication > Settings > Authorized domains`: garantir `fsalomone.web.app` e `localhost`.
3. O usuário `fsalamoni@gmail.com` precisa existir no Authentication.

Para staging, o mesmo checklist existe com `hocapp-staging-44760.web.app`, `hocapp-staging-44760.firebaseapp.com` e `localhost`. Email/Password e Google ja estao habilitados no projeto de staging e o bucket padrao de Storage ja foi inicializado.

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
