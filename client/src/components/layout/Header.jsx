import { Archive, Settings, SlidersHorizontal, Plus, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import FilterPanel from '../collection/FilterPanel'

export default function Header({ activeTab, onTabChange, isDark, onThemeToggle, onAddSet }) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center">
            <Archive size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">BrickDex</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Tab bar + actions */}
      <div className="flex items-center gap-3 px-4 pb-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <nav className="flex gap-4 flex-1">
          <button
            onClick={() => onTabChange('collection')}
            className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
              activeTab === 'collection'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Collection
          </button>
          <button
            onClick={() => onTabChange('wishlist')}
            className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
              activeTab === 'wishlist'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Wish List
          </button>
        </nav>

        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-zinc-700 rounded-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>

        <button
          onClick={onAddSet}
          className="flex items-center gap-1.5 text-sm font-semibold bg-brand text-white rounded-full px-3 py-1.5 hover:bg-brand-hover transition-colors"
        >
          <Plus size={16} />
          Add Set
        </button>
      </div>

      <FilterPanel open={showFilters} onClose={() => setShowFilters(false)} />
    </>
  )
}
