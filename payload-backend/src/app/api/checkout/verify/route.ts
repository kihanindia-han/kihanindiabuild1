import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await req.json()

    // Verify signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body)
      .digest("hex")

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update order to paid
    const order = await payload.update({
      collection: "orders",
      id: orderId,
      data: {
        razorpayPaymentId,
        paymentStatus: "paid",
        status: "confirmed",
      },
    })

    // Decrement stock
    for (const item of order.items as any[]) {
      const variant = await payload.findByID({
        collection: "product-variants",
        id: typeof item.variant === "object" ? item.variant.id : item.variant,
      })
      await payload.update({
        collection: "product-variants",
        id: typeof item.variant === "object" ? item.variant.id : item.variant,
        data: { stock: Math.max(0, (variant.stock || 0) - item.quantity) },
      })
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err: any) {
    console.error("Verify error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
