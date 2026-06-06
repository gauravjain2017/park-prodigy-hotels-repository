import type { Metadata } from 'next'
import './globals.css'
import { IframeResizer } from '@/components/IframeResizer'

export const metadata: Metadata = {
  title: 'Hotel Search — Disney & Universal Area',
  description: 'Book Disney & Universal area hotels with insider perks.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body>
        <IframeResizer />
        {children}
      </body>
    </html>
  )
}
