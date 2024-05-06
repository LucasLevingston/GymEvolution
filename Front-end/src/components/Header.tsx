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
import { LogOut, Plus, Users } from 'lucide-react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';

export default function Header() {
   return (
      <div className='bg-slate-300 w-full h-20 flex justify-between px-5 bg-branco'>
         <div className='flex items-center'>
            <img src={logoDivisao} className='w-22' />Divisão
            de treinos
         </div>
         <div className='items-center flex'>
            <p>

               Inicio
            </p>
         </div>
         <div className="flex w-[6%] items-center space-x-2  border-l-[1px] border-l-cinza ">
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
                        <Link to="/" className="flex items-center">
                           {/* <Users className="mr-2 h-4 w-4" /> */}
                           <span>Ver treino da semana</span>
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
