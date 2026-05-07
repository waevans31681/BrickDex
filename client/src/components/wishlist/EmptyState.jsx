import { Heart, Plus } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center mb-5">
        <Heart size={36} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No sets on your wish list</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Add sets you'd like to own</p>
      {/* TODO: wire Add button to AddSetModal in wishlist mode */}
      <button className="flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-hover transition-colors">
        <Plus size={18} />
        Add to Wish List
      </button>
    </div>
  )
}
