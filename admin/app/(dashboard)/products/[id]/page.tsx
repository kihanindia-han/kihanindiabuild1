"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"

const input = "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-500"

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-stone-700">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [collections, setCollections] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [product, setProduct] = useState<any>(null)
  const [tagsInput, setTagsInput] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newOptionTitle, setNewOptionTitle] = useState("")
  const [newOptionValues, setNewOptionValues] = useState("")

  const [form, setForm] = useState({
    title: "", handle: "", description: "", status: "DRAFT", collectionId: "",
    thumbnail: "", productType: "",
    weight: "", length: "", width: "", height: "",
    seoTitle: "", seoDescription: "",
  })

  useEffect(() => {
    Promise.all([api.getProduct(id), api.getCollections()]).then(([p, c]) => {
      const prod = p.product
      setProduct(prod)
      setForm({
        title: prod.title,
        handle: prod.handle,
        description: prod.description || "",
        status: prod.status,
        collectionId: prod.collectionId || "",
        thumbnail: prod.thumbnail || "",
        productType: prod.productType || "",
        weight: prod.weight?.toString() || "",
        length: prod.length?.toString() || "",
        width: prod.width?.toString() || "",
        height: prod.height?.toString() || "",
        seoTitle: prod.seoTitle || "",
        seoDescription: prod.seoDescription || "",
      })
      setTagsInput((prod.tags || []).join(", "))
      setCollections(c.collections || [])
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      const updated = await api.updateProduct(id, { ...form, collectionId: form.collectionId || null, tags })
      setProduct(updated.product)
      router.push("/products")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function addImage() {
    if (!newImageUrl.trim()) return
    const data = await api.addProductImage(id, { url: newImageUrl.trim(), position: product.images.length })
    setProduct((p: any) => ({ ...p, images: [...p.images, data.image] }))
    setNewImageUrl("")
  }

  async function deleteImage(imageId: string) {
    await api.deleteProductImage(id, imageId)
    setProduct((p: any) => ({ ...p, images: p.images.filter((img: any) => img.id !== imageId) }))
  }

  async function addOption() {
    if (!newOptionTitle.trim() || !newOptionValues.trim()) return
    const values = newOptionValues.split(",").map((v) => v.trim()).filter(Boolean)
    const data = await api.addOption(id, { title: newOptionTitle, values })
    setProduct((p: any) => ({ ...p, options: [...(p.options || []), data.option] }))
    setNewOptionTitle("")
    setNewOptionValues("")
  }

  async function deleteOption(optionId: string) {
    await api.deleteOption(id, optionId)
    setProduct((p: any) => ({ ...p, options: p.options.filter((o: any) => o.id !== optionId) }))
  }

  if (loading) return <p className="text-stone-400 text-sm">Loading...</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">← Back</button>
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${product.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-600"}`}>{product.status}</span>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">

        <Section title="Details">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required className={input} /></Field>
          <Field label="Handle"><input value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} required className={`${input} font-mono`} /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className={input} /></Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={input}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </Field>
            <Field label="Collection">
              <select value={form.collectionId} onChange={(e) => setForm((f) => ({ ...f, collectionId: e.target.value }))} className={input}>
                <option value="">None</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>
            <Field label="Product Type"><input value={form.productType} onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value }))} className={input} placeholder="e.g. Bag, Pouch" /></Field>
          </div>
          <Field label="Tags (comma separated)">
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={input} placeholder="handmade, cotton, summer" />
          </Field>
        </Section>

        <Section title="Media">
          <Field label="Thumbnail URL">
            <input value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} className={input} placeholder="https://..." />
          </Field>
          {form.thumbnail && <img src={form.thumbnail} alt="thumbnail" className="h-32 w-32 object-cover rounded border border-stone-200" />}

          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">Gallery Images</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {(product.images || []).map((img: any) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt={img.alt || ""} className="h-24 w-24 object-cover rounded border border-stone-200" />
                  <button type="button" onClick={() => deleteImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className={`${input} flex-1`} placeholder="Image URL to add..." />
              <button type="button" onClick={addImage} className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded text-sm text-stone-700">Add</button>
            </div>
          </div>
        </Section>

        <Section title="Variants">
          {(product.variants || []).map((v: any) => (
            <div key={v.id} className="border border-stone-100 rounded p-3 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{v.title}</span>
                <span className="text-stone-500">₹{(v.price / 100).toFixed(2)} · Stock: {v.stock}</span>
              </div>
              {v.sku && <p className="text-stone-400 text-xs">SKU: {v.sku}</p>}
            </div>
          ))}
          <p className="text-xs text-stone-400">To add or edit variants individually, use the API or come back — full variant editor coming soon.</p>
        </Section>

        <Section
          title="Options (Size, Color, etc.)"
          action={null}
        >
          {(product.options || []).map((o: any) => (
            <div key={o.id} className="flex items-center justify-between border border-stone-100 rounded p-3">
              <div>
                <p className="text-sm font-medium">{o.title}</p>
                <p className="text-xs text-stone-400">{o.values.map((v: any) => v.value).join(", ")}</p>
              </div>
              <button type="button" onClick={() => deleteOption(o.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
            </div>
          ))}
          <div className="flex gap-3 items-end">
            <Field label="Option Name"><input value={newOptionTitle} onChange={(e) => setNewOptionTitle(e.target.value)} className={input} placeholder="Size" /></Field>
            <Field label="Values (comma separated)"><input value={newOptionValues} onChange={(e) => setNewOptionValues(e.target.value)} className={input} placeholder="S, M, L, XL" /></Field>
            <button type="button" onClick={addOption} className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded text-sm text-stone-700 mb-0.5">Add</button>
          </div>
        </Section>

        <Section title="Shipping & Dimensions">
          <div className="grid grid-cols-4 gap-3">
            <Field label="Weight (g)"><input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Length (mm)"><input type="number" value={form.length} onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Width (mm)"><input type="number" value={form.width} onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Height (mm)"><input type="number" value={form.height} onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))} min="0" className={input} /></Field>
          </div>
        </Section>

        <Section title="SEO">
          <Field label="SEO Title"><input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} className={input} placeholder={form.title} /></Field>
          <Field label="SEO Description"><textarea value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} rows={3} className={input} /></Field>
        </Section>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="bg-stone-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded text-sm font-medium border border-stone-300 hover:bg-stone-50 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  )
}
