import { Header } from '@/src/components/Header'
import React from 'react'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="max-w-6xl h-screen my-20 mx-auto p-10 bg-gray-800 rounded-lg flex flex-col">
      <Header />
      {children}
    </div>
  )
}
