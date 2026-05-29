#!/usr/bin/env bash
# deploy.sh — Build, push, and redeploy AgileDeck on k3s

set -euo pipefail

K3S_HOST="${K3S_HOST:-192.168.0.210}"
DEPLOYMENT="${DEPLOYMENT:-visualizedsorting}"
NAMESPACE="${NAMESPACE:-default}"
SSH_USER="${SSH_USER:-root}"

step() { echo -e "\n\033[0;36m==> $1\033[0m"; }
die()  { echo -e "\n\033[0;31m[FAILED] $1\033[0m" >&2; exit 1; }

# ── 1. Build ─────────────────────────────────────────────────────────────────
step "Building Docker image (linux/arm64)..."
sudo docker buildx build \
  --platform linux/arm64 \
  -t aalatyyat/visualizedsorting:latest \
  -f Dockerfile \
  . --push || die "docker build failed"

# ── 2. Rolling restart on k3s ─────────────────────────────────────────────────
step "Triggering rolling restart of '$DEPLOYMENT' on $K3S_HOST..."
ssh "${SSH_USER}@${K3S_HOST}" \
    "kubectl rollout restart deployment/$DEPLOYMENT -n $NAMESPACE && \
     kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=120s" \
    || die "kubectl rollout restart failed"

echo -e "\n\033[0;32m[DONE] Deployment complete.\033[0m"