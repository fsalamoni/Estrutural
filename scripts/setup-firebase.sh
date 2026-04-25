#!/usr/bin/env bash
# =============================================================================
# setup-firebase.sh
# Configura o projeto Firebase após você preencher .env.local e .firebaserc
# Execute: bash scripts/setup-firebase.sh
# =============================================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[AVISO]${NC} $1"; }
error()   { echo -e "${RED}[ERRO]${NC} $1"; exit 1; }

echo ""
echo "======================================================"
echo "  Configuração Firebase — Protagonista RPG"
echo "======================================================"
echo ""

# 1. Verificar .firebaserc
FIREBASE_PROJECT=$(python3 -c "import json,sys; d=json.load(open('.firebaserc')); print(d['projects']['default'])" 2>/dev/null || echo "")
if [[ -z "$FIREBASE_PROJECT" ]] || [[ "$FIREBASE_PROJECT" == "FIREBASE_PROJECT_ID_PLACEHOLDER" ]]; then
  error "Configure o .firebaserc primeiro!\n  Edite .firebaserc e substitua FIREBASE_PROJECT_ID_PLACEHOLDER pelo ID do seu projeto Firebase."
fi
info "Projeto Firebase: $FIREBASE_PROJECT"

# 2. Verificar .env.local
if [ ! -f .env.local ]; then
  error "Arquivo .env.local não encontrado. Copie .env.example para .env.local e preencha os valores."
fi

ADMIN_UID=$(grep "^NEXT_PUBLIC_ADMIN_UID=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')
STORAGE_BUCKET=$(grep "^NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')

if [[ -z "$ADMIN_UID" ]] || [[ "$ADMIN_UID" == *"your-admin"* ]] || [[ "$ADMIN_UID" == *"placeholder"* ]]; then
  error "Preencha NEXT_PUBLIC_ADMIN_UID no .env.local com o UID do seu usuário admin no Firebase."
fi

# 3. Injetar ADMIN_UID nas regras (se ainda tem placeholder)
if grep -q "ADMIN_UID_PLACEHOLDER" firestore.rules; then
  info "Injetando ADMIN_UID nas regras: ${ADMIN_UID:0:10}..."
  sed -i "s/ADMIN_UID_PLACEHOLDER/$ADMIN_UID/g" firestore.rules
  sed -i "s/ADMIN_UID_PLACEHOLDER/$ADMIN_UID/g" storage.rules
  success "Rules atualizadas com seu UID"
else
  success "Rules já estão configuradas com o UID correto"
fi

# 4. Instalar firebase-tools se necessário
if ! command -v firebase &> /dev/null; then
  warn "firebase-tools não encontrado. Instalando..."
  npm install -g firebase-tools
fi

# 5. Verificar login no Firebase
info "Verificando autenticação Firebase CLI..."
if ! firebase projects:list --project "$FIREBASE_PROJECT" &>/dev/null 2>&1; then
  warn "Não autenticado. Iniciando login..."
  firebase login
fi

# 6. Deploy das regras e índices do Firestore
info "Publicando regras do Firestore..."
firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"
success "Regras do Firestore publicadas"

info "Criando índices do Firestore..."
firebase deploy --only firestore:indexes --project "$FIREBASE_PROJECT"
success "Índices do Firestore criados"

info "Publicando regras do Storage..."
firebase deploy --only storage --project "$FIREBASE_PROJECT"
success "Regras do Storage publicadas"

# 7. Configurar CORS do Storage (necessário para uploads funcionarem em produção)
if [[ -n "$STORAGE_BUCKET" ]] && [[ "$STORAGE_BUCKET" != *"your-project"* ]]; then
  if command -v gsutil &> /dev/null; then
    info "Configurando CORS do Storage para $STORAGE_BUCKET..."
    gsutil cors set storage.cors.json "gs://$STORAGE_BUCKET"
    success "CORS do Storage configurado"
  else
    echo ""
    warn "gsutil não encontrado — configure o CORS do Storage manualmente:"
    warn "  1. Instale o Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
    warn "  2. Execute: gsutil cors set storage.cors.json gs://$STORAGE_BUCKET"
    warn "  Sem o CORS, uploads de ícones não vão funcionar em produção."
    echo ""
  fi
else
  warn "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET não configurado no .env.local — CORS do Storage não configurado."
  warn "Configure manualmente: gsutil cors set storage.cors.json gs://SEU-BUCKET"
fi

echo ""
echo "======================================================"
echo -e "  ${GREEN}Firebase configurado com sucesso!${NC}"
echo "======================================================"
echo ""
echo "  Próximos passos:"
echo "  1. Configure os 9 GitHub Secrets (ver README.md)"
echo "  2. Faça push para main: git push origin main"
echo "  3. Adicione o domínio protagonistarpg.com.br no Cloudflare Workers"
echo ""
