import Link from "next/link"

const posts = [
  {
    slug: "on-slowing-down",
    category: "Lifestyle",
    title: "On slowing down without falling behind.",
    date: "June 2026",
  },
  {
    slug: "brass-and-time",
    category: "Jewellery",
    title: "Why brass gets better with time.",
    date: "June 2026",
  },
  {
    slug: "the-ritual-of-writing",
    category: "Journals",
    title: "The small ritual of writing things down.",
    date: "May 2026",
  },
]

export default function JournalTeaser() {
  return (
    <section style={{ background: "var(--color-mist)" }}>
      <div className="w-full py-20 md:py-28" style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}>

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.18em" }}
            >
              Stories
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
              Words to sit with.
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden md:block text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-warm-gray)", letterSpacing: "0.16em" }}
          >
            All stories →
          </Link>
        </div>

        {/* Posts */}
        <div className="flex flex-col divide-y" style={{ borderColor: "var(--color-blush)" }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group flex items-start md:items-center justify-between gap-6 py-7"
            >
              <div className="flex items-start md:items-center gap-6 md:gap-10">
                <p
                  className="text-xs tracking-widest uppercase shrink-0 opacity-50 mt-1 md:mt-0 w-20"
                  style={{ fontFamily: "var(--font-jost)", letterSpacing: "0.14em" }}
                >
                  {post.category}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                    color: "var(--color-ink)",
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <p
                  className="hidden md:block text-xs opacity-40"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {post.date}
                </p>
                <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-warm-gray)" }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
