import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WikiCopilot } from "@/components/wiki-copilot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DClaw Wiki",
  description: "Internal Wikipedia — knowledge management for your team",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <WikiCopilot />
      </body>
    </html>
  )
}
