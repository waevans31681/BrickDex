import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import db from '../db/db'

const useWishlistStore = create((set, get) => ({
  items: [],

  // --- Actions ---

  loadItems: async () => {
    const items = await db.wishlist.toArray()
    set({ items })
  },

  addItem: async (itemData) => {
    const record = {
      ...itemData,
      id: uuidv4(),
      userId: null, // v1.0: always null (ADR-004)
      dateAdded: new Date().toISOString(),
    }
    await db.wishlist.add(record)
    set(state => ({ items: [...state.items, record] }))
    return record
  },

  updateItem: async (id, changes) => {
    await db.wishlist.update(id, changes)
    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, ...changes } : i),
    }))
  },

  removeItem: async (id) => {
    await db.wishlist.delete(id)
    set(state => ({ items: state.items.filter(i => i.id !== id) }))
  },

  // Moves a wish list item into the collection, removing it from the wish list.
  // Returns the collection-ready data object; caller adds purchase fields before saving.
  prepareMove: (id) => {
    const item = get().items.find(i => i.id === id)
    if (!item) return null
    const { id: _id, userId: _u, dateAdded: _d, priority, ...rest } = item
    return rest // caller merges with purchase details then calls collectionStore.addSet
  },
}))

export default useWishlistStore
