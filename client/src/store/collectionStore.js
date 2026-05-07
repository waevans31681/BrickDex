import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import db from '../db/db'

const useCollectionStore = create((set, get) => ({
  sets: [],
  searchQuery: '',
  filters: {
    status: null,       // null = all statuses
    theme: null,        // null = all themes
    purchaseType: null, // null | 'NEW' | 'USED'
    showSold: true,
    isRetired: null,    // null = all
  },
  sortBy: 'dateAdded', // 'dateAdded' | 'name' | 'pieceCount' | 'pricePaid'

  // --- Actions ---

  loadSets: async () => {
    const sets = await db.sets.toArray()
    set({ sets })
  },

  addSet: async (setData) => {
    const now = new Date().toISOString()
    const record = {
      ...setData,
      id: uuidv4(),
      userId: null, // v1.0: always null (ADR-004)
      dateAdded: now,
      dateUpdated: now,
    }
    await db.sets.add(record)
    set(state => ({ sets: [...state.sets, record] }))
    return record
  },

  updateSet: async (id, changes) => {
    const updated = { ...changes, dateUpdated: new Date().toISOString() }
    await db.sets.update(id, updated)
    set(state => ({
      sets: state.sets.map(s => s.id === id ? { ...s, ...updated } : s),
    }))
  },

  deleteSet: async (id) => {
    await db.sets.delete(id)
    set(state => ({ sets: state.sets.filter(s => s.id !== id) }))
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setFilter: (key, value) =>
    set(state => ({ filters: { ...state.filters, [key]: value } })),

  setSortBy: (sortBy) => set({ sortBy }),

  // --- Derived ---

  getFilteredSets: () => {
    const { sets, searchQuery, filters, sortBy } = get()
    let result = [...sets]

    if (!filters.showSold) {
      result = result.filter(s => s.status !== 'SOLD')
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status)
    }
    if (filters.theme) {
      result = result.filter(s => s.theme === filters.theme)
    }
    if (filters.purchaseType) {
      result = result.filter(s => s.purchaseType === filters.purchaseType)
    }
    if (filters.isRetired !== null) {
      result = result.filter(s => s.isRetired === filters.isRetired)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.setNumber?.toLowerCase().includes(q) ||
        s.theme?.toLowerCase().includes(q) ||
        s.notes?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':       return (a.name || '').localeCompare(b.name || '')
        case 'pieceCount': return (b.pieceCount || 0) - (a.pieceCount || 0)
        case 'pricePaid':  return (b.pricePaid || 0) - (a.pricePaid || 0)
        default:           return new Date(b.dateAdded) - new Date(a.dateAdded)
      }
    })

    return result
  },

  getStats: () => {
    const { sets } = get()
    const active = sets.filter(s => s.status !== 'SOLD')
    return {
      totalSets:   active.length,
      totalPieces: active.reduce((sum, s) => sum + (s.pieceCount || 0), 0),
      sealedCount: sets.filter(s => s.status === 'SEALED').length,
      builtCount:  sets.filter(s => s.status === 'BUILT').length,
    }
  },

  getThemes: () => {
    const { sets } = get()
    return [...new Set(sets.map(s => s.theme).filter(Boolean))].sort()
  },
}))

export default useCollectionStore
