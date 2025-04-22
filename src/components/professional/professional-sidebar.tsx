import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  LogOut,
  Menu,
  CreditCard,
  MessageSquare,
  ClipboardList,
  Home,
  LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import useUser from '@/hooks/user-hooks'
import { useProfessionals } from '@/hooks/professional-hooks'
import { Task } from '@/types/ProfessionalType'

interface professionalRouteType {
  title: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

const professionalRoutes: professionalRouteType[] = [
  {
    title: 'Dashboard',
    href: '/professional/professional-dashboard',
    icon: Home,
  },
  {
    title: 'Clientes',
    href: '/professional/clients',
    icon: Users,
  },
  {
    title: 'Agenda',
    href: '/professional/meetings',
    icon: Calendar,
  },
  {
    title: 'Planos',
    href: '/professional/professional-plans',
    icon: FileText,
  },
  {
    title: 'Pagamentos',
    href: '/professional/payments',
    icon: CreditCard,
  },
  {
    title: 'Métricas',
    href: '/professional/metrics',
    icon: BarChart3,
  },
  {
    title: 'Mensagens',
    href: '/professional/messages',
    icon: MessageSquare,
  },
  {
    title: 'Tarefas',
    href: '/professional/tasks',
    icon: ClipboardList,
    badge: 2,
  },
  {
    title: 'Configurações',
    href: '/professional/settings',
    icon: Settings,
  },
]

export function ProfessionalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const [pendingTasks, setPendingTasks] = useState(0)
  const { user } = useUser()
  const { getTasksByProfessionalId } = useProfessionals()

  useEffect(() => {
    const fetchPendingTasks = async () => {
      if (!user?.id) return

      try {
        const data = await getTasksByProfessionalId(user.id)

        const pendingTasks = data?.filter(({ status }: Task) => status === 'PENDING')
        if (pendingTasks && pendingTasks?.length > 0) {
          setPendingTasks(pendingTasks.length)
        }
      } catch (error) {
        console.error('Error fetching pending tasks:', error)
      }
    }

    fetchPendingTasks()
  }, [user?.id])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="h-full flex flex-col border-r">
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.imageUrl || '/placeholder.svg'} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'PR'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">{user?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'NUTRITIONIST' && 'Nutricionista'}
                  {user?.role === 'TRAINER' && 'Personal Trainer'}
                </p>
              </div>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {professionalRoutes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium',
                    location.pathname === route.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <route.icon className="h-4 w-4" />
                    {route.title}
                  </div>
                  {route.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {route.title === 'Tarefas' ? pendingTasks : route.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          'hidden md:flex flex-col h-screen border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.imageUrl || '/placeholder.svg'} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'PR'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold">{user?.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'NUTRITIONIST' && 'Nutricionista'}
                  {user?.role === 'TRAINER' && 'Personal Trainer'}
                </p>
              </div>
            </div>
          )}
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
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {professionalRoutes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
                location.pathname === route.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? route.title : undefined}
            >
              <div className="flex items-center gap-3">
                <route.icon className="h-4 w-4" />
                {!collapsed && route.title}
              </div>
              {!collapsed && route.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {route.title === 'Tarefas' ? pendingTasks : route.badge}
                </Badge>
              )}
              {collapsed && route.badge && (
                <Badge
                  variant="secondary"
                  className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {route.title === 'Tarefas' ? pendingTasks : route.badge}
                </Badge>
              )}
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
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Sair'}
          </Button>
        </div>
      </div>
    </>
  )
}
