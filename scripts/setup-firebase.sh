#!/usr/bin/env bash
# =============================================================================
# setup-firebase.sh
# Configura o projeto Firebase após você preencher .env.local e .firebaserc
# Execute: bash scripts/setup-firebase.sh
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[AVISO]${NC} $1"; }
error()   { echo -e "${RED}[ERRO]${NC} $1"; exit 1; }

echo ""
echo "======================================================"
echo "  Configuração Firebase — Protagonista RPG"
echo "======================================================"
echo ""

# 1. Verificar se .firebaserc está configurado
FIREBASE_PROJECT=$(cat .firebaserc | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['projects']['default'])" 2>/dev/null)
if [[ "$FIREBASE_PROJECT" == "FIREBASE_PROJECT_ID_PLACEHOLDER" ]]; then
  error "Configure o .firebaserc primeiro!\n  Edite .firebaserc e substitua FIREBASE_PROJECT_ID_PLACEHOLDER pelo ID do seu projeto Firebase."
fi
info "Projeto Firebase: $FIREBASE_PROJECT"

# 2. Verificar se ADMIN_UID está nas rules
if grep -q "ADMIN_UID_PLACEHOLDER" firestore.rules; then
  # Tentar obter do .env.local
  if [ -f .env.local ]; then
    ADMIN_UID=$(grep "NEXT_PUBLIC_ADMIN_UID=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$ADMIN_UID" ] && [[ "$ADMIN_UID" != *"your-admin"* ]]; then
      info "Injetando ADMIN_UID nas regras: ${ADMIN_UID:0:8}..."
      sed -i "s/ADMIN_UID_PLACEHOLDER/$ADMIN_UID/g" firestore.rules
      sed -i "s/ADMIN_UID_PLACEHOLDER/$ADMIN_UID/g" storage.rules
      success "Rules atualizadas com seu UID"
    else
      error "Preencha NEXT_PUBLIC_ADMIN_UID no .env.local antes de executar este script."
    fi
  else
    error "Arquivo .env.local não encontrado. Crie-o a partir do .env.example."
  fi
else
  success "Rules já estão configuradas com o UID correto"
fi

# 3. Verificar firebase-tools
if ! command -v firebase &> /dev/null; then
  warn "firebase-tools não encontrado. Instalando globalmente..."
  npm install -g firebase-tools
fi

# 4. Verificar login no Firebase
info "Verificando autenticação no Firebase CLI..."
if ! firebase projects:list --project "$FIREBASE_PROJECT" &>/dev/null; then
  warn "Não autenticado. Iniciando login..."
  firebase login
fi

# 5. Deploy das regras e índices
info "Fazendo deploy das regras do Firestore..."
firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"
success "Regras do Firestore publicadas"

info "Fazendo deploy dos índices do Firestore..."
firebase deploy --only firestore:indexes --project "$FIREBASE_PROJECT"
success "Índices do Firestore criados"

info "Fazendo deploy das regras do Storage..."
firebase deploy --only storage --project "$FIREBASE_PROJECT"
success "Regras do Storage publicadas"

echo ""
echo "======================================================"
echo -e "  ${GREEN}Firebase configurado com sucesso!${NC}"
echo "======================================================"
echo ""
echo "  Próximo passo: configure os GitHub Secrets e faça push para main."
echo "  Ver instruções completas em: README.md → Seção 'GitHub Secrets'"
echo ""
