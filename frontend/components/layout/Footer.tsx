"use client"

import Link from "next/link"

const links = {
  Shop: [
    { label: "Jewellery", href: "/collections" },
    { label: "Journals", href: "/collections" },
    { label: "Bags", href: "/collections" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Contact", href: "/contact" },
  ],
  Policies: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Privacy", href: "/privacy" },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
      <div className="max-w-screen-xl mx-auto py-16 md:py-20" style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}>

        {/* Top — wordmark + tagline */}
        <div className="mb-16 md:mb-20">
          <p
            className="text-5xl md:text-7xl tracking-widest uppercase mb-4"
            style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, letterSpacing: "0.2em" }}
          >
            Kihan
          </p>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-jost)", color: "var(--color-stone)", letterSpacing: "0.18em" }}
          >
            Universe of Essentials
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p
                className="text-xs tracking-widest uppercase mb-5"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-stone)", letterSpacing: "0.16em" }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm"
                      style={{ fontFamily: "var(--font-jost)", color: "var(--color-cream)", opacity: 0.7 }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-5"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-stone)", letterSpacing: "0.16em" }}
            >
              Stay in Touch
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent border-b text-sm py-2 outline-none placeholder:opacity-40 w-full"
                style={{ borderColor: "var(--color-warm-gray)", fontFamily: "var(--font-jost)", color: "var(--color-cream)" }}
              />
              <button
                type="submit"
                className="text-xs tracking-widest uppercase text-left transition-opacity hover:opacity-60"
                style={{ fontFamily: "var(--font-jost)", color: "var(--color-stone)", letterSpacing: "0.18em" }}
              >
                Subscribe →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-jost)" }}>
            © {new Date().getFullYear()} Kihan India. All rights reserved.
          </p>
          <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-jost)" }}>
            Made with intention. Made in India.
          </p>
        </div>
      </div>
    </footer>
  )
}
