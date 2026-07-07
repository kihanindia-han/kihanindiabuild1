import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminCollectionRoutes(app: FastifyInstance) {
  app.get("/collections", { preHandler: requireAdmin }, async () => {
    const collections = await prisma.collection.findMany({ orderBy: { createdAt: "desc" } })
    return { collections }
  })

  app.post("/collections", { preHandler: requireAdmin }, async (req, reply) => {
    const { title, handle } = req.body as any
    const collection = await prisma.collection.create({ data: { title, handle } })
    return reply.status(201).send({ collection })
  })

  app.delete("/collections/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.collection.delete({ where: { id } })
    return reply.status(204).send()
  })
}
