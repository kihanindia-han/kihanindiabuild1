"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { clearToken } from "@/lib/auth"

const links = [
  { href: "/products", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/orders", label: "Orders" },
  { href: "/customers", label: "Customers" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function logout() {
    clearToken()
    router.push("/login")
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-stone-200 flex flex-col">
      <div className="px-6 py-5 border-b border-stone-200">
        <span className="text-lg font-semibold tracking-wide">KIHAN</span>
        <p className="text-xs text-stone-400 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              pathname.startsWith(link.href)
                ? "bg-stone-100 text-stone-900 font-medium"
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-stone-200">
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 text-sm text-stone-500 hover:text-stone-900 rounded hover:bg-stone-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
