import { Trash2, MoveRight } from 'lucide-react'
import useWishlistStore from '../../store/wishlistStore'
import Badge from '../ui/Badge'

const PRIORITY_COLOR = { HIGH: 'red', MEDIUM: 'amber', LOW: 'gray' }

export default function WishlistItem({ item }) {
  const { removeItem } = useWishlistStore()

  async function handleRemove() {
    if (confirm(`Remove "${item.name}" from your wish list?`)) {
      await removeItem(item.id)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100 dark:border-zinc-700">
      {/* Image */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-zinc-700 rounded-xl overflow-hidden flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-2xl">🧱</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 dark:text-gray-500">#{item.setNumber}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate">
          {item.name}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{item.theme}</p>

        <div className="flex items-center gap-2">
          {item.priority && (
            <Badge color={PRIORITY_COLOR[item.priority] ?? 'gray'}>{item.priority}</Badge>
          )}
          {item.retailPrice && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ${item.retailPrice.toFixed(2)}
            </span>
          )}
        </div>
        {item.notes && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{item.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 items-center justify-center">
        <button
          onClick={handleRemove}
          className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Remove from wish list"
        >
          <Trash2 size={16} />
        </button>
        {/* TODO: Move to collection */}
        <button
          className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-brand transition-colors"
          aria-label="Move to collection"
        >
          <MoveRight size={16} />
        </button>
      </div>
    </div>
  )
}
