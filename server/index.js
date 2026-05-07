require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initCache, scheduleRefresh } = require('./cache/scheduler')
const rebrickableRouter = require('./routes/rebrickable')

const PORT = process.env.PORT || 3001

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/rebrickable', rebrickableRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

async function start() {
  try {
    await initCache()
    scheduleRefresh()
  } catch (err) {
    console.warn('[Server] Cache init failed — server still starting:', err.message)
  }

  app.listen(PORT, () => {
    console.log(`[Server] BrickDex API running on http://localhost:${PORT}`)
  })
}

start()
