import { getPayload } from "payload"
import config from "@payload-config"
import { NextResponse } from "next/server"

export async function GET() {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: "product-collections",
    depth: 1,
    limit: 100,
  })

  return NextResponse.json({ collections: result.docs })
}
