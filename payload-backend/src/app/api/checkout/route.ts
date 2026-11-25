import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const { items, email, shippingAddress, customerId } = body

    if (!items?.length || !email || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch variant prices from DB (never trust client-sent prices)
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const variant = await payload.findByID({
        collection: "product-variants",
        id: item.variantId,
        depth: 1,
      })

      if (!variant) {
        return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 })
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${variant.title}` },
          { status: 400 }
        )
      }

      const lineTotal = variant.price * item.quantity
      subtotal += lineTotal

      const product = variant.product as any
      orderItems.push({
        variant: variant.id,
        title: product?.title || "",
        variantTitle: variant.title,
        quantity: item.quantity,
        price: variant.price,
        thumbnail:
          typeof product?.thumbnail === "object"
            ? product.thumbnail?.url
            : product?.thumbnail || "",
      })
    }

    const shippingCost = subtotal >= 49900 ? 0 : 9900 // Free shipping over ₹499
    const total = subtotal + shippingCost

    // Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: total,
      currency: "INR",
      receipt: `kh-${Date.now()}`,
    })

    // Create order in Payload (unpaid, pending)
    const order = await payload.create({
      collection: "orders",
      data: {
        email,
        customer: customerId || undefined,
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        total,
        shippingAddress,
        razorpayOrderId: rzpOrder.id,
        status: "pending",
        paymentStatus: "unpaid",
      },
    })

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
