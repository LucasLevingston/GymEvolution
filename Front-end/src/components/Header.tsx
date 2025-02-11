import { Link, useNavigate } from 'react-router-dom';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	LogOut,
	Settings,
	User,
	Home,
	Dumbbell,
	ChevronLeft,
	BarChart,
	Menu,
} from 'lucide-react';
import useUser from '@/hooks/user-hooks';
import { toast } from 'sonner';
import { ModeToggle } from './toggle/ModeToggle';
import logoDivision from '../assets/logo.png';

export default function Header() {
	const { logout, user } = useUser();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		toast.warning('Logged out of the account.');
		setTimeout(() => {
			navigate('/login');
		}, 2000);
	};

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
					<span className="font-saira-stencil text-xl font-bold">
						GymEvolution
					</span>
				</Link>

				<nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
					<Link to="/" className="transition-colors hover:text-foreground/80">
						Home
					</Link>
					{user && (
						<>
							<Link
								to="/workout-week"
								className="transition-colors hover:text-foreground/80"
							>
								Current Workout Week
							</Link>
							<Link
								to="/past-workouts"
								className="transition-colors hover:text-foreground/80"
							>
								Past Workouts
							</Link>
							<Link
								to="/progress"
								className="transition-colors hover:text-foreground/80"
							>
								Progress
							</Link>
						</>
					)}
				</nav>

				<div className="flex items-center space-x-4">
					<ModeToggle />
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<User className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="end" forceMount>
								<DropdownMenuLabel className="font-normal">
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{user.name}
										</p>
										<p className="text-xs leading-none text-muted-foreground">
											{user.email}
										</p>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link to="/profile" className="flex items-center">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/" className="flex items-center">
											<Home className="mr-2 h-4 w-4" />
											<span>Home</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/workout-week" className="flex items-center">
											<Dumbbell className="mr-2 h-4 w-4" />
											<span>Current Workout Week</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/past-workouts" className="flex items-center">
											<ChevronLeft className="mr-2 h-4 w-4" />
											<span>Past Workouts</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/progress" className="flex items-center">
											<BarChart className="mr-2 h-4 w-4" />
											<span>Progress</span>
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link
										to="/settings/my-informations"
										className="flex items-center"
									>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="flex items-center"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log Out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center space-x-2">
							<Button asChild variant="ghost">
								<Link to="/login">Log In</Link>
							</Button>
							<Button asChild>
								<Link to="/register">Sign Up</Link>
							</Button>
						</div>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link to="/">Home</Link>
							</DropdownMenuItem>
							{user ? (
								<>
									<DropdownMenuItem asChild>
										<Link to="/workout-week">Current Workout Week</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/past-workouts">Past Workouts</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/progress">Progress</Link>
									</DropdownMenuItem>
								</>
							) : (
								<>
									<DropdownMenuItem asChild>
										<Link to="/login">Log In</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link to="/register">Sign Up</Link>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
