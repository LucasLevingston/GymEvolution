import type React from 'react'
import Header from '@/components/Header'
import { Card } from '@/components/ui/card'
import Sidebar from './Sidebar'

export default function SiedbarComponent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <Card className="flex">
          <aside className="w-64 border-r">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </Card>
      </div>
    </div>
  )
}
