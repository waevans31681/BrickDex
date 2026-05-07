import useCollectionStore from '../../store/collectionStore'

export default function StatCards() {
  const getStats = useCollectionStore(state => state.getStats)
  const { totalSets, totalPieces, sealedCount, builtCount } = getStats()

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Total Sets" value={totalSets} />
      <StatCard label="Total Pieces" value={totalPieces.toLocaleString()} />
      <StatCard
        label="Sealed"
        value={sealedCount}
        badge
        badgeColor="bg-amber-400 text-white"
      />
      <StatCard
        label="Built"
        value={builtCount}
        badge
        badgeColor="bg-blue-500 text-white"
      />
    </div>
  )
}

function StatCard({ label, value, badge = false, badgeColor = '' }) {
  return (
    <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      {badge ? (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      )}
    </div>
  )
}
