import type { CollectionConfig } from "payload"

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: { singular: "Order", plural: "Orders" },
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "status", "total", "email", "createdAt"],
  },
  access: {
    read: ({ req }) => req.user?.collection === "admins",
    create: () => true,
    update: ({ req }) => req.user?.collection === "admins",
    delete: ({ req }) => req.user?.collection === "admins",
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "paymentStatus",
      type: "select",
      defaultValue: "unpaid",
      options: [
        { label: "Unpaid", value: "unpaid" },
        { label: "Paid", value: "paid" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    {
      name: "items",
      type: "array",
      required: true,
      fields: [
        {
          name: "variant",
          type: "relationship",
          relationTo: "product-variants",
          required: true,
        },
        { name: "title", type: "text" },
        { name: "variantTitle", type: "text" },
        { name: "quantity", type: "number", required: true, min: 1 },
        { name: "price", type: "number", required: true, label: "Unit price (paise)" },
        { name: "thumbnail", type: "text" },
      ],
    },
    {
      name: "subtotal",
      type: "number",
      label: "Subtotal (paise)",
    },
    {
      name: "shipping",
      type: "number",
      defaultValue: 0,
      label: "Shipping (paise)",
    },
    {
      name: "total",
      type: "number",
      required: true,
      label: "Total (paise)",
    },
    {
      name: "shippingAddress",
      type: "group",
      fields: [
        { name: "name", type: "text" },
        { name: "line1", type: "text" },
        { name: "line2", type: "text" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "pincode", type: "text" },
        { name: "phone", type: "text" },
      ],
    },
    {
      name: "razorpayOrderId",
      type: "text",
      label: "Razorpay Order ID",
    },
    {
      name: "razorpayPaymentId",
      type: "text",
      label: "Razorpay Payment ID",
    },
    {
      name: "notes",
      type: "textarea",
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === "create" && !data.orderNumber) {
          data.orderNumber = `KH-${Date.now().toString(36).toUpperCase()}`
        }
        return data
      },
    ],
  },
}
