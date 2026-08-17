#!/usr/bin/env bash
# Build the FiscalForge Lambda deployment package.
#
# Output: dist/fiscalforge-backend.zip
#
# The zip contains:
#   backend/           — FiscalForge Python package
#   <site-packages>/   — Runtime dependencies from requirements-lambda.txt
#
# Lambda handler path: backend.handler.handler
# Runtime: python3.11
#
# Usage:
#   ./scripts/build_lambda.sh
#   ./scripts/build_lambda.sh --clean   # Remove dist/ before building

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$REPO_ROOT/dist"
BUILD_DIR="$DIST_DIR/build"
ZIP_PATH="$DIST_DIR/fiscalforge-backend.zip"

if [[ "${1:-}" == "--clean" ]]; then
  echo "Removing $DIST_DIR ..."
  rm -rf "$DIST_DIR"
fi

echo "Building Lambda package..."
mkdir -p "$BUILD_DIR"

# Install runtime dependencies into the build directory
echo "Installing runtime dependencies..."
pip install \
  --quiet \
  --requirement "$REPO_ROOT/requirements-lambda.txt" \
  --target "$BUILD_DIR" \
  --python-version 3.11 \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --only-binary=:all: \
  --upgrade

# Copy the backend package (application code only — no tests, no dev tools)
echo "Copying backend package..."
cp -r "$REPO_ROOT/backend" "$BUILD_DIR/backend"

# Remove __pycache__ directories to keep the zip clean
find "$BUILD_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -name "*.pyc" -delete 2>/dev/null || true

# Create the zip archive
echo "Creating $ZIP_PATH ..."
cd "$BUILD_DIR"
zip -r -q "$ZIP_PATH" .
cd "$REPO_ROOT"

SIZE=$(du -sh "$ZIP_PATH" | cut -f1)
echo "Done: $ZIP_PATH ($SIZE)"
echo ""
echo "Lambda handler: backend.handler.handler"
echo "Runtime:        python3.11"
