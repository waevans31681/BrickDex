const express = require('express')
const axios = require('axios')
const db = require('../cache/db')

const router = express.Router()

// Normalise a user-supplied set number: "75192" → "75192-1" if needed
function normaliseSetNum(raw) {
  const s = raw.trim()
  return s.includes('-') ? s : `${s}-1`
}

// Look up one set — cache first, live API on miss
router.get('/sets/:setNum', async (req, res) => {
  const setNum = normaliseSetNum(req.params.setNum)

  // Cache hit
  const cached = db.prepare(`
    SELECT s.*, m.num_figs
    FROM sets s
    LEFT JOIN set_minifigs m ON m.set_num = s.set_num
    WHERE s.set_num = ?
  `).get(setNum)

  if (cached) {
    return res.json(mapCachedSet(cached))
  }

  // Cache miss — call Rebrickable API
  try {
    const apiKey = process.env.REBRICKABLE_API_KEY
    const [setRes, figRes] = await Promise.all([
      axios.get(`https://rebrickable.com/api/v3/lego/sets/${setNum}/`, {
        headers: { Authorization: `key ${apiKey}` },
      }),
      axios.get(`https://rebrickable.com/api/v3/lego/sets/${setNum}/minifigs/`, {
        headers: { Authorization: `key ${apiKey}` },
      }).catch(() => ({ data: { count: 0 } })),
    ])

    const data = setRes.data
    const numFigs = figRes.data.count ?? 0

    const mapped = {
      setNumber:    data.set_num,
      name:         data.name,
      theme:        data.theme_id?.toString() ?? '', // theme name resolved below
      subTheme:     null,
      pieceCount:   data.num_parts,
      minifigCount: numFigs,
      imageUrl:     data.set_img_url ?? null,
      isRetired:    false,
    }

    // Resolve theme name from local cache
    if (data.theme_id) {
      const theme = db.prepare('SELECT name FROM themes WHERE id = ?').get(data.theme_id)
      if (theme) mapped.theme = theme.name
    }

    res.json(mapped)
  } catch (err) {
    const status = err.response?.status ?? 500
    res.status(status).json({ error: err.message })
  }
})

// Name search — served from cache only (fast type-ahead)
router.get('/sets/search', async (req, res) => {
  const q = req.query.q?.trim()
  if (!q) return res.json([])

  const rows = db.prepare(`
    SELECT s.*, m.num_figs
    FROM sets s
    LEFT JOIN set_minifigs m ON m.set_num = s.set_num
    WHERE s.name LIKE ? OR s.set_num LIKE ?
    LIMIT 30
  `).all(`%${q}%`, `%${q}%`)

  res.json(rows.map(mapCachedSet))
})

// Cache status — surfaced in Settings page
router.get('/cache-status', (req, res) => {
  const row = db.prepare("SELECT value FROM cache_meta WHERE key = 'cacheUpdatedAt'").get()
  res.json({ cacheUpdatedAt: row?.value ?? null })
})

function mapCachedSet(row) {
  return {
    setNumber:    row.set_num,
    name:         row.name,
    theme:        row.theme_name ?? '',
    subTheme:     null,
    pieceCount:   row.num_parts ?? 0,
    minifigCount: row.num_figs ?? 0,
    imageUrl:     row.img_url ?? null,
    isRetired:    row.is_retired === 1,
  }
}

module.exports = router
