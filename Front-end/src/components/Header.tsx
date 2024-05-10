import logoDivisao from '../assets/logo.png'
import { Link } from 'react-router-dom'
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuGroup,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';
import { CgGym } from 'react-icons/cg';
import { IoArrowBack, IoChevronBack } from 'react-icons/io5';

export default function Header() {
   return (
      <div className='w-full h-20 flex justify-between px-5 bg-branco'>
         <button onClick={() => { window.location.href = "/" }}>
            <div className='flex items-center gap-2'>
               <img src={logoDivisao} className='w-16' />
               <p className='font-saira-stencil text-xl'>
                  GymEvolution
               </p>
            </div>
         </button>
         <div className='items-center flex'>
            <p className='font-saira'>
               Inicio
            </p>
         </div>
         <div className="flex w-[5%] items-center space-x-2  border-l-[1px] border-l-cinza ">
            <Link to="/" className="flex items-center">
               <MdHome className="ml-8 text-xl text-cinza" />
            </Link>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <button>
                     <HiOutlineDotsVertical />
                  </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56 bg-branco">
                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <Link to="/" className="flex items-center gap-2">
                           <CgGym />
                           <span>Treino da semana</span>
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <Link to="/" className="flex items-center gap-2">
                           <IoChevronBack />
                           <CgGym />
                           <span>Treinos passados</span>
                        </Link>
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                     <Link to="/login" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair da conta</span>
                     </Link>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   )
}
