#!/usr/bin/env bash
set -e

NODE18=/opt/homebrew/Cellar/node@18/18.20.8/bin/node
NPM18="$NODE18 /opt/homebrew/Cellar/node@18/18.20.8/lib/node_modules/npm/bin/npm-cli.js"
FRONTEND_DIR="$(dirname "$0")/../frontend"
E2E_DIR="$(dirname "$0")"

echo "=== Ganesha Ayurvedaa — E2E Test Runner ==="

# 1. Start Vite dev server in background
echo "▶ Starting Vite dev server..."
cd "$FRONTEND_DIR"
$NPM18 run dev &
VITE_PID=$!

# Wait for Vite to be ready
echo "  Waiting for http://localhost:5173..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null http://localhost:5173; then
    echo "  ✓ Vite ready"
    break
  fi
  sleep 1
done

# 2. Run Playwright tests
echo ""
echo "▶ Running Playwright tests..."
cd "$E2E_DIR"
$NODE18 node_modules/.bin/playwright test --config=playwright.config.js "$@"
EXIT_CODE=$?

# 3. Teardown
echo ""
echo "▶ Stopping Vite..."
kill $VITE_PID 2>/dev/null || true

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All tests passed!"
else
  echo "❌ Some tests failed. See reports/index.html for details."
fi

exit $EXIT_CODE
