import type React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UserCircle, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const pathname = window.location.pathname

  const navItems = [
    {
      href: '/settings/my-informations',
      label: 'My Information',
      icon: UserCircle,
    },
    { href: '/settings/theme', label: 'Theme Settings', icon: Settings },
  ]

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map(item => (
        <Button
          key={item.href}
          asChild
          variant="ghost"
          className={cn(
            'justify-start',
            pathname === item.href && 'bg-muted hover:bg-muted'
          )}
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}

export default Sidebar
