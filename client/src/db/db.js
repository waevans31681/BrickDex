import Dexie from 'dexie'

const db = new Dexie('BrickDexDB')

// Version 1: v1.0 schema
// userId is indexed but always null in v1.0 — populated in v2.0, privacy boundary in v3.0 (ADR-004)
db.version(1).stores({
  sets:     'id, setNumber, status, theme, userId, isRetired, purchaseType',
  wishlist: 'id, setNumber, userId',
})

export default db
