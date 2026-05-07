import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import Header from './components/layout/Header'
import CollectionTab from './components/collection/CollectionTab'
import WishlistTab from './components/wishlist/WishlistTab'
import AddSetModal from './components/modals/AddSetModal'

const TABS = { COLLECTION: 'collection', WISHLIST: 'wishlist' }

export default function App() {
  const { isDark, toggle } = useTheme()
  const [activeTab, setActiveTab] = useState(TABS.COLLECTION)
  const [showAddSet, setShowAddSet] = useState(false)

  const addMode = activeTab === TABS.WISHLIST ? 'wishlist' : 'collection'

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onThemeToggle={toggle}
        onAddSet={() => setShowAddSet(true)}
      />

      <main className="flex-1">
        {activeTab === TABS.COLLECTION && (
          <CollectionTab onAddSet={() => setShowAddSet(true)} />
        )}
        {activeTab === TABS.WISHLIST && (
          <WishlistTab onAddItem={() => setShowAddSet(true)} />
        )}
      </main>

      <AddSetModal
        open={showAddSet}
        onClose={() => setShowAddSet(false)}
        mode={addMode}
      />
    </div>
  )
}
