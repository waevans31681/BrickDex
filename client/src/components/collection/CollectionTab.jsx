import { useEffect } from 'react'
import useCollectionStore from '../../store/collectionStore'
import StatCards from './StatCards'
import SearchBar from './SearchBar'
import SetGrid from './SetGrid'
import EmptyState from './EmptyState'

export default function CollectionTab({ onAddSet }) {
  const { loadSets, sets, getFilteredSets, searchQuery, setSearchQuery } = useCollectionStore()

  useEffect(() => {
    loadSets()
  }, [])

  const filteredSets = getFilteredSets()

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-3 bg-white dark:bg-zinc-900">
        <StatCards />
      </div>

      <div className="px-4 py-3 bg-gray-100 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="px-4 pt-3 pb-6 bg-gray-100 dark:bg-zinc-950 flex-1">
        {filteredSets.length === 0 && sets.length === 0 ? (
          <EmptyState onAddSet={onAddSet} />
        ) : filteredSets.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-12">
            No sets match your search or filters.
          </p>
        ) : (
          <SetGrid sets={filteredSets} />
        )}
      </div>
    </div>
  )
}
