import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: { handle: string } }
) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "products",
    where: { handle: { equals: params.handle } },
    depth: 2,
    limit: 1,
  })

  if (!result.docs.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const product = result.docs[0]

  const variants = await payload.find({
    collection: "product-variants",
    where: { product: { equals: product.id } },
    depth: 0,
  })

  return NextResponse.json({ product: { ...product, variants: variants.docs } })
}
