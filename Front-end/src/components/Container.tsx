import React from 'react';
import Header from './Header';
import { Toaster } from 'sonner';
import { Button } from './ui/button';
import { IoIosArrowBack } from 'react-icons/io';

interface ContainerProps {
   children: React.ReactNode;
   className?: string;
}

export default function Container({ children, className }: ContainerProps): JSX.Element {
   return (
      <div>
         <Header />
         <div className={`text-branco px-20 py-5 w-full h-full ${className}`}>
            <div className='pb-2'>
               <Button className='bg-branco text-preto hover:bg-white/70' variant='outline'
                  onClick={() => { window.history.back() }}>
                  <IoIosArrowBack />
               </Button>
            </div>
            {children}
            <Toaster richColors position='top-right' />
         </div>
      </div>
   );
}
