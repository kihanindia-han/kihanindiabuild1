"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"

const input = "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<any>(null)

  const emptyForm = { title: "", handle: "", description: "", thumbnail: "" }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    api.getCollections().then((d) => {
      setCollections(d.collections || [])
      setLoading(false)
    })
  }, [])

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      if (editing) {
        const data = await api.updateCollection(editing.id, form)
        setCollections((c) => c.map((x) => x.id === editing.id ? data.collection : x))
        setEditing(null)
      } else {
        const data = await api.createCollection(form)
        setCollections((c) => [data.collection, ...c])
      }
      setForm(emptyForm)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(c: any) {
    setEditing(c)
    setForm({ title: c.title, handle: c.handle, description: c.description || "", thumbnail: c.thumbnail || "" })
  }

  function cancelEdit() {
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await api.deleteCollection(id)
    setCollections((c) => c.filter((x) => x.id !== id))
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-6">Collections</h1>

      <div className="bg-white border border-stone-200 rounded-lg p-6 mb-6">
        <h2 className="font-medium text-stone-700 mb-4">{editing ? `Edit: ${editing.title}` : "New Collection"}</h2>
        {error && <div className="mb-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Title</label>
              <input value={form.title} onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value, handle: editing ? f.handle : slugify(e.target.value) })) }} required className={input} placeholder="Summer Collection" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">Handle</label>
              <input value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} required className={`${input} font-mono`} placeholder="summer-collection" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={input} placeholder="A short description of this collection..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">Thumbnail URL</label>
            <input value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} className={input} placeholder="https://..." />
          </div>
          {form.thumbnail && <img src={form.thumbnail} alt="" className="h-20 w-20 object-cover rounded border border-stone-200" />}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-stone-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-stone-700 disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Collection"}
            </button>
            {editing && <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded text-sm border border-stone-300 hover:bg-stone-50">Cancel</button>}
          </div>
        </form>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading...</p>
      ) : collections.length === 0 ? (
        <p className="text-stone-400 text-sm">No collections yet.</p>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Collection</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Handle</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Products</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.thumbnail && <img src={c.thumbnail} alt="" className="h-8 w-8 object-cover rounded" />}
                      <span className="font-medium">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-500 font-mono">{c.handle}</td>
                  <td className="px-4 py-3 text-stone-500">{c._count?.products ?? 0}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => startEdit(c)} className="text-stone-500 hover:text-stone-900 text-sm">Edit</button>
                    <button onClick={() => handleDelete(c.id, c.title)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
