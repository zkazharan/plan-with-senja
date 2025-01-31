import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import Navbar from '@/components/layout/Navbar'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Plan with Senja',
  description: 'Aplikasi pemesanan event',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`bg-secondary-50 ${plusJakarta.variable} ${poppins.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
