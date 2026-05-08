# Estrutural — Hub de Plataformas Protagonista RPG

Landing page pública com painel admin para gerenciar acessos às plataformas em **protagonistarpg.com.br**.

## Stack

- **Next.js 16** · TypeScript · Tailwind CSS
- **Firebase** · Auth + Firestore + Storage
- **Cloudflare Workers** · Deploy via `@opennextjs/cloudflare`
- **GitHub Actions** · CI/CD automático no push para `main`

---

## O que você precisa configurar (uma vez só)

### Passo 1 — Firebase Console

#### 1.1 Criar projeto
1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. Nome: `protagonistarpg` (ou similar) → criar

#### 1.2 Habilitar autenticação
1. **Build > Authentication > Get started**
2. Habilitar **Email/Password** e **Google** (defina e-mail de suporte)
3. **Settings > Authorized domains** → adicionar:
   - `localhost`
   - `protagonistarpg.com.br`
   - `www.protagonistarpg.com.br`

#### 1.3 Criar usuário admin
1. **Authentication > Users > Add user**
2. Insira seu e-mail e senha forte
3. ⚠️ **Copie o UID gerado** (você vai usá-lo nos próximos passos)

#### 1.4 Criar Firestore Database
1. **Build > Firestore Database > Create database**
2. Modo: **Production** · Região: **`southamerica-east1`**

#### 1.5 Habilitar Storage
1. **Build > Storage > Get started** · Modo: Production
2. Mesma região: `southamerica-east1`

#### 1.6 Registrar Web App
1. **Project Overview > Add app > Web** (`</>`)
2. Nome: `estrutural-web` · **NÃO** habilitar Firebase Hosting
3. Copie o objeto `firebaseConfig` (você vai precisar dos valores)

---

### Passo 2 — Deploy das regras com o script automático

Após preencher `.env.local` (próximo passo) e `.firebaserc`:

```bash
# 1. Edite .firebaserc e substitua FIREBASE_PROJECT_ID_PLACEHOLDER pelo ID do seu projeto
# 2. Preencha .env.local com os valores do Firebase (veja seção abaixo)
# 3. Execute:
bash scripts/setup-firebase.sh
```

O script faz tudo automaticamente:
- Injeta seu UID nas regras do Firestore e Storage
- Faz deploy das regras e índices no Firebase

---

### Passo 3 — Variáveis de ambiente (.env.local para desenvolvimento)

```bash
cp .env.example .env.local
```

Preencha com os valores do Firebase Console:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_ADMIN_UID=uid-copiado-do-firebase-authentication
```

---

### Passo 4 — GitHub Secrets (para deploy automático)

No repositório GitHub: **Settings > Secrets and variables > Actions > New repository secret**

Adicione os 9 secrets abaixo:

| Secret | Onde encontrar |
|--------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | idem |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | idem |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | idem |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | idem |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | idem |
| `NEXT_PUBLIC_ADMIN_UID` | Firebase Console → Authentication → Users → seu UID |
| `CLOUDFLARE_API_TOKEN` | ver abaixo |
| `CLOUDFLARE_ACCOUNT_ID` | ver abaixo |

**Como obter o Cloudflare API Token:**
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **My Profile > API Tokens**
2. **Create Token** → usar template **"Edit Cloudflare Workers"**
3. Configurar:
   - Account: sua conta Cloudflare
   - Zone Resources: All zones (ou selecionar `protagonistarpg.com.br`)
4. Copiar o token gerado → adicionar como `CLOUDFLARE_API_TOKEN`

**Como obter o Cloudflare Account ID:**
1. Qualquer página do Cloudflare Dashboard
2. Barra lateral direita → **Account ID** (string de 32 caracteres)

---

### Passo 5 — Domínio personalizado no Cloudflare

Após o primeiro deploy automático via GitHub Actions:

1. Cloudflare Dashboard → **Workers & Pages**
2. Clique no Worker **`estrutural`**
3. **Settings > Domains & Routes > Add Custom Domain**
4. Adicionar: `protagonistarpg.com.br`
5. Adicionar: `www.protagonistarpg.com.br`

Como o domínio já está no Cloudflare, o DNS é configurado automaticamente.

---

## Desenvolvimento local

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Rodar em modo desenvolvimento
npm run dev

# Build de verificação
npm run build:next

# Build completo (Cloudflare Worker)
npm run build

# Preview local do Worker compilado
npm run preview
```

- **Landing page**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin/login

---

## Catálogo inicial das plataformas

O painel admin tem um botão **"Importar Catálogo"** que adiciona de uma vez as 11 plataformas
do ecossistema (OmniForge RPG, Salomone IA, Lexio, CAOCIPP, Anotes, Superbolão, etc).

A lista é declarada em `src/lib/seed-data.ts`. O botão é idempotente — só cria as que ainda
não existem no Firestore (compara por nome).

---

## Deploy

Deploy é **automático**: cada push para `main` dispara o GitHub Actions que:
1. Faz type check e lint
2. Compila com `@opennextjs/cloudflare`
3. Faz deploy no Cloudflare Workers via `wrangler deploy`

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

Para deploy manual:
```bash
npm run deploy
```

---

## Segurança (3 camadas)

| Camada | Onde | O que faz |
|--------|------|-----------|
| Edge Proxy | `src/proxy.ts` | Bloqueia `/admin/*` sem cookie de sessão |
| API Route | `src/app/api/auth/session/route.ts` | Define cookie com flag `HttpOnly` server-side |
| Client Guard | `AuthGuard.tsx` | Redireciona se Firebase Auth retorna null |
| Firestore Rules | Firebase Console | UID do admin hard-coded; sem UID = sem escrita |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                  # Landing page pública
│   ├── not-found.tsx             # Página 404
│   ├── admin/
│   │   ├── page.tsx              # Dashboard admin (CRUD)
│   │   ├── layout.tsx            # Wraps com AuthGuard + Toast
│   │   └── login/page.tsx        # Login admin
│   └── api/auth/session/route.ts # Gerencia cookie HttpOnly
├── components/
│   ├── landing/                  # PlatformCard, PlatformGrid
│   ├── admin/                    # AuthGuard, PlatformForm, PlatformTable, InstructionsPanel
│   └── ui/Toast.tsx              # Notificações
├── hooks/
│   ├── useAuth.tsx               # Firebase Auth context
│   └── usePlatforms.tsx          # Realtime data + error state
├── lib/firebase/                 # config, auth, firestore, storage
└── proxy.ts                      # Edge middleware (Next.js 16)

Firebase/
├── firestore.rules               # Regras do banco (deploy: setup-firebase.sh)
├── storage.rules                 # Regras do storage
├── firestore.indexes.json        # Índices compostos
└── firebase.json                 # Configuração do Firebase CLI

Deploy/
├── wrangler.toml                 # Configuração do Cloudflare Worker
├── open-next.config.ts           # Adaptador OpenNext para Cloudflare
└── .github/workflows/deploy.yml  # CI/CD automático
```
