"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function NewProductPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    title: "",
    handle: "",
    description: "",
    status: "DRAFT",
    collectionId: "",
  })

  const [variants, setVariants] = useState([
    { title: "Default", sku: "", price: "", compareAtPrice: "", inventory: "0" },
  ])

  useEffect(() => {
    api.getCollections().then((d) => setCollections(d.collections || []))
  }, [])

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setForm((f) => ({ ...f, title, handle: slugify(title) }))
  }

  function updateVariant(i: number, field: string, value: string) {
    setVariants((v) => v.map((vv, idx) => (idx === i ? { ...vv, [field]: value } : vv)))
  }

  function addVariant() {
    setVariants((v) => [...v, { title: "", sku: "", price: "", compareAtPrice: "", inventory: "0" }])
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      await api.createProduct({
        ...form,
        collectionId: form.collectionId || null,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku || null,
          price: Math.round(parseFloat(v.price) * 100) || 0,
          compareAtPrice: v.compareAtPrice ? Math.round(parseFloat(v.compareAtPrice) * 100) : null,
          inventory: parseInt(v.inventory) || 0,
        })),
      })
      router.push("/products")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-semibold">New Product</h1>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
          <h2 className="font-medium text-stone-700">Details</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
            <input
              value={form.title}
              onChange={handleTitleChange}
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Handle (URL slug)</label>
            <input
              value={form.handle}
              onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
              required
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Collection</label>
              <select
                value={form.collectionId}
                onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))}
                className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
              >
                <option value="">None</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-stone-700">Variants</h2>
            <button type="button" onClick={addVariant} className="text-sm text-stone-500 hover:text-stone-900">
              + Add Variant
            </button>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="border border-stone-100 rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600">Variant {i + 1}</span>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 text-sm">
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Title</label>
                  <input
                    value={v.title}
                    onChange={(e) => updateVariant(i, "title", e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">SKU</label>
                  <input
                    value={v.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => updateVariant(i, "price", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Compare at Price (₹)</label>
                  <input
                    type="number"
                    value={v.compareAtPrice}
                    onChange={(e) => updateVariant(i, "compareAtPrice", e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Inventory</label>
                  <input
                    type="number"
                    value={v.inventory}
                    onChange={(e) => updateVariant(i, "inventory", e.target.value)}
                    min="0"
                    className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-stone-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded text-sm font-medium border border-stone-300 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
