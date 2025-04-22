'use client'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Users,
  CreditCard,
  Settings,
  ChevronLeft,
  LogOut,
  Menu,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const adminRoutes = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Professionals',
    href: '/admin/professionals',
    icon: Users,
  },
  {
    title: 'Purchases',
    href: '/admin/purchases',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-full flex flex-col border-r">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <nav className="flex-1 p-2 space-y-1">
              {adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    location.pathname === route.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.title}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex flex-col h-screen border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('ml-auto', collapsed && 'rotate-180')}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {adminRoutes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                location.pathname === route.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? route.title : undefined}
            >
              <route.icon className="h-4 w-4" />
              {!collapsed && route.title}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              'w-full',
              collapsed ? 'justify-center px-0' : 'justify-start gap-2'
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </div>
    </>
  )
}
