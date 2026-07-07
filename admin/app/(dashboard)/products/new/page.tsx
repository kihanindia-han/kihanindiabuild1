"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

const emptyVariant = () => ({ title: "Default", sku: "", barcode: "", price: "", compareAtPrice: "", stock: "0", weight: "" })

export default function NewProductPage() {
  const router = useRouter()
  const [collections, setCollections] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  const [form, setForm] = useState({
    title: "", handle: "", description: "", status: "DRAFT", collectionId: "",
    thumbnail: "", productType: "",
    weight: "", length: "", width: "", height: "",
    seoTitle: "", seoDescription: "",
  })

  const [variants, setVariants] = useState([emptyVariant()])
  const [options, setOptions] = useState<{ title: string; values: string }[]>([])

  useEffect(() => {
    api.getCollections().then((d) => setCollections(d.collections || []))
  }, [])

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  function updateVariant(i: number, field: string, value: string) {
    setVariants((v) => v.map((vv, idx) => (idx === i ? { ...vv, [field]: value } : vv)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      await api.createProduct({
        ...form,
        collectionId: form.collectionId || null,
        tags,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku || null,
          barcode: v.barcode || null,
          price: Math.round(parseFloat(v.price) * 100) || 0,
          compareAtPrice: v.compareAtPrice ? Math.round(parseFloat(v.compareAtPrice) * 100) : null,
          stock: parseInt(v.stock) || 0,
          weight: v.weight || null,
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
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">← Back</button>
        <h1 className="text-xl font-semibold">New Product</h1>
      </div>

      {error && <div className="mb-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Details ── */}
        <Section title="Details">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, handle: slugify(e.target.value) }))} required className={input} />
          </Field>
          <Field label="Handle">
            <input value={form.handle} onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))} required className={`${input} font-mono`} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className={input} />
          </Field>
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
            <Field label="Product Type">
              <input value={form.productType} onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value }))} className={input} placeholder="e.g. Bag, Pouch" />
            </Field>
          </div>
          <Field label="Tags (comma separated)">
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={input} placeholder="handmade, cotton, summer" />
          </Field>
        </Section>

        {/* ── Media ── */}
        <Section title="Media">
          <Field label="Thumbnail URL">
            <input value={form.thumbnail} onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))} className={input} placeholder="https://..." />
          </Field>
          {form.thumbnail && <img src={form.thumbnail} alt="thumbnail" className="h-32 w-32 object-cover rounded border border-stone-200" />}
        </Section>

        {/* ── Variants ── */}
        <Section title="Variants" action={<button type="button" onClick={() => setVariants((v) => [...v, emptyVariant()])} className="text-sm text-stone-500 hover:text-stone-900">+ Add Variant</button>}>
          {variants.map((v, i) => (
            <div key={i} className="border border-stone-100 rounded p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-stone-600">Variant {i + 1}</span>
                {variants.length > 1 && <button type="button" onClick={() => setVariants((vv) => vv.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 text-sm">Remove</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Title"><input value={v.title} onChange={(e) => updateVariant(i, "title", e.target.value)} className={input} /></Field>
                <Field label="SKU"><input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className={input} /></Field>
                <Field label="Barcode / EAN"><input value={v.barcode} onChange={(e) => updateVariant(i, "barcode", e.target.value)} className={input} /></Field>
                <Field label="Weight (grams)"><input type="number" value={v.weight} onChange={(e) => updateVariant(i, "weight", e.target.value)} min="0" className={input} /></Field>
                <Field label="Price (₹)"><input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} required min="0" step="0.01" className={input} /></Field>
                <Field label="Compare at Price (₹)"><input type="number" value={v.compareAtPrice} onChange={(e) => updateVariant(i, "compareAtPrice", e.target.value)} min="0" step="0.01" className={input} /></Field>
                <Field label="Stock"><input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} min="0" className={input} /></Field>
              </div>
            </div>
          ))}
        </Section>

        {/* ── Options ── */}
        <Section title="Options (Size, Color, etc.)" action={<button type="button" onClick={() => setOptions((o) => [...o, { title: "", values: "" }])} className="text-sm text-stone-500 hover:text-stone-900">+ Add Option</button>}>
          {options.length === 0 && <p className="text-sm text-stone-400">No options added. Options define variants like Size or Color.</p>}
          {options.map((o, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Field label="Option Name">
                <input value={o.title} onChange={(e) => setOptions((oo) => oo.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} className={input} placeholder="Size" />
              </Field>
              <Field label="Values (comma separated)">
                <input value={o.values} onChange={(e) => setOptions((oo) => oo.map((x, idx) => idx === i ? { ...x, values: e.target.value } : x))} className={input} placeholder="S, M, L, XL" />
              </Field>
              <button type="button" onClick={() => setOptions((oo) => oo.filter((_, idx) => idx !== i))} className="mt-6 text-red-400 hover:text-red-600 text-sm">Remove</button>
            </div>
          ))}
        </Section>

        {/* ── Shipping ── */}
        <Section title="Shipping & Dimensions">
          <div className="grid grid-cols-4 gap-3">
            <Field label="Weight (g)"><input type="number" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Length (mm)"><input type="number" value={form.length} onChange={(e) => setForm((f) => ({ ...f, length: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Width (mm)"><input type="number" value={form.width} onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))} min="0" className={input} /></Field>
            <Field label="Height (mm)"><input type="number" value={form.height} onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))} min="0" className={input} /></Field>
          </div>
        </Section>

        {/* ── SEO ── */}
        <Section title="SEO">
          <Field label="SEO Title">
            <input value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} className={input} placeholder={form.title} />
          </Field>
          <Field label="SEO Description">
            <textarea value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} rows={3} className={input} placeholder={form.description} />
          </Field>
        </Section>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="bg-stone-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded text-sm font-medium border border-stone-300 hover:bg-stone-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

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
