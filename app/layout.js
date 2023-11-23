import { ReactQueryProvider } from './ReactQueryProvider'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className='h-full'>
          <main className='h-full'>
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </ReactQueryProvider>
  )
}
