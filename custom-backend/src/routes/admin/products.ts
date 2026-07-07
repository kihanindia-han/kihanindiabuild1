import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminProductRoutes(app: FastifyInstance) {
  // GET /admin/products
  app.get("/products", { preHandler: requireAdmin }, async (req, reply) => {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, collection: true },
      orderBy: { createdAt: "desc" },
    })
    return { products }
  })

  // GET /admin/products/:id
  app.get("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, collection: true },
    })
    if (!product) return reply.status(404).send({ error: "Not found" })
    return { product }
  })

  // POST /admin/products
  app.post("/products", { preHandler: requireAdmin }, async (req, reply) => {
    const body = req.body as any
    const product = await prisma.product.create({
      data: {
        title: body.title,
        handle: body.handle,
        description: body.description,
        status: body.status || "DRAFT",
        collectionId: body.collectionId || null,
        variants: { create: body.variants || [] },
      },
      include: { images: true, variants: true },
    })
    return reply.status(201).send({ product })
  })

  // PATCH /admin/products/:id
  app.patch("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const body = req.body as any
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        handle: body.handle,
        description: body.description,
        status: body.status,
        collectionId: body.collectionId,
      },
      include: { images: true, variants: true },
    })
    return { product }
  })

  // DELETE /admin/products/:id
  app.delete("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.product.delete({ where: { id } })
    return reply.status(204).send()
  })
}
