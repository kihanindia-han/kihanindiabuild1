"use client"

import Link from "next/link"
import { useState } from "react"

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

const panelBase: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  flex: 1,
  minHeight: "480px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "clamp(24px, 4vw, 48px)",
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <footer style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>

      {/* Top — 3 panels */}
      <div style={{ display: "flex", flexDirection: "row" as const }}>

        {/* Left — Our Story */}
        <div style={{
          ...panelBase,
          background: "linear-gradient(160deg, #2A2520 0%, #1C1C1C 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Subtle texture overlay */}
          <div style={{ position: "absolute", inset: 0, background: "url('/images/texture.png')", opacity: 0.04 }} />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", letterSpacing: "0.18em", color: "var(--color-stone)", textTransform: "uppercase" }}>
            Our Story
          </p>

          <div>
            <h2 style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.1,
              color: "var(--color-cream)",
              marginBottom: "2rem",
              maxWidth: "12ch",
            }}>
              Made slowly. Made with care.
            </h2>
            <Link
              href="/about"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                color: "var(--color-cream)",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "10px 20px",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
            >
              → Learn More
            </Link>
          </div>
        </div>

        {/* Right — Stay Connected */}
        <div style={{
          ...panelBase,
          background: "linear-gradient(160deg, var(--color-stone) 0%, #8C7A68 100%)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", letterSpacing: "0.18em", color: "rgba(28,28,28,0.6)", textTransform: "uppercase" }}>
            Stay Connected
          </p>

          <div>
            <h2 style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.1,
              color: "var(--color-ink)",
              marginBottom: "2rem",
              maxWidth: "14ch",
            }}>
              Join our quiet corner of the internet.
            </h2>

            {submitted ? (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", letterSpacing: "0.14em", color: "var(--color-ink)", opacity: 0.7 }}>
                Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(28,28,28,0.4)",
                    padding: "8px 0",
                    fontFamily: "var(--font-jost)",
                    fontSize: "13px",
                    color: "var(--color-ink)",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    alignSelf: "flex-start",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "var(--font-jost)",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: "var(--color-ink)",
                    textTransform: "uppercase",
                    border: "1px solid rgba(28,28,28,0.4)",
                    padding: "10px 20px",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(28,28,28,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(28,28,28,0.4)")}
                >
                  → Sign Up Today
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom — links + social */}
      <div style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)", paddingTop: "48px", paddingBottom: "48px" }}>

        {/* Link columns + social */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", marginBottom: "48px" }}>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", letterSpacing: "0.16em", color: "var(--color-stone)", textTransform: "uppercase", marginBottom: "20px" }}>
                {category}
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "var(--color-cream)", opacity: 0.65 }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", letterSpacing: "0.16em", color: "var(--color-stone)", textTransform: "uppercase", marginBottom: "20px" }}>
              Follow Us
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              <Link href="https://instagram.com" aria-label="Instagram" style={{ color: "var(--color-cream)", opacity: 0.65 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.65")}
              >
                <InstagramIcon />
              </Link>
              <Link href="https://pinterest.com" aria-label="Pinterest" style={{ color: "var(--color-cream)", opacity: 0.65 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "0.65")}
              >
                <PinterestIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", opacity: 0.35 }}>
            © {new Date().getFullYear()} Kihan India. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", opacity: 0.35 }}>
            Made with intention. Made in India.
          </p>
        </div>
      </div>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.76 1.26-5.33 1.26-5.33s-.32-.64-.32-1.59c0-1.49.86-2.6 1.94-2.6.91 0 1.36.68 1.36 1.5 0 .92-.58 2.29-.89 3.56-.25 1.06.53 1.93 1.58 1.93 1.9 0 3.17-2.43 3.17-5.3 0-2.18-1.47-3.81-4.12-3.81-3.01 0-4.9 2.25-4.9 4.77 0 .87.25 1.47.64 1.94.18.21.21.3.14.54-.05.17-.15.58-.2.74-.07.24-.27.33-.5.24-1.4-.57-2.05-2.1-2.05-3.82 0-2.84 2.4-6.26 7.15-6.26 3.82 0 6.34 2.77 6.34 5.74 0 3.93-2.17 6.87-5.38 6.87-1.08 0-2.09-.58-2.44-1.24l-.68 2.6c-.22.84-.68 1.68-1.06 2.33.8.24 1.63.37 2.5.37 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  )
}
