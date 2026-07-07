"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts().then((data) => {
      setProducts(data.products)
      setLoading(false)
    })
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await api.deleteProduct(id)
    setProducts((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          href="/products/new"
          className="bg-stone-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          + New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No products yet</p>
          <p className="text-sm mt-1">Create your first product to get started</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Handle</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Variants</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-stone-500">{p.handle}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === "PUBLISHED"
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500">{p.variants?.length || 0}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link href={`/products/${p.id}`} className="text-stone-500 hover:text-stone-900">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="text-red-500 hover:text-red-700"
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
