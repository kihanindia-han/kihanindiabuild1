import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminCollectionRoutes(app: FastifyInstance) {
  app.get("/collections", { preHandler: requireAdmin }, async () => {
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    })
    return { collections }
  })

  app.post("/collections", { preHandler: requireAdmin }, async (req, reply) => {
    const { title, handle, description, thumbnail } = req.body as any
    const collection = await prisma.collection.create({
      data: { title, handle, description: description || null, thumbnail: thumbnail || null },
    })
    return reply.status(201).send({ collection })
  })

  app.patch("/collections/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { title, handle, description, thumbnail } = req.body as any
    const collection = await prisma.collection.update({
      where: { id },
      data: { title, handle, description: description ?? null, thumbnail: thumbnail ?? null },
    })
    return { collection }
  })

  app.delete("/collections/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.collection.delete({ where: { id } })
    return reply.status(204).send()
  })
}
