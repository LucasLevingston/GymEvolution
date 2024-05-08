import React from 'react';
import Header from './Header';

interface ContainerProps {
   children: React.ReactNode;
   className?: string;
}

export default function Container({ children, className }: ContainerProps): JSX.Element {
   return (
      <div>
         <Header />
         <div className={`text-branco px-20 pt-5 w-full h-full ${className}`}>
            {children}
         </div>
      </div>
   );
}
