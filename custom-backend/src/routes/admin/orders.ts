import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminOrderRoutes(app: FastifyInstance) {
  app.get("/orders", { preHandler: requireAdmin }, async (req) => {
    const { status, limit = "20", offset = "0" } = req.query as any
    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        customer: { select: { id: true, email: true, firstName: true, lastName: true } },
        items: { include: { variant: { include: { product: { select: { title: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    })
    const total = await prisma.order.count({ where: status ? { status } : undefined })
    return { orders, total }
  })

  app.get("/orders/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { variant: { include: { product: true } } } },
      },
    })
    if (!order) return reply.status(404).send({ error: "Not found" })
    return { order }
  })

  app.patch("/orders/:id/status", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { status } = req.body as { status: string }
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
    })
    return { order }
  })
}
