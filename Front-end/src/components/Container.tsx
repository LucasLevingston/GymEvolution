import React from 'react'
import { Toaster } from 'sonner'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({
  children,
  className,
}: ContainerProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div
        className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-8 ${className}`}
      >
        {children}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}
