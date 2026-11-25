import type { CollectionConfig } from "payload"

export const ProductCollections: CollectionConfig = {
  slug: "product-collections",
  labels: { singular: "Collection", plural: "Collections" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "handle", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "handle",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL-safe slug, e.g. summer-collection" },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
  ],
}
