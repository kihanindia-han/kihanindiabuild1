import type { CollectionConfig } from "payload"

export const ProductVariants: CollectionConfig = {
  slug: "product-variants",
  labels: { singular: "Variant", plural: "Variants" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "product", "price", "stock", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "e.g. Small / Blue" },
    },
    {
      name: "sku",
      type: "text",
      label: "SKU",
    },
    {
      name: "barcode",
      type: "text",
    },
    // Price in paise (₹1 = 100 paise)
    {
      name: "price",
      type: "number",
      required: true,
      label: "Price (paise)",
      admin: { description: "Store in paise. ₹499 = 49900" },
    },
    {
      name: "compareAtPrice",
      type: "number",
      label: "Compare-at Price (paise)",
    },
    {
      name: "stock",
      type: "number",
      defaultValue: 0,
      label: "Stock Quantity",
    },
    {
      name: "weight",
      type: "number",
      label: "Weight (grams)",
    },
    // Which option values this variant represents
    {
      name: "optionValues",
      type: "array",
      label: "Option Values",
      admin: { description: "e.g. Size: M, Color: Blue" },
      fields: [
        { name: "option", type: "text", required: true, label: "Option Name" },
        { name: "value", type: "text", required: true, label: "Value" },
      ],
    },
  ],
}
