const https = require('https')
const zlib = require('zlib')
const { parse } = require('csv-parse')
const db = require('./db')

const CSV_URLS = {
  themes:           'https://cdn.rebrickable.com/media/downloads/themes.csv.gz',
  sets:             'https://cdn.rebrickable.com/media/downloads/sets.csv.gz',
  inventories:      'https://cdn.rebrickable.com/media/downloads/inventories.csv.gz',
  inventoryMinifigs:'https://cdn.rebrickable.com/media/downloads/inventory_minifigs.csv.gz',
}

// Streams a gzipped CSV from a URL, calling onRecord for each parsed row.
function streamCSV(url, onRecord) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} downloading ${url}`))
        return
      }
      const gunzip = zlib.createGunzip()
      const parser = parse({ columns: true, skip_empty_lines: true, trim: true })
      parser.on('readable', () => {
        let record
        while ((record = parser.read()) !== null) onRecord(record)
      })
      parser.on('error', reject)
      parser.on('end', resolve)
      res.on('error', reject)
      res.pipe(gunzip).pipe(parser)
    }).on('error', reject)
  })
}

async function importThemes() {
  console.log('[CSV] Importing themes…')
  const insert = db.prepare(
    'INSERT OR REPLACE INTO themes (id, parent_id, name) VALUES (?, ?, ?)'
  )
  const run = db.transaction((records) => {
    for (const r of records) {
      insert.run(
        parseInt(r.id, 10),
        r.parent_id ? parseInt(r.parent_id, 10) : null,
        r.name
      )
    }
  })

  const batch = []
  await streamCSV(CSV_URLS.themes, (r) => batch.push(r))
  run(batch)
  console.log(`[CSV] Themes: ${batch.length} rows`)
}

async function importSets() {
  console.log('[CSV] Importing sets…')

  // Build theme lookup map first (themes must be imported before sets)
  const themeMap = new Map()
  for (const row of db.prepare('SELECT id, name FROM themes').all()) {
    themeMap.set(row.id, row.name)
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO sets (set_num, name, year, theme_id, theme_name, num_parts, img_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const run = db.transaction((records) => {
    for (const r of records) {
      const themeId = parseInt(r.theme_id, 10)
      insert.run(
        r.set_num,
        r.name,
        parseInt(r.year, 10) || null,
        themeId || null,
        themeMap.get(themeId) ?? null,
        parseInt(r.num_parts, 10) || 0,
        r.img_url || null
      )
    }
  })

  const batch = []
  await streamCSV(CSV_URLS.sets, (r) => batch.push(r))
  run(batch)
  console.log(`[CSV] Sets: ${batch.length} rows`)
}

async function importMinifigs() {
  console.log('[CSV] Importing minifig counts…')

  // Step 1: build inventory_id → set_num map
  const inventoryMap = new Map()
  await streamCSV(CSV_URLS.inventories, (r) => {
    inventoryMap.set(r.id, r.set_num)
  })
  console.log(`[CSV] Loaded ${inventoryMap.size} inventory entries`)

  // Step 2: aggregate minifig quantities per set
  const figCounts = new Map()
  await streamCSV(CSV_URLS.inventoryMinifigs, (r) => {
    const setNum = inventoryMap.get(r.inventory_id)
    if (!setNum) return
    figCounts.set(setNum, (figCounts.get(setNum) ?? 0) + parseInt(r.quantity, 10))
  })
  console.log(`[CSV] Aggregated minifig counts for ${figCounts.size} sets`)

  // Step 3: upsert into set_minifigs
  const insert = db.prepare(
    'INSERT OR REPLACE INTO set_minifigs (set_num, num_figs) VALUES (?, ?)'
  )
  const run = db.transaction((entries) => {
    for (const [setNum, count] of entries) insert.run(setNum, count)
  })
  run([...figCounts.entries()])
}

async function runFullImport() {
  console.log('[CSV] Starting full Rebrickable CSV import…')
  const start = Date.now()
  try {
    await importThemes()
    await importSets()
    await importMinifigs()

    db.prepare("INSERT OR REPLACE INTO cache_meta (key, value) VALUES ('cacheUpdatedAt', ?)")
      .run(new Date().toISOString())

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`[CSV] Import complete in ${elapsed}s`)
  } catch (err) {
    console.error('[CSV] Import failed:', err.message)
    throw err
  }
}

function getCacheAge() {
  const row = db.prepare("SELECT value FROM cache_meta WHERE key = 'cacheUpdatedAt'").get()
  if (!row) return null
  return new Date(row.value)
}

module.exports = { runFullImport, getCacheAge }
