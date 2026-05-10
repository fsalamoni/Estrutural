#!/usr/bin/env bash
# =============================================================================
# setup-firebase.sh
# Configure the Firebase project after .env.local and .firebaserc are ready.
# Run with: bash scripts/setup-firebase.sh
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
  echo -e "${GREEN}[OK]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

fail() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

echo ""
echo "======================================================"
echo "  Firebase setup - Estrutural"
echo "======================================================"
echo ""

FIREBASE_PROJECT=$(python3 -c "import json; print(json.load(open('.firebaserc'))['projects']['default'])" 2>/dev/null || echo "")
if [[ -z "$FIREBASE_PROJECT" ]]; then
  fail "Configure .firebaserc first with the Firebase project ID."
fi
info "Firebase project: $FIREBASE_PROJECT"

if [[ ! -f .env.local ]]; then
  fail "Missing .env.local. Copy .env.example to .env.local and fill the values first."
fi

STORAGE_BUCKET=$(grep '^NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=' .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'" | tr -d ' ')

if ! command -v firebase >/dev/null 2>&1; then
  warn "firebase-tools not found. Installing globally..."
  npm install -g firebase-tools
fi

info "Checking Firebase CLI authentication..."
if ! firebase projects:list --project "$FIREBASE_PROJECT" >/dev/null 2>&1; then
  warn "Not authenticated. Starting Firebase login..."
  firebase login
fi

info "Deploying Firestore rules..."
firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"
success "Firestore rules deployed"

info "Deploying Firestore indexes..."
firebase deploy --only firestore:indexes --project "$FIREBASE_PROJECT"
success "Firestore indexes deployed"

info "Deploying Storage rules..."
firebase deploy --only storage --project "$FIREBASE_PROJECT"
success "Storage rules deployed"

if [[ -n "$STORAGE_BUCKET" ]] && [[ "$STORAGE_BUCKET" != *"your-project"* ]]; then
  if command -v gsutil >/dev/null 2>&1; then
    info "Applying Storage CORS to $STORAGE_BUCKET..."
    gsutil cors set storage.cors.json "gs://$STORAGE_BUCKET"
    success "Storage CORS configured"
  else
    echo ""
    warn "gsutil not found. Configure Storage CORS manually:"
    warn "  1. Install Google Cloud SDK"
    warn "  2. Run: gsutil cors set storage.cors.json gs://$STORAGE_BUCKET"
    warn "  Icon uploads will fail in production until CORS is applied."
    echo ""
  fi
else
  warn "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing in .env.local. Storage CORS was not configured."
  warn "Configure manually with: gsutil cors set storage.cors.json gs://YOUR_BUCKET"
fi

echo ""
echo "======================================================"
echo -e "  ${GREEN}Firebase setup completed successfully${NC}"
echo "======================================================"
echo ""
echo "  Next steps:"
echo "  1. Ensure GitHub secrets VITE_FIREBASE_* and FIREBASE_SERVICE_ACCOUNT exist"
echo "  2. Push to main: git push origin main"
echo "  3. Run the full deploy if needed: firebase deploy --only hosting,firestore:rules,firestore:indexes,storage --project $FIREBASE_PROJECT"
echo ""
