import './globals.css'
import { Inter } from 'next/font/google'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'My Clinic',
  description: 'Sistema odontológico',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>

        <Header />
        <main className="mt-16">{children}</main>
      </body>
    </html>
  )
}
