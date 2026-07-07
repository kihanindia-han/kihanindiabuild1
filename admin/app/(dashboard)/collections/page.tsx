"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [handle, setHandle] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api.getCollections().then((d) => {
      setCollections(d.collections || [])
      setLoading(false)
    })
  }, [])

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const data = await api.createCollection({ title, handle })
      setCollections((c) => [data.collection, ...c])
      setTitle("")
      setHandle("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
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
        <h2 className="font-medium text-stone-700 mb-4">New Collection</h2>
        {error && (
          <div className="mb-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
        )}
        <form onSubmit={handleCreate} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setHandle(slugify(e.target.value)) }}
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
              placeholder="Summer Collection"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Handle</label>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500 font-mono"
              placeholder="summer-collection"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-stone-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Collection"}
          </button>
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
                <th className="text-left px-4 py-3 font-medium text-stone-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Handle</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {collections.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium">{c.title}</td>
                  <td className="px-4 py-3 text-stone-500 font-mono">{c.handle}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.title)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
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
