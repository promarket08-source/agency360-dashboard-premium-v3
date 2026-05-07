@echo off
echo Starting Agency Hub...
cd /d D:\AI_Agency\agency-hub\backend
set PORT=3000
set AGENTS_REPO=D:\AI_Agency\agency-agents
set OPENCODE_URL=http://127.0.0.1:8000
set DB_PATH=D:\AI_Agency\agency-hub\backend\db.sqlite3
node src\index.js
