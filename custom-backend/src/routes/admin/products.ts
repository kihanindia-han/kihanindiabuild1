import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma"
import { requireAdmin } from "../../middleware/auth"

export default async function adminProductRoutes(app: FastifyInstance) {
  app.get("/products", { preHandler: requireAdmin }, async () => {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true, collection: true, options: { include: { values: true } } },
      orderBy: { createdAt: "desc" },
    })
    return { products }
  })

  app.get("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: { include: { optionValues: true } }, collection: true, options: { include: { values: true } } },
    })
    if (!product) return reply.status(404).send({ error: "Not found" })
    return { product }
  })

  app.post("/products", { preHandler: requireAdmin }, async (req, reply) => {
    const body = req.body as any
    const product = await prisma.product.create({
      data: {
        title: body.title,
        handle: body.handle,
        description: body.description || null,
        status: body.status || "DRAFT",
        thumbnail: body.thumbnail || null,
        tags: body.tags || [],
        productType: body.productType || null,
        weight: body.weight ? parseInt(body.weight) : null,
        length: body.length ? parseInt(body.length) : null,
        width: body.width ? parseInt(body.width) : null,
        height: body.height ? parseInt(body.height) : null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        collectionId: body.collectionId || null,
        variants: {
          create: (body.variants || []).map((v: any) => ({
            title: v.title,
            sku: v.sku || null,
            barcode: v.barcode || null,
            price: v.price,
            compareAtPrice: v.compareAtPrice || null,
            stock: v.stock || 0,
            weight: v.weight ? parseInt(v.weight) : null,
          })),
        },
      },
      include: { images: true, variants: true, options: { include: { values: true } } },
    })
    return reply.status(201).send({ product })
  })

  app.patch("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const body = req.body as any
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        handle: body.handle,
        description: body.description ?? null,
        status: body.status,
        thumbnail: body.thumbnail ?? null,
        tags: body.tags ?? [],
        productType: body.productType ?? null,
        weight: body.weight ? parseInt(body.weight) : null,
        length: body.length ? parseInt(body.length) : null,
        width: body.width ? parseInt(body.width) : null,
        height: body.height ? parseInt(body.height) : null,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        collectionId: body.collectionId || null,
      },
      include: { images: true, variants: true, options: { include: { values: true } } },
    })
    return { product }
  })

  app.delete("/products/:id", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    await prisma.product.delete({ where: { id } })
    return reply.status(204).send()
  })

  // ─── Images ───────────────────────────────────────────
  app.post("/products/:id/images", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { url, alt, position } = req.body as any
    const image = await prisma.productImage.create({
      data: { url, alt: alt || null, position: position || 0, productId: id },
    })
    return reply.status(201).send({ image })
  })

  app.delete("/products/:id/images/:imageId", { preHandler: requireAdmin }, async (req, reply) => {
    const { imageId } = req.params as { id: string; imageId: string }
    await prisma.productImage.delete({ where: { id: imageId } })
    return reply.status(204).send()
  })

  // ─── Variants ─────────────────────────────────────────
  app.post("/products/:id/variants", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const v = req.body as any
    const variant = await prisma.productVariant.create({
      data: {
        title: v.title,
        sku: v.sku || null,
        barcode: v.barcode || null,
        price: v.price,
        compareAtPrice: v.compareAtPrice || null,
        stock: v.stock || 0,
        weight: v.weight ? parseInt(v.weight) : null,
        productId: id,
      },
    })
    return reply.status(201).send({ variant })
  })

  app.patch("/products/:id/variants/:variantId", { preHandler: requireAdmin }, async (req, reply) => {
    const { variantId } = req.params as { id: string; variantId: string }
    const v = req.body as any
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        title: v.title,
        sku: v.sku || null,
        barcode: v.barcode || null,
        price: v.price,
        compareAtPrice: v.compareAtPrice || null,
        stock: v.stock ?? 0,
        weight: v.weight ? parseInt(v.weight) : null,
      },
    })
    return { variant }
  })

  app.delete("/products/:id/variants/:variantId", { preHandler: requireAdmin }, async (req, reply) => {
    const { variantId } = req.params as { id: string; variantId: string }
    await prisma.productVariant.delete({ where: { id: variantId } })
    return reply.status(204).send()
  })

  // ─── Options ──────────────────────────────────────────
  app.post("/products/:id/options", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string }
    const { title, values } = req.body as { title: string; values: string[] }
    const option = await prisma.productOption.create({
      data: {
        title,
        productId: id,
        values: { create: values.map((v) => ({ value: v })) },
      },
      include: { values: true },
    })
    return reply.status(201).send({ option })
  })

  app.delete("/products/:id/options/:optionId", { preHandler: requireAdmin }, async (req, reply) => {
    const { optionId } = req.params as { id: string; optionId: string }
    await prisma.productOption.delete({ where: { id: optionId } })
    return reply.status(204).send()
  })
}
