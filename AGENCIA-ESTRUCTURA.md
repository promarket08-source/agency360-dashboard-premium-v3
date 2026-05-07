# AGENCIA 360 - ESTRUCTURA DE AGENCIA DE MARKETING

## 🧠 OpenCode como Cerebro Central
**URL:** http://127.0.0.1:8000

OpenCode es el "cerebro" que coordina todo. Contiene:
- 14 proyectos activos
- Pipeline de $468.000
- 9 tareas pendientes
- 4 facturas pendientes
- 3 leads calificados
- 10 items de inventario
- 192 agentes especializados disponibles

## 📊 Los 192 Agentes Especializados (En SQLite)
**Base de datos:** D:\AI_Agency\agency-hub\backend\db.sqlite3

### Divisiones Principales (192 total):
1. **Specialized** (45 agentes) - Recruitment, Legal, Healthcare, MCP Builder, etc.
2. **Marketing** (30 agentes) - Content Creator, SEO, Social Media, TikTok
3. **Engineering** (30 agentes) - Frontend, Backend, AI Engineer, DevOps
4. **Game Development** (20 agentes) - Unity, Unreal, Godot, Blender, Roblox
5. **Paid Media** (9 agentes) - PPC, Ad Creative, Tracking, Search Query
6. **Design** (8 agentes) - UI Designer, UX Architect, Brand Guardian
7. **Testing** (8 agentes) - QA, Performance, Security
8. **Sales** (8 agentes) - Outbound, Discovery, Proposal
9. **Spatial Computing** (7 agentes) - XR, Vision Pro, macOS Spatial
10. **Support** (6 agentes) - Customer Service, Analytics
11. **Project Management** (6 agentes) - Studio Producer, Scrum Master
12. **Product** (5 agentes) - Manager, Trend Researcher, Sprint Prioritizer
13. **Finance** (5 agentes) - Bookkeeper, Financial Analyst, Tax Strategist
14. **Academic** (5 agentes) - Anthropologist, Geographer, Historian, etc.
15. **Integrations** (1 agente) - MCP Memory integration

## 🎯 Servicios de la Agencia (Cómo funciona)

### 1. Generación de Contenido (Content Marketing)
**Flujo:** Cliente solicita → OpenCode asigna agente → Genera contenido

**Ejemplo:** "Crear campaña para dentista"
- Agente: `content-creator` (Content Creator)
- Apoya: `seo-specialist`, `image-prompt-engineer`
- Resultado: Posts, blogs, scripts de video

**Comando Telegram:** `/prompt Crear campaña dental para Instagram`

### 2. Desarrollo Web (Landing Pages)
**Flujo:** Solicitud → Agente Frontend → Código + Diseño

**Ejemplo:** "Landing page para cafetería"
- Agente: `frontend-developer` + `ui-designer`
- Tecnologías: React, Three.js, Tailwind
- Resultado: Landing page optimizada para conversión

**Comando Telegram:** `/prompt Crear landing page para cafetería con efectos 3D`

### 3. Gestión de Campañas Publicitarias
**Flujo:** Estrategia → Paid Media → Ejecución

**Ejemplo:** "Lanzar ads en TikTok"
- Agente: `paid-social-strategist` + `ad-creative-strategist`
- Plataformas: Meta, TikTok, LinkedIn, Google Ads
- Resultado: Campaña estructurada + creativos

### 4. SEO y Posicionamiento
**Flujo:** Análisis → Estrategia → Ejecución

**Ejemplo:** "Posicionar web de inmobiliaria"
- Agente: `seo-specialist` + `content-creator`
- Acciones: Keywords, content, backlinks
- Resultado: Tráfico orgánico + leads

## 📱 Integración con Paperclip (Control Plane)
**Lo que Paperclip hace y cómo lo replicamos:**

| Funcionalidad Paperclip | Implementación en Agencia 360 |
|----------------------------|--------------------------------|
| Gestión de proyectos | OpenCode (14 proyectos activos) |
| Tareas (Issues) | Tabla `tasks` en SQLite |
| CRM de clientes | Tabla `users` + `campaigns` |
| Finanzas | `$468k pipeline` en dashboard |
| API Keys | `.env` con todas las claves |
| Agentes MCP | Los 154 agentes en SQLite |

## 🤖 Uso Diario - Escenarios Prácticos

### Escenario 1: Nuevo Cliente (Dentista)
```
1. Cliente contacta por Telegram: "Quiero una web para mi clínica"
2. Tú escribes: /prompt Crear proyecto web dental completo
3. OpenCode asigna:
   - frontend-developer (código)
   - ui-designer (diseño)
   - content-creator (textos)
   - seo-specialist (posicionamiento)
4. Resultado: Proyecto creado, landing page, contenido, SEO
```

### Escenario 2: Campaña de Marketing (Cafetería)
```
1. Comando: /prompt Crear campaña TikTok para cafetería "El Grano Mágico"
2. OpenCode coordina:
   - tiktok-strategist (estrategia)
   - content-creator (videos)
   - image-prompt-engineer (imágenes)
3. Resultado: 10 videos, 20 posts, calendario editorial
```

### Escenario 3: Generar Leads (Inmobiliaria)
```
1. Comando: /prompt Generar leads para parcelas en Villarrica
2. Agentes trabajando:
   - outbound-strategist (prospección)
   - seo-specialist (Google My Business)
   - content-creator (blog posts)
3. Resultado: 50 leads calificados en el CRM
```

## 📊 Estructura de Base de Datos (SQLite)
**Ubicación:** D:\AI_Agency\agency-hub\backend\db.sqlite3

### Tablas:
1. **agents** - 154 agentes con: id, name, division, tools, emoji
2. **campaigns** - Campañas activas con: name, status, config (JSON)
3. **tasks** - Tareas asignadas con: agent_id, input, output, status
4. **users** - Clientes/Usuarios con: email, role, google_id
5. **logs** - Registro de actividades

## 🔗 APIs y Conexiones

### Hub API (Puente Central)
**URL:** http://localhost:3000

**Endpoints principales:**
- `GET /health` - Estado del sistema
- `GET /agents` - Lista de 154 agentes
- `POST /opened-code/prompt` - Enviar prompts a OpenCode
- `POST /telegram/webhook` - Webhook para Telegram
- `GET /campaigns` - Ver campañas
- `POST /tasks` - Crear tareas para agentes

### OpenCode (Cerebro)
**URL:** http://127.0.0.1:8000

**Qué puede hacer:**
- Gestionar 14 proyectos
- Ver pipeline de $468k
- Controlar 154 agentes
- Generar contenido con IA
- Crear landing pages
- Hacer SEO y marketing

### Telegram (Control Móvil)
**Token:** 8754625349:AAFi4gNbjvm-vPfvkJX2wkwHAEkfglmbEL4
**Chat ID:** 1811224365

**Comandos disponibles:**
- `/agents` - Ver agentes disponibles
- `/prompt <texto>` - Enviar trabajo a OpenCode
- `/campaigns` - Ver campañas activas
- `/status` - Estado del sistema

## 💼 Flujo de Trabajo Real

### Paso 1: Cliente solicita servicio
```
Ejemplo: "Quiero una landing page para mi cafetería"
Canal: Telegram, OpenCode dashboard, o API
```

### Paso 2: OpenCode asigna agentes
```
1. Analiza la solicitud
2. Busca agentes en SQLite (154 disponibles)
3. Asigna: frontend-developer + ui-designer + content-creator
4. Crea tarea en la tabla `tasks`
```

### Paso 3: Agentes ejecutan
```
1. frontend-developer: Crea código React/Next.js
2. ui-designer: Diseña interfaz atractiva
3. content-creator: Genera textos persuasivos
4. Guarda resultados en tabla `tasks` (campo output)
```

### Paso 4: Entrega al cliente
```
1. Revisión en OpenCode
2. URL de la landing: http://127.0.0.1:8000/proyects
3. Reporte en Telegram: "Landing completada ✅"
4. Facturación automática en el CRM
```

## 🎯 Cómo Pedir Cosas (3 métodos)

### Método 1: Desde OpenCode (Dashboard)
1. Entra a http://127.0.0.1:8000
2. Ve a "Projects" → "New Project"
3. Escribe: "Usa agentes para crear campaña dental"
4. OpenCode coordina todo automáticamente

### Método 2: Desde Telegram (Móvil)
```
/comienzo
/prompt Crear landing page para dentista con efectos 3D
/prompt Generar 10 posts para Instagram cafetería
/campaigns
/status
```

### Método 3: Desde la API (Automatización)
```bash
# Crear tarea para un agente
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "content-creator", "input": {"task": "Crear posts Instagram"}}'

# Ver resultados
curl http://localhost:3000/tasks
```

## ✅ Checklist de Operación

1. ✅ OpenCode corriendo en http://127.0.0.1:8000
2. ✅ Hub API en http://localhost:3000
3. ✅ 154 agentes en SQLite (D:\AI_Agency\agency-hub\backend\db.sqlite3)
4. ✅ Telegram bot configurado (token listo)
5. ✅ 14 proyectos en OpenCode
6. ✅ Pipeline de $468k registrado
7. ✅ Panel en Vercel: https://agencia-dashboard-topaz.vercel.app

## 🚀 Siguiente Paso: ¡Empezar a Trabajar!

**Para generar tu primer contenido:**
1. Abre OpenCode: http://127.0.0.1:8000
2. Escribe: "Usa el agente Content Creator para crear una campaña de marketing para una cafetería"
3. Observa cómo los agentes trabajan automáticamente

**Para control por Telegram:**
1. Busca tu bot en Telegram
2. Envía: `/prompt Crear landing page para dentista`
3. Recibe actualizaciones en tiempo real

**Para ver el estado:**
1. Hub: http://localhost:3000/health
2. Agentes: http://localhost:3000/agents
3. OpenCode: http://127.0.0.1:8000

¡Tu agencia de marketing 100% local está lista para generar contenido, atender clientes y gestionar proyectos!
