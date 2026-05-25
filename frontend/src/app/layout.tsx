import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WikiCopilot } from "@/components/wiki-copilot"
import { ThemeProvider } from "@/components/ThemeProvider"
import { HeaderNav } from "@/components/HeaderNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DClaw Wiki",
  description: "Internal Wikipedia — knowledge management for your team",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');})()` }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-[var(--bg)]">
            <HeaderNav />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          </div>
          <WikiCopilot />
        </ThemeProvider>
      </body>
    </html>
  )
}
