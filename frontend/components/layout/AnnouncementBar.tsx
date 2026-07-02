"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Message = {
  id: string
  text: string
  linkText?: string
  linkUrl?: string
}

type Config = {
  messages: Message[]
  rotation_speed: number
  background_color: string
  text_color: string
  font_family: string
}

const FALLBACK: Config = {
  messages: [
    { id: "1", text: "FREE SHIPPING ON ALL ORDERS" },
    { id: "2", text: "NEW COLLECTION — SHOP NOW", linkText: "SHOP NOW", linkUrl: "/collections" },
    { id: "3", text: "HANDCRAFTED IN INDIA" },
  ],
  rotation_speed: 3500,
  background_color: "#1C1C1C",
  text_color: "#FAF9F6",
  font_family: "Jost",
}

function renderMessage(msg: Message, textColor: string) {
  if (!msg.linkText || !msg.linkUrl || !msg.text.includes(msg.linkText)) {
    return <span>{msg.text}</span>
  }
  const parts = msg.text.split(msg.linkText)
  return (
    <>
      {parts[0]}
      <Link href={msg.linkUrl} style={{ color: textColor, textDecoration: "underline", textUnderlineOffset: "3px" }}>
        {msg.linkText}
      </Link>
      {parts[1]}
    </>
  )
}

// Maps admin font names to CSS variables or system fonts
function resolveFontFamily(name: string): string {
  if (name === "Jost") return "var(--font-jost)"
  if (name === "Cormorant Garamond") return "var(--font-cormorant)"
  return name
}

export default function AnnouncementBar() {
  const [cfg, setCfg] = useState<Config>(FALLBACK)
  const [activeIdx, setActiveIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/store/announcement-bar`
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.messages?.length) setCfg(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (cfg.messages.length <= 1) return
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % cfg.messages.length)
        setVisible(true)
      }, 350)
    }, cfg.rotation_speed)
    return () => clearInterval(t)
  }, [cfg.messages.length, cfg.rotation_speed])

  const msg = cfg.messages[activeIdx] ?? cfg.messages[0]
  if (!msg) return null

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{
        background: cfg.background_color,
        height: 40,
        transition: "background 0.5s ease",
      }}
    >
      <p
        style={{
          fontFamily: resolveFontFamily(cfg.font_family),
          fontWeight: 400,
          fontSize: 12,
          letterSpacing: "0.14em",
          color: cfg.text_color,
          textTransform: "uppercase",
          margin: 0,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
          whiteSpace: "nowrap",
        }}
      >
        {renderMessage(msg, cfg.text_color)}
      </p>
    </div>
  )
}
