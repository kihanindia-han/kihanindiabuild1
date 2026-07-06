import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "calc(100svh - 68px)", minHeight: "600px" }}>

      {/* Placeholder — swap with real image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ background: "linear-gradient(160deg, var(--color-blush) 0%, var(--color-stone) 60%, #9E8B78 100%)" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(28,28,28,0.18)" }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20" style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}>
        <p
          className="text-xs tracking-widest uppercase mb-6 md:mb-8"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-cream)", letterSpacing: "0.2em", opacity: 0.85 }}
        >
          New Arrivals
        </p>
        <h1
          className="mb-10 md:mb-14"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "var(--color-cream)",
            maxWidth: "14ch",
          }}
        >
          The pause you&apos;ve been waiting for.
        </h1>
        <Link
          href="/collections"
          className="inline-flex items-center gap-3 text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
          style={{ fontFamily: "var(--font-jost)", color: "var(--color-cream)", letterSpacing: "0.2em" }}
        >
          Explore Collections <span>→</span>
        </Link>
      </div>
    </section>
  )
}
