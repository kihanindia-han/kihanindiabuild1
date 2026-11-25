import { getPayload } from "payload"
import config from "@payload-config"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const SECRET = process.env.PAYLOAD_SECRET || "fallback"

// POST /api/store/auth — login or register
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config })
  const { action, email, password, firstName, lastName, phone } = await req.json()

  if (action === "register") {
    const existing = await payload.find({
      collection: "customers",
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs.length) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const customer = await payload.create({
      collection: "customers",
      data: { email, passwordHash, firstName, lastName, phone },
    })
    const token = jwt.sign({ id: customer.id, email: customer.email }, SECRET, { expiresIn: "30d" })
    return NextResponse.json({ token, customer: { id: customer.id, email, firstName, lastName } })
  }

  if (action === "login") {
    const result = await payload.find({
      collection: "customers",
      where: { email: { equals: email } },
      limit: 1,
    })
    const customer = result.docs[0]
    if (!customer || !customer.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, customer.passwordHash as string)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const token = jwt.sign({ id: customer.id, email: customer.email }, SECRET, { expiresIn: "30d" })
    return NextResponse.json({
      token,
      customer: { id: customer.id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName },
    })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
