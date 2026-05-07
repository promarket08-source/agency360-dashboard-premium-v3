# GUÍA DE USO - AGENCIA 360 (OpenCode + Hub + Telegram)

## 🧠 CENTRO DE MANDO: OpenCode
**URL:** http://127.0.0.1:8000

OpenCode es el CEREBRO con IA integrada. Desde aquí gestionas TODO:

### 1. ¿Cómo pedir cosas a la IA?
Desde el dashboard de OpenCode puedes:
- Escribir prompts directos en el campo de texto
- Usar los agentes cargados (154 disponibles)
- Ejemplo: "Usa el agente Content Creator para crear una campaña de marketing para dentistas"

### 2. Proyectos disponibles en OpenCode:
- 14 proyectos activos
- Pipeline: $468.000
- 9 tareas pendientes
- 4 facturas pendientes
- 3 leads calificados
- 10 items de inventario

### 3. ¿Cómo gestionar proyectos?
Desde OpenCode (http://127.0.0.1:8000):
1. Ve a **Proyectos** → **Proyecto Todos** → **Desarrollo**
2. Usa las etapas: Planeación → Desarrollo → Completado → Archivado
3. Asigna tareas a agentes: "Asignar tarea al agente Frontend Developer"

---

## 🔗 HUB API (Puente Central)
**URL:** http://localhost:3000

### Endpoints para pedir cosas:
```bash
# Ver estado del sistema
GET http://localhost:3000/health

# Ver todos los agentes disponibles (154)
GET http://localhost:3000/agents

# Ver un agente específico
GET http://localhost:3000/agents/frontend-developer

# Crear una campaña
POST http://localhost:3000/campaigns
Body: { "name": "Campaña Dental", "description": "Marketing para clínica" }

# Crear una tarea para un agente
POST http://localhost:3000/tasks
Body: { "agent_id": "content-creator", "type": "execute", "input": { "task": "Crear posts para Instagram" } }

# Ver logs del sistema
GET http://localhost:3000/logs
```

---

## 📱 TELEGRAM / HERMES (Control móvil)

### Configuración:
1. **Token:** `8754625349:AAFi4gNbjvm-vPfvkJX2wkwHAEkfglmbEL4`
2. **Chat ID:** `1811224365` (Roberto templo del Ser)

### Comandos disponibles desde Telegram:
```
/start - Inicia el bot
/agents - Lista todos los agentes disponibles
/prompt <texto> - Envía un prompt a OpenCode (cerebro)
/campaigns - Ver campañas activas
/status - Estado del sistema
/help - Ayuda
```

### Configurar Webhook (para recibir mensajes):
Si tienes una URL pública (ngrok/localtunnel), ejecuta:
```
https://api.telegram.org/bot8754625349:AAFi4gNbjvm-vPfvkJX2wkwHAEkfglmbEL4/setWebhook?url=https://tu-url-publica:3000/telegram/webhook
```

### O usar polling (Hermes):
Configura Hermes para que haga polling a:
- `http://127.0.0.1:8000` (OpenCode)
- `http://localhost:3000` (Hub)

---

## 🎯 FLUJO DE TRABAJO TÍPICO

### Escenario: "Quiero crear una landing page para un dentista"

1. **Desde OpenCode** (http://127.0.0.1:8000):
   - Escribe: "Usa el agente Frontend Developer y el agente UI Designer para crear una landing page moderna para una clínica dental en Villarrica"

2. **Desde Telegram:**
   - Envía: `/prompt Crear landing page dental usando agente frontend-developer`

3. **Desde el Hub API:**
   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"agent_id": "frontend-developer", "input": {"task": "Landing page dental"}}'
   ```

4. **OpenCode procesa** con su IA y usa los agentes de la base de datos SQLite

5. **Resultado:** Landing page generada, optimizada para conversiones

---

## 📊 BASE DE DATOS (Disco Duro)

**Ubicación:** `D:\AI_Agency\agency-hub\backend\db.sqlite3`

Contiene:
- **154 agentes** listos para usar
- **Campañas** de marketing
- **Tareas** asignadas
- **Logs** del sistema
- **Usuarios** y permisos

---

## 🚀 PANEL REMOTO (Vercel)
**URL:** https://agencia-dashboard-topaz.vercel.app

Para conectar el panel al hub local:
- El hub ya tiene CORS habilitado
- El panel debe apuntar a `http://tu-ip-local:3000/agents`
- Necesitas exponer tu hub si el panel está en Vercel

---

## 💡 EJEMPLOS DE PROMPTS PARA OPENCODE

Desde el dashboard (http://127.0.0.1:8000):

1. **Marketing:** "Usa el agente Marketing Content Creator para crear una estrategia de TikTok para una cafetería"

2. **Desarrollo:** "Usa el agente Frontend Developer y UI Designer para crear una landing page con efectos 3D usando React Three Fiber"

3. **SEO:** "Usa el agente SEO Specialist para optimizar el contenido de la web de una inmobiliaria en Villarrica"

4. **Campañas:** "Inicia una campaña de Meta Ads usando el agente Paid Social Strategist para promocionar parcelas en Pucón"

---

## ✅ CHECKLIST DE USO DIARIO

1. ✅ Asegúrate que OpenCode esté corriendo (http://127.0.0.1:8000)
2. ✅ Asegúrate que el Hub esté corriendo (http://localhost:3000/health)
3. ✅ Desde OpenCode: Pide tareas, crea proyectos, asigna a agentes
4. ✅ Desde Telegram: Usa /prompt para control remoto
5. ✅ Revisa logs en http://localhost:3000/logs

---

## 🔧‍♂️ SOPORTE TÉCNICO

Si algo falla:
1. Revisa logs: `GET http://localhost:3000/logs`
2. Verifica agentes: `GET http://localhost:3000/agents`
3. Estado del hub: `GET http://localhost:3000/health`
4. Reinicia hub: `cd D:\AI_Agency\agency-hub\backend && node src/index.js`

---

**¡TODO LISTO! El cerebro (OpenCode) con IA está en http://127.0.0.1:8000**
**Los 154 agentes están en SQLite listos para trabajar**
**Telegram/Hermes puede controlarlo todo desde tu celular**
