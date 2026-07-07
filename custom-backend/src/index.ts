import Fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"
import dotenv from "dotenv"

dotenv.config()

const app = Fastify({ logger: true })

// ─── Plugins ─────────────────────────────────────────────
app.register(cors, {
  origin: [
    process.env.STORE_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:3001",
  ],
  credentials: true,
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || "changeme",
})

// ─── Routes ──────────────────────────────────────────────
app.register(import("./routes/store/products"), { prefix: "/store" })
app.register(import("./routes/admin/products"), { prefix: "/admin" })
app.register(import("./routes/admin/auth"), { prefix: "/admin" })

// ─── Health ──────────────────────────────────────────────
app.get("/health", async () => ({ status: "ok" }))

// ─── Start ───────────────────────────────────────────────
const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 8081, host: "0.0.0.0" })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
