import logoDivision from '../assets/logo.png';
import { Link } from 'react-router-dom';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';
import { CgGym } from 'react-icons/cg';
import { IoAnalytics, IoChevronBack } from 'react-icons/io5';
import useUser from '@/hooks/user-hooks';
import { toast } from 'sonner';
import { ModeToggle } from './toggle/ModeToggle';

export default function Header() {
	const { logout } = useUser();
	return (
		<div className="flex h-20 w-full justify-between  bg-blue-300 px-5 text-black">
			<button
				onClick={() => {
					window.location.href = '/';
				}}
			>
				<div className="flex items-center gap-2">
					<img src={logoDivision} className="w-16" />
					<p className="font-saira-stencil text-xl">GymEvolution</p>
				</div>
			</button>
			<div className="flex items-center">
				<p className="font-saira">Home</p>
			</div>
			<div className="border-l-gray flex w-[5%] items-center space-x-2 border-l-[1px] ">
				<Link to="/" className="flex items-center">
					<MdHome className="text-gray ml-8 text-xl" />
				</Link>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button>
							<HiOutlineDotsVertical />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56 ">
						<DropdownMenuLabel className="flex justify-between">
							Options <ModeToggle />
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Link to={'/profile'}>
									<button className="flex items-center gap-2">
										<User className="w-4" />
										<span>Profile</span>
									</button>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link to="/" className="flex items-center gap-2">
									<CgGym />
									<span>Weekly Workout</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<button
									className="flex items-center gap-2"
									onClick={() => {
										window.location.href = '/past-workouts';
									}}
								>
									<IoChevronBack />
									<span>Past Workouts</span>
								</button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<button
									className="flex items-center gap-2"
									onClick={() => {
										window.location.href = '/progress';
									}}
								>
									<IoAnalytics />
									<span>Progress</span>
								</button>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuItem>
							<Link
								to="/settings/my-informations"
								className="flex items-center gap-2"
							>
								<Settings className="h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<button
								onClick={() => {
									logout();
									toast.warning('Logged out of the account.');
									setTimeout(() => {
										window.location.href = '/login';
									}, 2000);
								}}
								className="flex items-center"
							>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log Out</span>
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
