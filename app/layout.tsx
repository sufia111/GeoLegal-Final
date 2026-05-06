import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"] })

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'GeoLegal - India\'s Jurisdiction-Aware AI Legal Advisor',
  description: 'Know Your Rights. Know Your State. Navigate IPC sections, state-specific amendments, and your constitutional rights with GeoLegal.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      style={{
        '--font-poppins': poppins.style.fontFamily,
        '--font-jetbrains': jetbrainsMono.style.fontFamily,
      } as React.CSSProperties}
    >
      <body className="font-body text-foreground antialiased">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
