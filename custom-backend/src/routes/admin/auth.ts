import { FastifyInstance } from "fastify"
import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"

export default async function authRoutes(app: FastifyInstance) {
  // POST /admin/login
  app.post("/login", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string }

    const user = await prisma.adminUser.findUnique({ where: { email } })
    if (!user) return reply.status(401).send({ error: "Invalid credentials" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return reply.status(401).send({ error: "Invalid credentials" })

    const token = app.jwt.sign({ id: user.id, email: user.email }, { expiresIn: "7d" })
    return { token, user: { id: user.id, email: user.email, name: user.name } }
  })
}
