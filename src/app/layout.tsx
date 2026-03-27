import type { Metadata } from 'next'
import { Inter, Nunito, Geist_Mono } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MoneyLens',
  description: 'Bảng điều khiển tài chính cá nhân',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-[#F5F7FA]">
        <TooltipProvider>
          <div className="flex h-full">
            {/* Left sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  )
}
