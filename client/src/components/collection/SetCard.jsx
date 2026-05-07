import { useState } from 'react'
import Badge from '../ui/Badge'
import SetDetailModal from '../modals/SetDetailModal'

const STATUS_BADGE = {
  UNBUILT: { label: 'Unbuilt', color: 'gray' },
  BUILT:   { label: 'Built',   color: 'blue' },
  SEALED:  { label: 'Sealed',  color: 'amber' },
  SOLD:    { label: 'Sold',    color: 'red' },
}

export default function SetCard({ set }) {
  const [showDetail, setShowDetail] = useState(false)
  const badge = STATUS_BADGE[set.status] ?? STATUS_BADGE.UNBUILT
  const isSold = set.status === 'SOLD'

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className={`text-left bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-700 transition-opacity hover:opacity-90 active:scale-[0.98] ${isSold ? 'opacity-50' : ''}`}
      >
        {/* Set image */}
        <div className="w-full aspect-square bg-gray-100 dark:bg-zinc-700 flex items-center justify-center">
          {set.imageUrl ? (
            <img
              src={set.imageUrl}
              alt={set.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-4xl">🧱</span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">#{set.setNumber}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2">
            {set.name}
          </p>

          <div className="flex items-center justify-between gap-1">
            <Badge color={badge.color}>{badge.label}</Badge>
            {set.isRetired && (
              <span className="text-[10px] font-medium text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded">
                Retired
              </span>
            )}
          </div>

          {set.purchaseType && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
              {set.purchaseType === 'NEW' ? 'New' : 'Used'}
              {set.pricePaid ? ` · $${set.pricePaid.toFixed(2)}` : ''}
            </p>
          )}
        </div>
      </button>

      {showDetail && (
        <SetDetailModal set={set} onClose={() => setShowDetail(false)} />
      )}
    </>
  )
}
