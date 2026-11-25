import { buildConfig } from "payload"
import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { s3Storage } from "@payloadcms/storage-s3"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import path from "path"
import { fileURLToPath } from "url"

import { Admins } from "./collections/Admins"
import { Customers } from "./collections/Customers"
import { Media } from "./collections/Media"
import { Orders } from "./collections/Orders"
import { ProductCollections } from "./collections/ProductCollections"
import { Products } from "./collections/Products"
import { ProductVariants } from "./collections/ProductVariants"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Configured =
  !!process.env.R2_ACCESS_KEY_ID &&
  !!process.env.R2_SECRET_ACCESS_KEY &&
  !!process.env.R2_ENDPOINT

export default buildConfig({
  admin: {
    user: Admins.slug,
    meta: {
      titleSuffix: "— Kihan India",
      favicon: "/favicon.ico",
    },
  },
  collections: [
    Admins,
    Media,
    Products,
    ProductVariants,
    ProductCollections,
    Orders,
    Customers,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "fallback-secret",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  plugins: [
    ...(r2Configured
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: "media",
                disableLocalStorage: true,
                generateFileURL: ({ filename: f }) =>
                  `${process.env.R2_PUBLIC_URL}/media/${f}`,
              },
            },
            bucket: process.env.R2_BUCKET || "kihan-media",
            config: {
              endpoint: process.env.R2_ENDPOINT,
              region: "auto",
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
              },
            },
          }),
        ]
      : []),
  ],
  cors: [
    process.env.STORE_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  csrf: [
    process.env.STORE_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],
  upload: {
    limits: {
      fileSize: 10_000_000, // 10MB
    },
  },
})
