#!/bin/bash
set -e

echo "=========================================="
echo " Ganesha Ayurvedaa - Backend Dev Mode"
echo " Hot-reload enabled via Spring DevTools"
echo "=========================================="

# Start Spring Boot in background (devtools watches target/classes for restarts)
mvn spring-boot:run \
  -Dspring-boot.run.fork=true \
  -Dspring.devtools.restart.enabled=true \
  -Dspring.devtools.livereload.enabled=true &

APP_PID=$!
echo "[watcher] Spring Boot started (PID: $APP_PID)"
echo "[watcher] Watching src/ for changes..."

# On any .java / .xml / .properties / .yml change:
#   1. mvn compile writes new .class files to target/classes
#   2. Spring DevTools detects the .class change and auto-restarts the app
while true; do
  inotifywait -q -r -e modify,create,delete,moved_to \
    --include '.*\.(java|xml|properties|yml|yaml|sql)$' \
    src/ 2>/dev/null

  echo "[watcher] Source change detected — recompiling..."
  if mvn compile -q -DskipTests 2>&1; then
    echo "[watcher] Recompile OK — Spring DevTools will restart the app"
  else
    echo "[watcher] Compilation error — fix the code and save again"
  fi
done &

# Keep the container alive by waiting for the Spring Boot process
wait $APP_PID
