import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const orbitron = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Batas Kota | The Town Space',
  description: 'Rasakan platform pemesanan arena olahraga terbaik dengan fasilitas canggih dan pengalaman bermain yang imersif.',
  keywords: ['arena olahraga', 'pemesanan', 'gaming', 'fasilitas', 'lapangan futsal'],
  authors: [{ name: 'Tim Batas Kota' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} ${orbitron.className}`} style={{ backgroundColor: '#050505', color: '#ffffff' }} suppressHydrationWarning>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}