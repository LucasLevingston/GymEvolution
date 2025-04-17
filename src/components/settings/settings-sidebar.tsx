import type React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserCircle, Settings, LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { BsGoogle } from 'react-icons/bs'
import { IconType } from 'react-icons/lib'

const settingsSidebar: React.FC = () => {
  const location = useLocation()

  interface sidebarRouteType {
    title: string
    href: string
    icon: LucideIcon | IconType
    badge?: string | number
  }

  const settingsRoutes: sidebarRouteType[] = [
    {
      href: '/settings/my-informations',
      title: 'My Information',
      icon: UserCircle,
    },
    { href: '/settings/theme', title: 'Theme Settings', icon: Settings },
    {
      href: '/settings/google-connect',
      title: 'Google Calendar Connect',
      icon: BsGoogle,
    },
  ]

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {settingsRoutes.map((item) => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className={cn(
            'justify-start',
            location.pathname === item.href && 'bg-muted hover:bg-muted'
          )}
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

export default settingsSidebar
