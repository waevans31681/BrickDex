import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import useCollectionStore from '../../store/collectionStore'

const STATUS_BADGE = {
  UNBUILT: { label: 'Unbuilt', color: 'gray' },
  BUILT:   { label: 'Built',   color: 'blue' },
  SEALED:  { label: 'Sealed',  color: 'amber' },
  SOLD:    { label: 'Sold',    color: 'red' },
}

export default function SetDetailModal({ set, onClose }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...set })
  const [saving, setSaving] = useState(false)
  const { updateSet, deleteSet } = useCollectionStore()

  const badge = STATUS_BADGE[set.status] ?? STATUS_BADGE.UNBUILT

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSet(set.id, form)
      setEditing(false)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Permanently delete "${set.name}" from your collection?`)) return
    await deleteSet(set.id)
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Set' : set.name}>
      {!editing ? (
        <div className="space-y-4">
          {/* Image */}
          {set.imageUrl && (
            <div className="flex justify-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4">
              <img src={set.imageUrl} alt={set.name} className="max-h-40 object-contain" />
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color={badge.color}>{badge.label}</Badge>
            {set.purchaseType && <Badge color="gray">{set.purchaseType === 'NEW' ? 'New' : 'Used'}</Badge>}
            {set.isRetired && <Badge color="amber">Retired</Badge>}
          </div>

          {/* Details grid */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Detail label="Set #" value={set.setNumber} />
            <Detail label="Theme" value={set.theme} />
            {set.subTheme && <Detail label="Sub-theme" value={set.subTheme} />}
            <Detail label="Pieces" value={set.pieceCount?.toLocaleString()} />
            <Detail label="Minifigs" value={set.minifigCount} />
            {set.retailPrice && <Detail label="Retail" value={`$${Number(set.retailPrice).toFixed(2)}`} />}
            {set.pricePaid   && <Detail label="Paid"   value={`$${Number(set.pricePaid).toFixed(2)}`} />}
            {set.purchaseDate && <Detail label="Purchased" value={set.purchaseDate} />}
            {set.purchaseSource && <Detail label="Source" value={set.purchaseSource} />}
            {set.location && <Detail label="Location" value={set.location} />}
          </dl>

          {set.notes && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{set.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      ) : (
        // Edit form — same fields as AddSetModal details step
        <div className="space-y-4">
          <Field label="Build Status">
            <select value={form.status} onChange={e => handleFieldChange('status', e.target.value)} className={selectClass}>
              <option value="UNBUILT">Unbuilt</option>
              <option value="BUILT">Built</option>
              <option value="SEALED">Sealed</option>
              <option value="SOLD">Sold</option>
            </select>
          </Field>
          <Field label="Purchase Type">
            <select value={form.purchaseType ?? ''} onChange={e => handleFieldChange('purchaseType', e.target.value || null)} className={selectClass}>
              <option value="">— none —</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
            </select>
          </Field>
          <Field label="Retail Price ($)">
            <input type="number" step="0.01" value={form.retailPrice ?? ''} onChange={e => handleFieldChange('retailPrice', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Price Paid ($)">
            <input type="number" step="0.01" value={form.pricePaid ?? ''} onChange={e => handleFieldChange('pricePaid', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Purchase Date">
            <input type="date" value={form.purchaseDate ?? ''} onChange={e => handleFieldChange('purchaseDate', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Purchase Source">
            <input type="text" value={form.purchaseSource ?? ''} onChange={e => handleFieldChange('purchaseSource', e.target.value)} placeholder="LEGO Store, eBay…" className={inputClass} />
          </Field>
          <Field label="Location">
            <input type="text" value={form.location ?? ''} onChange={e => handleFieldChange('location', e.target.value)} placeholder="Shelf B, Attic Box 3…" className={inputClass} />
          </Field>
          <Field label="Notes">
            <textarea value={form.notes ?? ''} onChange={e => handleFieldChange('notes', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setEditing(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function Detail({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <dt className="text-xs text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900 dark:text-white">{value}</dd>
    </div>
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
const selectClass = inputClass
