// Lightweight OpenCode bridge HTTP server
const OpenCodeBridge = require('./index')
const express = require('express')
const app = express()
app.use(express.json())

const bridge = new OpenCodeBridge(process.env.OPEN_CODE_URL || 'http://localhost:8000')

app.post('/prompt', async (req, res) => {
  const { prompt, context } = req.body
  const result = await bridge.prompt({ prompt, context })
  res.json(result)
})

app.get('/ping', (req, res) => res.json({ status: 'ok' }))

const PORT = 4000
app.listen(PORT, () => console.log(`OpenCode Bridge server listening on ${PORT}`))
