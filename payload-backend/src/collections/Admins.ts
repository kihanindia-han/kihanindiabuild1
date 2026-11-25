import type { CollectionConfig } from "payload"

export const Admins: CollectionConfig = {
  slug: "admins",
  labels: { singular: "Admin", plural: "Admins" },
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: ({ req }) => req.user?.collection === "admins",
    create: ({ req }) => req.user?.collection === "admins",
    update: ({ req }) => req.user?.collection === "admins",
    delete: ({ req }) => req.user?.collection === "admins",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
}
