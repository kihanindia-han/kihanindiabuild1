export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-20 md:py-32">
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
      >
        Our Story
      </p>
      <h1
        className="mb-16"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(2.5rem, 6vw, 6rem)",
          color: "var(--color-ink)",
          lineHeight: 0.95,
          maxWidth: "16ch",
        }}
      >
        Made with intention. Made in India.
      </h1>
      <p className="text-sm opacity-40" style={{ fontFamily: "var(--font-jost)" }}>
        Full about page coming in Phase 3.
      </p>
    </div>
  )
}
