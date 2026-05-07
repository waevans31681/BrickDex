import { Archive, Plus } from 'lucide-react'

export default function EmptyState({ onAddSet }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-5">
        <Archive size={36} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No sets found</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Start building your collection</p>
      <button
        onClick={onAddSet}
        className="flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-hover transition-colors"
      >
        <Plus size={18} />
        Add Your First Set
      </button>
    </div>
  )
}
