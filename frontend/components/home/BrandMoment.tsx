export default function BrandMoment() {
  return (
    <section
      className="w-full py-28 md:py-40 flex flex-col md:flex-row items-end justify-between gap-12"
      style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}
      style={{ background: "var(--color-mist)" }}
    >
      {/* Large quote */}
      <p
        style={{
          fontFamily: "var(--font-cormorant)",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(2.2rem, 5vw, 5rem)",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
          maxWidth: "22ch",
        }}
      >
        Things that ask nothing of you. Except to be still.
      </p>

      {/* Right — small label */}
      <p
        className="text-xs tracking-widest uppercase shrink-0"
        style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
      >
        Kihan India
      </p>
    </section>
  )
}
