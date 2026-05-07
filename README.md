Agency Hub (OpenCode Orchestrator) — scaffolding inicial

Objetivo: establecer un hub local en D:\agency-hub que orqueste agentes IA (OpenCode como cerebro), con puentes a Ollama y Hermes, y exponga endpoints para tu panel existente.

Estructura propuesta:
- backend/        — servidor Node.js/Express para orquestación (endpoints de health/agents)
- adapters/agents/ — wrappers de agentes locales (ej. sample_agent.js)
- opencode-bridge/— puente hacia OpenCode (bridge HTTP local)
- docker-compose.yml — orquestación de servicios (hub, puente OpenCode, Ollama, DB)
- scripts/health_check.sh — chequeo rápido del entorno
- .env.example   — variables de entorno de configuración

Instrucciones rápidas:
- Instalar Node.js y npm
- Abrir una terminal en D:\agency-hub y ejecutar: npm install en backend
- Levantar con Docker: docker-compose up -d (si Docker está disponible)
- Ver health en http://localhost:3000/health
- Registrar un agente de ejemplo en /agents

Este es un scaffold básico. Podemos iterar para añadir endpoints, autenticación, y la integración con OpenCode y Hermes a lo largo de las siguientes fases.
