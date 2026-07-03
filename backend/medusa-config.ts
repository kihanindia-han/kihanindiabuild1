import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const required = (name: string): string => {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required environment variable: ${name}`)
  return val
}

const backendUrl = process.env.BACKEND_URL || "http://localhost:9000"

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: required("DATABASE_URL"),
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: required("COOKIE_SECRET"),
    },
  },
  admin: {
    backendUrl,
  },
  modules: [
    {
      resolve: "@medusajs/file-local",
      options: {
        upload_dir: "uploads",
        backend_url: backendUrl,
      },
    },
  ],
})
