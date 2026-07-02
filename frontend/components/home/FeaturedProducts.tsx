import Link from "next/link"

const placeholderProducts = [
  { id: "1", title: "Brass Hoop", price: "₹1,299", category: "Jewellery", slug: "brass-hoop" },
  { id: "2", title: "Bamboo Journal", price: "₹599", category: "Journals", slug: "bamboo-journal" },
  { id: "3", title: "Wristlet Bag", price: "₹899", category: "Bags", slug: "wristlet-bag" },
  { id: "4", title: "Brass Cuff", price: "₹1,499", category: "Jewellery", slug: "brass-cuff" },
]

export default function FeaturedProducts() {
  return (
    <section style={{ background: "var(--color-cream)" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
            >
              Hand-picked
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color: "var(--color-ink)",
                lineHeight: 1,
              }}
            >
              Things worth keeping.
            </h2>
          </div>
          <Link
            href="/collections"
            className="hidden md:block text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.16em" }}
          >
            View all →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {placeholderProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              {/* Image placeholder */}
              <div
                className="w-full mb-4 overflow-hidden"
                style={{ aspectRatio: "3/4", background: "var(--color-blush)" }}
              >
                <div
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, var(--color-blush), var(--color-stone))" }}
                />
              </div>

              {/* Info */}
              <p
                className="text-xs tracking-widest uppercase mb-1.5 opacity-50"
                style={{ fontFamily: "var(--font-jost)", letterSpacing: "0.14em" }}
              >
                {product.category}
              </p>
              <p
                className="mb-1"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 400, fontSize: "1.125rem", color: "var(--color-ink)" }}
              >
                {product.title}
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-jost)", fontWeight: 300, color: "var(--color-warm-gray)" }}
              >
                {product.price}
              </p>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-12 text-center md:hidden">
          <Link
            href="/collections"
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.16em" }}
          >
            View all →
          </Link>
        </div>
      </div>
    </section>
  )
}
