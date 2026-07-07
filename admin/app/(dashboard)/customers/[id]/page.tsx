"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"

export default function CustomerDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCustomer(id).then((d) => { setCustomer(d.customer); setLoading(false) })
  }, [id])

  if (loading) return <p className="text-stone-400 text-sm">Loading...</p>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">← Back</button>
        <h1 className="text-xl font-semibold">{`${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.email}</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-700 mb-3">Details</h2>
          <div className="text-sm space-y-2">
            <div className="flex gap-4"><span className="text-stone-500 w-24">Email</span><span>{customer.email}</span></div>
            <div className="flex gap-4"><span className="text-stone-500 w-24">Phone</span><span>{customer.phone || "—"}</span></div>
            <div className="flex gap-4"><span className="text-stone-500 w-24">Joined</span><span>{new Date(customer.createdAt).toLocaleDateString("en-IN")}</span></div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-700 mb-4">Orders ({customer.orders?.length || 0})</h2>
          {customer.orders?.length === 0 ? (
            <p className="text-sm text-stone-400">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {customer.orders?.map((o: any) => (
                <div key={o.id} className="flex justify-between items-center text-sm border border-stone-100 rounded p-3">
                  <div>
                    <p className="font-mono text-xs text-stone-400">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-stone-600">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(o.total / 100).toFixed(2)}</p>
                    <p className="text-xs text-stone-400">{o.status}</p>
                  </div>
                  <Link href={`/orders/${o.id}`} className="text-stone-500 hover:text-stone-900 ml-4">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
