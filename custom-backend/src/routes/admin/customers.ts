import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminCustomerRoutes(app: FastifyInstance) {
  app.get("/customers", { preHandler: requireAdmin }, async (req) => {
    const { limit = "20", offset = "0" } = req.query as any
    const customers = await prisma.customer.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    })
    const total = await prisma.customer.count()
    return { customers, total }
  })

  app.get("/customers/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: { include: { variant: { include: { product: { select: { title: true } } } } } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })
    if (!customer) return reply.status(404).send({ error: "Not found" })
    const { password: _, ...safe } = customer as any
    return { customer: safe }
  })
}
