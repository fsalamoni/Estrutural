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
echo "  Configuração Firebase — Estrutural"
echo "======================================================"
echo ""

# 1. Verificar .firebaserc
FIREBASE_PROJECT=$(python3 -c "import json,sys; d=json.load(open('.firebaserc')); print(d['projects']['default'])" 2>/dev/null || echo "")
if [[ -z "$FIREBASE_PROJECT" ]]; then
  error "Configure o .firebaserc primeiro com o ID do seu projeto Firebase."
fi
info "Projeto Firebase: $FIREBASE_PROJECT"

# 2. Verificar .env.local
if [ ! -f .env.local ]; then
  error "Arquivo .env.local não encontrado. Copie .env.example para .env.local e preencha os valores."
fi

STORAGE_BUCKET=$(grep "^NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')

# 3. Instalar firebase-tools se necessário
if ! command -v firebase &> /dev/null; then
  warn "firebase-tools não encontrado. Instalando..."
  npm install -g firebase-tools
fi

# 4. Verificar login no Firebase
info "Verificando autenticação Firebase CLI..."
if ! firebase projects:list --project "$FIREBASE_PROJECT" &>/dev/null 2>&1; then
  warn "Não autenticado. Iniciando login..."
  firebase login
fi

# 5. Deploy das regras e índices do Firestore
info "Publicando regras do Firestore..."
firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"
success "Regras do Firestore publicadas"

info "Publicando regras do Storage..."
firebase deploy --only storage --project "$FIREBASE_PROJECT"
success "Regras do Storage publicadas"

# 6. Configurar CORS do Storage (necessário para uploads funcionarem em produção)
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
echo "  1. Garanta que os secrets VITE_FIREBASE_* e FIREBASE_SERVICE_ACCOUNT existem no GitHub"
echo "  2. Faça push para main: git push origin main"
echo "  3. Faça o deploy do Hosting: firebase deploy --only hosting --project $FIREBASE_PROJECT"
echo ""
