import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"

export default async function storeProductRoutes(app: FastifyInstance) {
  // GET /store/products
  app.get("/products", async (req, reply) => {
    const { collection, limit = "12", offset = "0" } = req.query as any
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(collection ? { collection: { handle: collection } } : {}),
      },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        collection: true,
      },
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: "desc" },
    })
    return { products }
  })

  // GET /store/products/:handle
  app.get("/products/:handle", async (req, reply) => {
    const { handle } = req.params as { handle: string }
    const product = await prisma.product.findUnique({
      where: { handle, status: "PUBLISHED" },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        collection: true,
      },
    })
    if (!product) return reply.status(404).send({ error: "Not found" })
    return { product }
  })
}
