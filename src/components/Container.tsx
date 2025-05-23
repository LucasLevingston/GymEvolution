import type React from 'react'
import Header from './Header'
import { twMerge } from 'tailwind-merge'

interface ContainerRootProps {
  children: React.ReactNode
  className?: string
}

export function ContainerRoot({ children, className }: ContainerRootProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div
        className={twMerge(
          'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-8',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface ContainerHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ContainerHeader({
  children,
  className,
}: ContainerHeaderProps): JSX.Element {
  return (
    <div
      className={twMerge(
        'flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}
export function ContainerTitle({
  children,
  className,
}: ContainerHeaderProps): JSX.Element {
  return <h1 className={twMerge('text-3xl font-bold', className)}>{children}</h1>
}

interface ContainerContentProps {
  children: React.ReactNode
  className?: string
}

export function ContainerContent({
  children,
  className,
}: ContainerContentProps): JSX.Element {
  return (
    <div className={twMerge('w-full flex flex-col gap-4', className)}>{children}</div>
  )
}
