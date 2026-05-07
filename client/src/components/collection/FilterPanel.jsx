import { X } from 'lucide-react'
import useCollectionStore from '../../store/collectionStore'

const STATUSES = ['UNBUILT', 'BUILT', 'SEALED', 'SOLD']
const PURCHASE_TYPES = ['NEW', 'USED']
const SORT_OPTIONS = [
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'name',      label: 'Name A–Z' },
  { value: 'pieceCount', label: 'Piece Count' },
  { value: 'pricePaid', label: 'Price Paid' },
]

export default function FilterPanel({ open, onClose }) {
  const { filters, setFilter, sortBy, setSortBy, getThemes } = useCollectionStore()
  const themes = getThemes()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-72 bg-white dark:bg-zinc-900 h-full shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Status */}
          <FilterSection label="Status">
            <ChipGroup
              options={[{ value: null, label: 'All' }, ...STATUSES.map(s => ({ value: s, label: capitalize(s) }))]}
              selected={filters.status}
              onSelect={v => setFilter('status', v)}
            />
          </FilterSection>

          {/* Purchase Type */}
          <FilterSection label="Purchase Type">
            <ChipGroup
              options={[{ value: null, label: 'All' }, ...PURCHASE_TYPES.map(t => ({ value: t, label: capitalize(t) }))]}
              selected={filters.purchaseType}
              onSelect={v => setFilter('purchaseType', v)}
            />
          </FilterSection>

          {/* Show Sold */}
          <FilterSection label="Sold Sets">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showSold}
                onChange={e => setFilter('showSold', e.target.checked)}
                className="accent-brand"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show sold sets</span>
            </label>
          </FilterSection>

          {/* Retired */}
          <FilterSection label="Retired Sets">
            <ChipGroup
              options={[
                { value: null,  label: 'All' },
                { value: true,  label: 'Retired only' },
                { value: false, label: 'Exclude retired' },
              ]}
              selected={filters.isRetired}
              onSelect={v => setFilter('isRetired', v)}
            />
          </FilterSection>

          {/* Theme */}
          {themes.length > 0 && (
            <FilterSection label="Theme">
              <select
                value={filters.theme ?? ''}
                onChange={e => setFilter('theme', e.target.value || null)}
                className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All themes</option>
                {themes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FilterSection>
          )}

          {/* Sort */}
          <FilterSection label="Sort by">
            <ChipGroup
              options={SORT_OPTIONS}
              selected={sortBy}
              onSelect={setSortBy}
            />
          </FilterSection>
        </div>
      </div>
    </div>
  )
}

function FilterSection({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      {children}
    </div>
  )
}

function ChipGroup({ options, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={String(opt.value)}
          onClick={() => onSelect(opt.value)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            selected === opt.value
              ? 'bg-brand border-brand text-white'
              : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-brand hover:text-brand'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function capitalize(str) {
  return str.charAt(0) + str.slice(1).toLowerCase()
}
