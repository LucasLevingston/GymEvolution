'use client';

import type React from 'react';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import Header from './Header';

interface ContainerRootProps {
  children: React.ReactNode;
  className?: string;
}

export function ContainerRoot({ children, className }: ContainerRootProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div
        className={cn(
          'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:py-10 lg:px-8',
          className
        )}
      >
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}

interface ContainerHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ContainerHeader({
  children,
  className,
}: ContainerHeaderProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}
export function ContainerTitle({
  children,
  className,
}: ContainerHeaderProps): JSX.Element {
  return <h1 className={cn('text-3xl font-bold', className)}>{children}</h1>;
}

interface ContainerContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ContainerContent({
  children,
  className,
}: ContainerContentProps): JSX.Element {
  return <div className={cn('w-full flex flex-col gap-4', className)}>{children}</div>;
}
