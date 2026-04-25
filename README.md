# Estrutural — Hub de Plataformas Protagonista RPG

Landing page pública com painel admin para gerenciar acessos às plataformas em **protagonistarpg.com.br**.

## Stack

- **Next.js 16** (App Router + TypeScript)
- **Tailwind CSS** (tema dark com glassmorphism)
- **Firebase** (Auth + Firestore + Storage)
- **Cloudflare Pages** (hospedagem via OpenNext)

---

## Configuração Inicial (Obrigatório antes do deploy)

### 1. Firebase Console

#### 1.1 Criar projeto
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Add project"** → nome: `estrutural` (ou similar)
3. Desative o Google Analytics (opcional) → **Create project**

#### 1.2 Habilitar autenticação
1. Sidebar: **Build > Authentication > Get started**
2. Aba **Sign-in method**:
   - Habilitar **Email/Password**
   - Habilitar **Google** (defina um e-mail de suporte)
3. Aba **Settings > Authorized domains** → adicionar:
   - `localhost`
   - `protagonistarpg.com.br`
   - `www.protagonistarpg.com.br`
   - `[seu-projeto].pages.dev` *(domínio automático Cloudflare Pages)*

#### 1.3 Criar usuário admin
1. **Authentication > Users > Add user**
2. Insira seu e-mail e uma senha forte
3. ⚠️ **Copie o UID gerado** — você vai precisar dele nas etapas seguintes

#### 1.4 Criar Firestore Database
1. **Build > Firestore Database > Create database**
2. Modo: **Production mode** ✓
3. Região: **`southamerica-east1`** (mais próxima do Brasil)
4. Aba **Rules** → cole e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /platforms/{platformId} {
      allow read: if resource.data.visible == true
                  || (request.auth != null && request.auth.uid == "SEU_UID_AQUI");
      allow write: if request.auth != null
                   && request.auth.uid == "SEU_UID_AQUI";
    }
  }
}
```

> Substitua **`SEU_UID_AQUI`** pelo UID copiado no passo 1.3

#### 1.5 Habilitar Firebase Storage
1. **Build > Storage > Get started** → Production mode
2. Mesma região: `southamerica-east1`
3. Aba **Rules** → cole e publique:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /platform-icons/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == "SEU_UID_AQUI";
    }
  }
}
```

#### 1.6 Registrar Web App
1. **Project Overview > Add app > Web** (`</>`)
2. Nome: `estrutural-web` | **NÃO** habilitar Firebase Hosting
3. Copie o objeto `firebaseConfig` — você vai precisar desses valores

---

### 2. Variáveis de Ambiente (Local)

Copie `.env.example` para `.env.local` e preencha com os valores do Firebase:

```bash
cp .env.example .env.local
```

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

### 3. Cloudflare Pages

#### 3.1 Criar Pages project
1. Cloudflare Dashboard → **Workers & Pages > Create application > Pages**
2. **Connect to Git** → selecionar repositório `fsalamoni/Estrutural`
3. Build settings:
   - **Build command**: `npx @opennextjs/cloudflare build`
   - **Build output directory**: `.open-next/assets`
   - **Root directory**: `/`
4. Salvar e fazer o primeiro deploy

#### 3.2 Variáveis de ambiente no Cloudflare
**Pages > Settings > Environment variables** → adicionar (scope: Production + Preview):

| Variável | Valor |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Da etapa 1.6 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Da etapa 1.6 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Da etapa 1.6 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Da etapa 1.6 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Da etapa 1.6 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Da etapa 1.6 |
| `NEXT_PUBLIC_ADMIN_UID` | UID do passo 1.3 |
| `NODE_VERSION` | `20` |

#### 3.3 Compatibility flags (obrigatório)
**Pages > Settings > Functions > Compatibility flags** → adicionar:
- Flag: **`nodejs_compat`**
- Aplicar em **Production** e **Preview**

#### 3.4 Adicionar domínio personalizado
1. **Pages > Custom domains > Set up a custom domain**
2. Digite: `protagonistarpg.com.br`
3. Como o domínio já está no Cloudflare, o registro CNAME é criado automaticamente
4. Repita para `www.protagonistarpg.com.br`

---

### 4. Adicionar Sub-plataformas no Domínio

Para cada nova plataforma sua em `*.protagonistarpg.com.br`:

**Cloudflare DNS (Dashboard → protagonistarpg.com.br → DNS):**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `gmtools` | `seu-worker.workers.dev` ou `projeto.pages.dev` | ☁️ Proxied |
| CNAME | `discord` | `seu-projeto.pages.dev` | ☁️ Proxied |

Então no painel admin, use a URL `https://gmtools.protagonistarpg.com.br` no campo "URL de Acesso".

---

## Desenvolvimento Local

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Rodar em modo desenvolvimento
npm run dev

# Build para verificar erros
npm run build:next

# Type check
npm run type-check
```

Acesse:
- **Landing page**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin/login

---

## Deploy

O deploy é automático via GitHub: cada push para `main` aciona o build no Cloudflare Pages.

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

---

## Arquitetura de Segurança

A rota `/admin` é protegida em 3 camadas:

1. **Edge Proxy** (`src/proxy.ts`) — verifica cookie `__session` antes de carregar a página
2. **Client Guard** (`AuthGuard.tsx`) — verifica Firebase Auth em tempo real no browser  
3. **Regras Firestore/Storage** — UID do admin hard-coded; sem UID correto = sem escrita no banco
