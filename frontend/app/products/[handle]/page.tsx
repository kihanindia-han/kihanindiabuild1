export default function ProductPage({ params }: { params: { handle: string } }) {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-20">
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
      >
        Product
      </p>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(2rem, 5vw, 5rem)",
          color: "var(--color-ink)",
        }}
      >
        {params.handle.replace(/-/g, " ")}
      </h1>
      <p className="mt-16 text-sm opacity-40" style={{ fontFamily: "var(--font-jost)" }}>
        Full product page coming in Phase 3.
      </p>
    </div>
  )
}
