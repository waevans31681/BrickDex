import { useEffect, useState } from 'react'
import { FileDown, Plus } from 'lucide-react'
import useWishlistStore from '../../store/wishlistStore'
import WishlistItem from './WishlistItem'
import EmptyState from './EmptyState'
import { exportWishlistPdf } from '../../utils/pdf'

export default function WishlistTab() {
  const { items, loadItems } = useWishlistStore()
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  async function handleExport() {
    setExporting(true)
    try {
      await exportWishlistPdf(items)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="px-4 pt-4 pb-6 bg-gray-100 dark:bg-zinc-950 min-h-full">
      {items.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} {items.length === 1 ? 'set' : 'sets'}
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 text-sm font-medium text-brand border border-brand rounded-full px-3 py-1.5 hover:bg-brand hover:text-white transition-colors disabled:opacity-50"
          >
            <FileDown size={14} />
            {exporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* TODO: Add to Wish List button / modal */}
    </div>
  )
}
