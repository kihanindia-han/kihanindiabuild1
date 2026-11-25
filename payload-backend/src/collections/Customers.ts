import type { CollectionConfig } from "payload"
import bcrypt from "bcryptjs"

export const Customers: CollectionConfig = {
  slug: "customers",
  labels: { singular: "Customer", plural: "Customers" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName", "createdAt"],
  },
  auth: false,
  access: {
    read: ({ req }) => {
      // Only admins can read customers via admin panel
      return req.user?.collection === "admins"
    },
    create: () => true, // storefront registration
    update: ({ req }) => req.user?.collection === "admins",
    delete: ({ req }) => req.user?.collection === "admins",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "passwordHash",
      type: "text",
      admin: { hidden: true },
    },
    {
      name: "addresses",
      type: "array",
      fields: [
        { name: "name", type: "text" },
        { name: "line1", type: "text" },
        { name: "line2", type: "text" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "pincode", type: "text" },
        { name: "phone", type: "text" },
        { name: "isDefault", type: "checkbox", defaultValue: false },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && data.password) {
          data.passwordHash = await bcrypt.hash(data.password, 10)
          delete data.password
        }
        return data
      },
    ],
  },
}
