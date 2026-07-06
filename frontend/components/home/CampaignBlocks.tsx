import Link from "next/link"

const campaigns = [
  {
    label: "Jewellery",
    headline: "Worn every day.\nNot just for occasions.",
    cta: "Shop Jewellery",
    href: "/collections",
    bg: "linear-gradient(145deg, #C9B99A 0%, #A89078 100%)",
  },
  {
    label: "Journals & Bags",
    headline: "For slow mornings\nand mindful hands.",
    cta: "Shop Journals & Bags",
    href: "/collections",
    bg: "linear-gradient(145deg, #8C8279 0%, #5C5550 100%)",
  },
]

export default function CampaignBlocks() {
  return (
    <section className="w-full" style={{ background: "var(--color-cream)" }}>
      <div className="max-w-screen-xl mx-auto py-20 md:py-28" style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}>

        <p
          className="text-xs tracking-widest uppercase mb-14"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
        >
          Curated for you
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {campaigns.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group relative overflow-hidden block"
              style={{ aspectRatio: "3/4", background: c.bg }}
            >
              {/* Overlay on hover */}
              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: "rgba(28,28,28,0.15)" }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <p
                  className="text-xs tracking-widest uppercase mb-5"
                  style={{ fontFamily: "var(--font-jost)", color: "rgba(250,249,246,0.7)", letterSpacing: "0.18em" }}
                >
                  {c.label}
                </p>
                <h2
                  className="mb-8"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    lineHeight: 1.1,
                    color: "var(--color-cream)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {c.headline}
                </h2>
                <span
                  className="text-xs tracking-widest uppercase transition-opacity group-hover:opacity-60"
                  style={{ fontFamily: "var(--font-jost)", color: "var(--color-cream)", letterSpacing: "0.2em" }}
                >
                  {c.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
