import React from 'react'
import Header from './Header'
interface ContainerProps {
   children: React.ReactNode;
}
export default function Container({ children }: ContainerProps): JSX.Element {
   return (
      <div>
         <Header />
         <div className='text-branco px-20 pt-5 w-full h-full'>
            {children}
         </div>
      </div>
   )
}
