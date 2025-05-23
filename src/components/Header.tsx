import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  Settings,
  User,
  Home,
  Dumbbell,
  BarChart,
  Utensils,
  DollarSign,
  AmpersandIcon,
  LayoutDashboardIcon,
  Star,
} from 'lucide-react'
import useUser from '@/hooks/user-hooks'
import { toast } from 'sonner'
import { ModeToggle } from './toggle/ModeToggle'
import logoDivision from '../assets/logo.png'
import { NotificationDropdown } from './notifications/NotificationDropdown'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { checkIsProfessional } from '@/lib/utils/checkIsProfessional'

export default function Header() {
  const { logout, user } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.warning('Logged out of the account.')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logoDivision || '/placeholder.svg'}
            alt="GymEvolution Logo"
            width={40}
            height={40}
          />
          <span className="font-saira-stencil text-xl font-bold">GymEvolution</span>
        </Link>

        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link to="/" className="transition-colors hover:text-foreground/80">
            Home
          </Link>
          {user && (
            <>
              <Link to="/training" className="transition-colors hover:text-foreground/80">
                Workout Week
              </Link>

              <Link to="/progress" className="transition-colors hover:text-foreground/80">
                Progress
              </Link>
              <Link to="/diet" className="transition-colors hover:text-foreground/80">
                Diet
              </Link>
              <Link
                to="/professional/list"
                className="transition-colors hover:text-foreground/80"
              >
                Professionals
              </Link>
              <Link
                to="/subscription"
                className="transition-colors hover:text-foreground/80 flex items-center gap-1 text-sm"
              >
                Plans <Star className="w-4" />
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />

          {user ? (
            <>
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <Avatar className="h-8 w-8 flex items-center justify-center">
                      <AvatarImage
                        src={user.imageUrl}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="w-full h-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/" className="flex cursor-pointer items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/training" className="flex cursor-pointer items-center">
                        <Dumbbell className="mr-2 h-4 w-4" />
                        <span>Workout Week</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/diet" className="flex cursor-pointer items-center">
                        <Utensils className="mr-2 h-4 w-4" />
                        <span>Diet</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/progress" className="flex cursor-pointer items-center">
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>Progress</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  {user.role === 'STUDENT' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/purchases"
                          className="flex cursor-pointer items-center"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Purchases</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex cursor-pointer items-center">
                          <AmpersandIcon className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {checkIsProfessional(user) && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/professional/professional-dashboard"
                          className="flex cursor-pointer items-center"
                        >
                          <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                          <span>Professional Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings/my-informations"
                      className="flex cursor-pointer items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex cursor-pointer items-center space-x-2">
              <Button asChild variant="ghost">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
