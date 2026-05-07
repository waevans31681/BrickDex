const cron = require('node-cron')
const { runFullImport, getCacheAge } = require('./csvImport')

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

// Run import on startup if cache is absent or older than 24 hours.
async function initCache() {
  const updatedAt = getCacheAge()
  const isStale = !updatedAt || (Date.now() - updatedAt.getTime() > TWENTY_FOUR_HOURS)

  if (isStale) {
    console.log('[Scheduler] Cache is stale or missing — running initial import…')
    await runFullImport()
  } else {
    console.log(`[Scheduler] Cache is fresh (last updated ${updatedAt.toISOString()})`)
  }
}

// Schedule a daily refresh at 03:00 AM.
function scheduleRefresh() {
  cron.schedule('0 3 * * *', async () => {
    console.log('[Scheduler] Running scheduled daily CSV refresh…')
    await runFullImport()
  })
}

module.exports = { initCache, scheduleRefresh }
