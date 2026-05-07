#!/bin/bash
set -e
echo "=== Agency Hub Health Check ==="
echo "Node version: $(node -v 2>/dev/null || echo N/A)"
echo "NPM version: $(npm -v 2>/dev/null || echo N/A)"
echo "Docker: $(docker -v 2>/dev/null || echo N/A)"
echo "Ollama: $(ollama --version 2>/dev/null || echo N/A)"
echo "OpenCode Bridge: http://localhost:4000/ping || echo N/A"
echo "Hub API: http://localhost:3000/health"
echo "SQLite path (example): D:/agency-hub/db.sqlite3"
echo "=== End ==="
