import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { fetchSetByNumber, searchSets } from '../../api/rebrickable'
import useCollectionStore from '../../store/collectionStore'
import useWishlistStore from '../../store/wishlistStore'

const DEFAULT_FORM = {
  setNumber: '',
  name: '',
  theme: '',
  subTheme: '',
  pieceCount: '',
  minifigCount: '',
  retailPrice: '',
  pricePaid: '',
  purchaseDate: '',
  purchaseType: '',
  purchaseSource: '',
  status: 'UNBUILT',
  location: '',
  notes: '',
  imageUrl: '',
  isRetired: false,
}

export default function AddSetModal({ open, onClose, mode = 'collection' }) {
  const [step, setStep] = useState('lookup') // 'lookup' | 'details'
  const [lookupQuery, setLookupQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const { addSet } = useCollectionStore()
  const { addItem } = useWishlistStore()

  function handleClose() {
    setStep('lookup')
    setLookupQuery('')
    setSearchResults([])
    setForm(DEFAULT_FORM)
    setError(null)
    onClose()
  }

  async function handleLookupByNumber() {
    if (!lookupQuery.trim()) return
    setSearching(true)
    setError(null)
    try {
      const data = await fetchSetByNumber(lookupQuery.trim())
      populateForm(data)
      setStep('details')
    } catch {
      setError('Set not found. Try a name search below.')
    } finally {
      setSearching(false)
    }
  }

  async function handleSearch() {
    if (!lookupQuery.trim()) return
    setSearching(true)
    setError(null)
    try {
      const results = await searchSets(lookupQuery.trim())
      setSearchResults(results)
    } catch {
      setError('Search failed. Check the server connection.')
    } finally {
      setSearching(false)
    }
  }

  function populateForm(apiData) {
    setForm(prev => ({
      ...prev,
      setNumber:    apiData.setNumber ?? apiData.set_num ?? '',
      name:         apiData.name ?? '',
      theme:        apiData.theme ?? '',
      subTheme:     apiData.subTheme ?? '',
      pieceCount:   apiData.pieceCount ?? apiData.num_parts ?? '',
      minifigCount: apiData.minifigCount ?? apiData.num_figs ?? '',
      imageUrl:     apiData.imageUrl ?? apiData.img_url ?? '',
      isRetired:    apiData.isRetired ?? false,
    }))
    setSearchResults([])
  }

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.setNumber || !form.name) {
      setError('Set number and name are required.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        pieceCount:   form.pieceCount   ? Number(form.pieceCount)   : 0,
        minifigCount: form.minifigCount ? Number(form.minifigCount) : 0,
        retailPrice:  form.retailPrice  ? Number(form.retailPrice)  : null,
        pricePaid:    form.pricePaid    ? Number(form.pricePaid)    : null,
      }
      if (mode === 'wishlist') {
        await addItem(payload)
      } else {
        await addSet(payload)
      }
      handleClose()
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={mode === 'wishlist' ? 'Add to Wish List' : 'Add Set'}>
      {step === 'lookup' ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a set number to auto-fill details, or search by name.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={lookupQuery}
              onChange={e => setLookupQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLookupByNumber()}
              placeholder="Set number (e.g. 75192)"
              className="flex-1 text-sm px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <Button onClick={handleLookupByNumber} disabled={searching}>
              {searching ? '…' : 'Look up'}
            </Button>
          </div>

          <Button variant="secondary" className="w-full" onClick={handleSearch} disabled={searching}>
            Search by name
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {searchResults.length > 0 && (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(r => (
                <li key={r.setNumber ?? r.set_num}>
                  <button
                    onClick={() => { populateForm(r); setStep('details') }}
                    className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {(r.imageUrl || r.img_url) && (
                      <img
                        src={r.imageUrl ?? r.img_url}
                        alt={r.name}
                        className="w-10 h-10 object-contain rounded-lg bg-gray-100 dark:bg-zinc-700"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</p>
                      <p className="text-xs text-gray-400">#{r.setNumber ?? r.set_num} · {r.theme}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Auto-filled preview */}
          {form.imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <img src={form.imageUrl} alt={form.name} className="w-14 h-14 object-contain" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{form.name}</p>
                <p className="text-xs text-gray-400">#{form.setNumber} · {form.theme}</p>
                <p className="text-xs text-gray-400">{form.pieceCount} pieces · {form.minifigCount} figs</p>
              </div>
            </div>
          )}

          {/* User-entered fields */}
          {mode !== 'wishlist' && (
            <>
              <Field label="Build Status">
                <select
                  value={form.status}
                  onChange={e => handleFieldChange('status', e.target.value)}
                  className={selectClass}
                >
                  <option value="UNBUILT">Unbuilt</option>
                  <option value="BUILT">Built</option>
                  <option value="SEALED">Sealed</option>
                  <option value="SOLD">Sold</option>
                </select>
              </Field>

              <Field label="Purchase Type">
                <select
                  value={form.purchaseType}
                  onChange={e => handleFieldChange('purchaseType', e.target.value)}
                  className={selectClass}
                >
                  <option value="">— select —</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                </select>
              </Field>

              <Field label="Price Paid ($)">
                <input type="number" step="0.01" min="0" value={form.pricePaid}
                  onChange={e => handleFieldChange('pricePaid', e.target.value)}
                  placeholder="0.00" className={inputClass} />
              </Field>

              <Field label="Purchase Date">
                <input type="date" value={form.purchaseDate}
                  onChange={e => handleFieldChange('purchaseDate', e.target.value)}
                  className={inputClass} />
              </Field>
            </>
          )}

          <Field label="Retail Price ($)">
            <input type="number" step="0.01" min="0" value={form.retailPrice}
              onChange={e => handleFieldChange('retailPrice', e.target.value)}
              placeholder="0.00" className={inputClass} />
          </Field>

          {mode === 'wishlist' && (
            <Field label="Priority">
              <select value={form.priority ?? ''} onChange={e => handleFieldChange('priority', e.target.value || null)} className={selectClass}>
                <option value="">None</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </Field>
          )}

          <Field label="Notes">
            <textarea value={form.notes} onChange={e => handleFieldChange('notes', e.target.value)}
              rows={2} placeholder="Optional notes…"
              className={`${inputClass} resize-none`} />
          </Field>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep('lookup')}>
              Back
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full text-sm px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40'
const selectClass = `${inputClass}`
