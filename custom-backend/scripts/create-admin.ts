import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const email = "syed.usman701@gmail.com"
  const password = "Kihan@Admin@2026"

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin user already exists:", email)
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.create({ data: { email, password: passwordHash } })
  console.log("Admin user created:", email)
  console.log("Password:", password)
}

main().catch(console.error).finally(() => prisma.$disconnect())
