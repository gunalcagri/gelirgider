import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import type React from 'react'
import { ApplicationLayout } from './application-layout'
import { ExpenseProvider } from './context/store'

export const metadata: Metadata = {
  title: {
    template: '%s - GelirGider',
    default: 'GelirGider',
  },
  description: '',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

 

  return (
    <html lang="en">
      <body>
        <ExpenseProvider>
        <ApplicationLayout >{children}</ApplicationLayout>
        </ExpenseProvider>
      </body>
   </html>
  )
}
