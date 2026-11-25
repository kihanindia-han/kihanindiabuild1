import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config })
  const { searchParams } = new URL(req.url)

  const collection = searchParams.get("collection")
  const limit = Number(searchParams.get("limit") || 20)
  const page = Number(searchParams.get("page") || 1)

  const where: Record<string, unknown> = { status: { equals: "published" } }
  if (collection) where["collection.handle"] = { equals: collection }

  const result = await payload.find({
    collection: "products",
    where,
    limit,
    page,
    depth: 2,
  })

  // For each product, fetch its variants
  const productsWithVariants = await Promise.all(
    result.docs.map(async (product) => {
      const variants = await payload.find({
        collection: "product-variants",
        where: { product: { equals: product.id } },
        depth: 0,
      })
      return { ...product, variants: variants.docs }
    })
  )

  return NextResponse.json({
    products: productsWithVariants,
    total: result.totalDocs,
    page: result.page,
    totalPages: result.totalPages,
  })
}
