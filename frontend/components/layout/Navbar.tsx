"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

const navItemStyle = (fg: string) => ({
  fontFamily: "var(--font-jost)",
  fontSize: "11px",
  fontWeight: 400,
  letterSpacing: "0.18em",
  color: fg,
  textDecoration: "none",
  paddingBottom: "2px",
  borderBottom: "1px solid transparent",
  transition: "border-color 0.2s ease",
})

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const opaque = menuOpen || scrolled
  const fg = opaque ? "var(--color-ink)" : "var(--color-cream)"

  return (
    <header
      className="w-full transition-colors duration-300"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: opaque ? "var(--color-cream)" : "transparent",
        height: "68px",
        borderBottom: opaque ? "1px solid var(--color-blush)" : "none",
      }}
    >
      <div
        className="w-full flex items-center justify-between h-full relative"
        style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}
      >
        {/* Left — MENU (mobile) or MENU text (desktop) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.18em",
            color: fg,
            paddingBottom: "2px",
            borderBottom: "1px solid transparent",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderBottomColor = fg)}
          onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "CLOSE" : "MENU"}
          {/* Hamburger icon only on mobile */}
          <span className="md:hidden">
            <MenuIcon open={menuOpen} />
          </span>
        </button>

        {/* Center — Wordmark */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-tan-pearl)",
            fontWeight: 400,
            fontSize: "1.35rem",
            letterSpacing: "0.38em",
            color: fg,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Kihan
        </Link>

        {/* Right — icons on mobile, text on desktop */}
        <div className="flex items-center gap-5">
          {/* Mobile: icons */}
          <Link
            href="/account"
            aria-label="Account"
            className="md:hidden transition-colors duration-300"
            style={{ color: fg }}
          >
            <AccountIcon />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="md:hidden transition-colors duration-300"
            style={{ color: fg }}
          >
            <CartIcon />
          </Link>

          {/* Desktop: text labels */}
          <Link
            href="/account"
            className="hidden md:inline-block transition-colors duration-300"
            style={navItemStyle(fg)}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = fg)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = "transparent")}
          >
            LOGIN
          </Link>
          <Link
            href="/cart"
            className="hidden md:inline-block transition-colors duration-300"
            style={navItemStyle(fg)}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = fg)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderBottomColor = "transparent")}
          >
            CART
          </Link>
        </div>
      </div>

      {/* Dropdown menu */}
      <div
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
          background: "var(--color-cream)",
          borderBottom: menuOpen ? "1px solid var(--color-blush)" : "none",
        }}
      >
        <nav className="w-full py-10 flex flex-col gap-6" style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "clamp(24px, 4vw, 56px)" }}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase transition-opacity hover:opacity-50"
              style={{ fontFamily: "var(--font-jost)", color: "var(--color-ink)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      {open ? (
        <>
          <line x1="1" y1="1" x2="17" y2="11" />
          <line x1="17" y1="1" x2="1" y2="11" />
        </>
      ) : (
        <>
          <line x1="0" y1="1" x2="18" y2="1" />
          <line x1="0" y1="6" x2="18" y2="6" />
          <line x1="0" y1="11" x2="18" y2="11" />
        </>
      )}
    </svg>
  )
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}
