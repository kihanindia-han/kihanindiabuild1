"use client"

import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Swatch } from "@medusajs/icons"
import { useState, useEffect, useCallback } from "react"

export const config = defineRouteConfig({
  label: "Customize",
  icon: Swatch,
})

// ─── Types ────────────────────────────────────────────────────────────────────

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

const FONT_OPTIONS = ["Jost", "Cormorant Garamond", "Georgia", "Arial", "Times New Roman"]

const DEFAULT_CONFIG: Config = {
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

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 8)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>
      {children}
    </label>
  )
}

function Input({ value, onChange, placeholder, style }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  style?: React.CSSProperties
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        fontSize: 13,
        outline: "none",
        background: "#fff",
        color: "#111827",
        ...style,
      }}
    />
  )
}

function MessageCard({ msg, index, total, onChange, onRemove, onMove }: {
  msg: Message
  index: number
  total: number
  onChange: (m: Message) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px", background: "#fff", position: "relative" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9ca3af" }}>
          MESSAGE {index + 1}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            style={{ padding: "3px 7px", border: "1px solid #e5e7eb", borderRadius: 4, background: "#f9fafb", cursor: index === 0 ? "not-allowed" : "pointer", opacity: index === 0 ? 0.4 : 1, fontSize: 12 }}>
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            style={{ padding: "3px 7px", border: "1px solid #e5e7eb", borderRadius: 4, background: "#f9fafb", cursor: index === total - 1 ? "not-allowed" : "pointer", opacity: index === total - 1 ? 0.4 : 1, fontSize: 12 }}>
            ↓
          </button>
          <button
            onClick={onRemove}
            disabled={total <= 1}
            title="Remove"
            style={{ padding: "3px 10px", border: "1px solid #fecaca", borderRadius: 4, background: "#fef2f2", cursor: total <= 1 ? "not-allowed" : "pointer", color: "#dc2626", opacity: total <= 1 ? 0.4 : 1, fontSize: 12 }}>
            ✕
          </button>
        </div>
      </div>

      {/* Text */}
      <div style={{ marginBottom: 12 }}>
        <Label>Message Text</Label>
        <Input value={msg.text} onChange={v => onChange({ ...msg, text: v })} placeholder="e.g. FREE SHIPPING ON ALL ORDERS" />
      </div>

      {/* Link section */}
      <div style={{ background: "#f9fafb", borderRadius: 6, padding: "12px", border: "1px solid #f0f0f0" }}>
        <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 10, fontWeight: 600, letterSpacing: "0.06em" }}>
          HYPERLINK (optional) — highlight a word or phrase in your message
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <Label>Text to hyperlink</Label>
            <Input
              value={msg.linkText ?? ""}
              onChange={v => onChange({ ...msg, linkText: v || undefined })}
              placeholder="e.g. SHOP NOW"
            />
          </div>
          <div>
            <Label>Link URL</Label>
            <Input
              value={msg.linkUrl ?? ""}
              onChange={v => onChange({ ...msg, linkUrl: v || undefined })}
              placeholder="e.g. /collections"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Preview ──────────────────────────────────────────────────────────────────

function Preview({ config, activeIdx }: { config: Config; activeIdx: number }) {
  const msg = config.messages[activeIdx]
  if (!msg) return null

  const parts = msg.linkText && msg.text.includes(msg.linkText)
    ? msg.text.split(msg.linkText)
    : null

  return (
    <div style={{
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: config.background_color,
      borderRadius: 6,
      transition: "background 0.3s",
      overflow: "hidden",
    }}>
      <p style={{
        fontFamily: config.font_family,
        fontSize: 12,
        letterSpacing: "0.14em",
        color: config.text_color,
        textTransform: "uppercase",
        margin: 0,
        transition: "color 0.3s",
      }}>
        {parts ? (
          <>
            {parts[0]}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>{msg.linkText}</span>
            {parts[1]}
          </>
        ) : msg.text}
      </p>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const CustomizePage = () => {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"announcement">("announcement")
  const [previewIdx, setPreviewIdx] = useState(0)

  // Rotate preview
  useEffect(() => {
    if (config.messages.length <= 1) return
    const t = setInterval(() => {
      setPreviewIdx(i => (i + 1) % config.messages.length)
    }, config.rotation_speed)
    return () => clearInterval(t)
  }, [config.messages.length, config.rotation_speed])

  // Load config
  useEffect(() => {
    fetch("/admin/announcement-bar", { credentials: "include" })
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/admin/announcement-bar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error("Save failed")
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: any) {
      setError(e.message ?? "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const updateMessage = useCallback((index: number, msg: Message) => {
    setConfig(c => {
      const msgs = [...c.messages]
      msgs[index] = msg
      return { ...c, messages: msgs }
    })
  }, [])

  const removeMessage = useCallback((index: number) => {
    setConfig(c => ({ ...c, messages: c.messages.filter((_, i) => i !== index) }))
  }, [])

  const addMessage = useCallback(() => {
    setConfig(c => ({
      ...c,
      messages: [...c.messages, { id: uid(), text: "" }],
    }))
  }, [])

  const moveMessage = useCallback((index: number, dir: -1 | 1) => {
    setConfig(c => {
      const msgs = [...c.messages]
      const target = index + dir
      if (target < 0 || target >= msgs.length) return c;
      [msgs[index], msgs[target]] = [msgs[target], msgs[index]]
      return { ...c, messages: msgs }
    })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: 40, color: "#6b7280", fontSize: 14 }}>Loading Customize settings…</div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px", fontFamily: "system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Customize</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Control dynamic frontend elements — live on your storefront.</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid #e5e7eb", marginBottom: 28 }}>
        {[{ key: "announcement", label: "Announcement Bar" }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              background: "none",
              cursor: "pointer",
              color: activeTab === tab.key ? "#111827" : "#6b7280",
              borderBottom: activeTab === tab.key ? "2px solid #111827" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Announcement Bar tab ── */}
      {activeTab === "announcement" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Live preview */}
          <div>
            <Label>Live Preview</Label>
            <Preview config={config} activeIdx={previewIdx % config.messages.length} />
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
              Rotates every {(config.rotation_speed / 1000).toFixed(1)}s — showing message {(previewIdx % config.messages.length) + 1} of {config.messages.length}
            </p>
          </div>

          {/* ── Style controls ── */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 16px" }}>Style</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* Background color */}
              <div>
                <Label>Background Color</Label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={config.background_color}
                    onChange={e => setConfig(c => ({ ...c, background_color: e.target.value }))}
                    style={{ width: 40, height: 36, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", padding: 2 }}
                  />
                  <Input
                    value={config.background_color}
                    onChange={v => setConfig(c => ({ ...c, background_color: v }))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Text color */}
              <div>
                <Label>Text Color</Label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={config.text_color}
                    onChange={e => setConfig(c => ({ ...c, text_color: e.target.value }))}
                    style={{ width: 40, height: 36, border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", padding: 2 }}
                  />
                  <Input
                    value={config.text_color}
                    onChange={v => setConfig(c => ({ ...c, text_color: v }))}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Font family */}
              <div>
                <Label>Font</Label>
                <select
                  value={config.font_family}
                  onChange={e => setConfig(c => ({ ...c, font_family: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, background: "#fff", color: "#111827" }}
                >
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Rotation speed */}
              <div>
                <Label>Rotation Speed — {(config.rotation_speed / 1000).toFixed(1)}s</Label>
                <input
                  type="range"
                  min={1500}
                  max={8000}
                  step={500}
                  value={config.rotation_speed}
                  onChange={e => setConfig(c => ({ ...c, rotation_speed: Number(e.target.value) }))}
                  style={{ width: "100%", marginTop: 10 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                  <span>1.5s</span><span>8s</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Messages ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: 0 }}>Messages</h2>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{config.messages.length} / 5 messages</p>
              </div>
              <button
                onClick={addMessage}
                disabled={config.messages.length >= 5}
                style={{
                  padding: "7px 14px",
                  background: config.messages.length >= 5 ? "#f3f4f6" : "#111827",
                  color: config.messages.length >= 5 ? "#9ca3af" : "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: config.messages.length >= 5 ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                + Add Message
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {config.messages.map((msg, i) => (
                <MessageCard
                  key={msg.id}
                  msg={msg}
                  index={i}
                  total={config.messages.length}
                  onChange={m => updateMessage(i, m)}
                  onRemove={() => removeMessage(i)}
                  onMove={dir => moveMessage(i, dir)}
                />
              ))}
            </div>
          </div>

          {/* ── Save ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 8, borderTop: "1px solid #f3f4f6" }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                padding: "10px 28px",
                background: saved ? "#16a34a" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.3s",
              }}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
            </button>
            {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
            <p style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>
              Changes go live on your storefront immediately after saving.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomizePage
