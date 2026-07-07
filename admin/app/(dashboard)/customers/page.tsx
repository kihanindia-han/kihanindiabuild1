"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCustomers().then((d) => { setCustomers(d.customers || []); setLoading(false) })
  }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Customers</h1>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading...</p>
      ) : customers.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No customers yet</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{`${c.firstName || ""} ${c.lastName || ""}`.trim() || "—"}</p>
                    <p className="text-xs text-stone-400">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-500">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-stone-500">{c._count?.orders ?? 0}</td>
                  <td className="px-4 py-3 text-stone-500">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/customers/${c.id}`} className="text-stone-500 hover:text-stone-900">View</Link>
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
