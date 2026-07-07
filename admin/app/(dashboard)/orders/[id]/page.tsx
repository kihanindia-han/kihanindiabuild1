"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
}

const NEXT_STATUS: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPED",
  SHIPPED: "DELIVERED",
}

export default function OrderDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    api.getOrder(id).then((d) => { setOrder(d.order); setLoading(false) })
  }, [id])

  async function advance() {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    setUpdating(true)
    const data = await api.updateOrderStatus(id, next)
    setOrder((o: any) => ({ ...o, status: data.order.status }))
    setUpdating(false)
  }

  async function cancel() {
    if (!confirm("Cancel this order?")) return
    setUpdating(true)
    const data = await api.updateOrderStatus(id, "CANCELLED")
    setOrder((o: any) => ({ ...o, status: data.order.status }))
    setUpdating(false)
  }

  if (loading) return <p className="text-stone-400 text-sm">Loading...</p>

  const addr = order.shippingAddress as any
  const next = NEXT_STATUS[order.status]

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 text-sm">← Back</button>
        <h1 className="text-xl font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h1>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>{order.status}</span>
      </div>

      <div className="space-y-4">
        {/* Actions */}
        {(next || order.status !== "CANCELLED") && (
          <div className="bg-white border border-stone-200 rounded-lg p-4 flex gap-3">
            {next && (
              <button onClick={advance} disabled={updating} className="bg-stone-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-stone-700 disabled:opacity-50">
                Mark as {next.charAt(0) + next.slice(1).toLowerCase()}
              </button>
            )}
            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <button onClick={cancel} disabled={updating} className="border border-red-300 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50 disabled:opacity-50">
                Cancel Order
              </button>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-700 mb-4">Items</h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.variant?.product?.title}</p>
                  <p className="text-stone-400">{item.variant?.title} × {item.quantity}</p>
                </div>
                <p className="font-medium">₹{((item.price * item.quantity) / 100).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-stone-100 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{(order.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-700 mb-3">Customer</h2>
          <p className="text-sm">{order.customer ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() : "Guest"}</p>
          <p className="text-sm text-stone-500">{order.email}</p>
        </div>

        {/* Shipping */}
        {addr && (
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <h2 className="font-medium text-stone-700 mb-3">Shipping Address</h2>
            <div className="text-sm text-stone-600 space-y-1">
              <p>{addr.name}</p>
              <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p>{addr.city}, {addr.state} {addr.pincode}</p>
              <p>{addr.phone}</p>
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="bg-white border border-stone-200 rounded-lg p-6">
          <h2 className="font-medium text-stone-700 mb-3">Payment</h2>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span className="text-stone-500">Status</span><span>{order.paymentStatus}</span></div>
            {order.razorpayOrderId && <div className="flex justify-between"><span className="text-stone-500">Razorpay Order</span><span className="font-mono text-xs">{order.razorpayOrderId}</span></div>}
            {order.razorpayPaymentId && <div className="flex justify-between"><span className="text-stone-500">Payment ID</span><span className="font-mono text-xs">{order.razorpayPaymentId}</span></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
