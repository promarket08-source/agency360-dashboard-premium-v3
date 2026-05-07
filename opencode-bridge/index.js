// Bridge to OpenCode local server
// Assumes OpenCode exposes a /prompt endpoint or similar.
class OpenCodeBridge {
  constructor(url) {
    this.url = url || 'http://localhost:8000'
  }
  async prompt(payload) {
    const fetch = global.fetch || require('node-fetch')
    try {
      const res = await fetch(`${this.url}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`OpenCode bridge error: ${res.status}`)
      return await res.json()
    } catch (e) {
      return { error: e.message }
    }
  }
}

module.exports = OpenCodeBridge
