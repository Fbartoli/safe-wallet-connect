import type { Metadata } from 'next'

import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: 'AppKit Example App',
  description: 'Powered by Reown'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en">
      <body style={{ backgroundColor: 'black' }}>
        <ContextProvider>{children}</ContextProvider>
      </body>
    </html>
  )
}