export default function CollectionsPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-20">
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
      >
        All Collections
      </p>
      <h1
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(2.5rem, 6vw, 6rem)",
          color: "var(--color-ink)",
          lineHeight: 0.95,
        }}
      >
        Everything Kihan.
      </h1>
      <p className="mt-16 text-sm opacity-40" style={{ fontFamily: "var(--font-jost)" }}>
        Products coming soon — connecting to Medusa in Phase 4.
      </p>
    </div>
  )
}
