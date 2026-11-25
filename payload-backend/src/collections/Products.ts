import type { CollectionConfig } from "payload"

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Product", plural: "Products" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "collection", "updatedAt"],
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
      admin: { description: "URL slug, e.g. bamboo-journal" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "images",
      type: "array",
      label: "Gallery Images",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "collection",
      type: "relationship",
      relationTo: "product-collections",
      hasMany: false,
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
    },
    {
      name: "productType",
      type: "text",
      label: "Product Type",
    },
    // Options (Size, Color etc.)
    {
      name: "options",
      type: "array",
      label: "Product Options",
      fields: [
        { name: "title", type: "text", required: true, label: "Option Name (e.g. Size)" },
        {
          name: "values",
          type: "array",
          fields: [{ name: "value", type: "text", required: true }],
        },
      ],
    },
    // Shipping
    {
      name: "shipping",
      type: "group",
      label: "Shipping & Dimensions",
      fields: [
        { name: "weight", type: "number", label: "Weight (grams)" },
        { name: "length", type: "number", label: "Length (cm)" },
        { name: "width", type: "number", label: "Width (cm)" },
        { name: "height", type: "number", label: "Height (cm)" },
      ],
    },
    // SEO
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "title", type: "text", label: "Meta Title" },
        { name: "description", type: "textarea", label: "Meta Description" },
      ],
    },
  ],
}
