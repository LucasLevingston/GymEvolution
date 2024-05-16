import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';
import { BsJournalText } from 'react-icons/bs';
import { formatarDataHistorico } from '@/estatico';
import useUser from '@/hooks/user-hooks';
import { UserType } from '@/types/userType';
import { useEffect, useState } from 'react';
export default function BotaoMostrarHistorico() {

   const [user, setUser] = useState<UserType | null>(null);
   const { getUser } = useUser();

   useEffect(() => {
      const fetchUser = async () => {
         const userAtual = await getUser();
         if (userAtual) {
            setUser(userAtual);
         }
      };

      fetchUser();
   }, [getUser]);

   return (
      <div className="rounded-lg bg-cinza">
         {user &&
            <Sheet>
               <SheetTrigger className="text-xm flex items-center justify-center space-x-2 p-2 px-3 text-preto ">
                  <div>Ver Histórico</div>
                  <BsJournalText />
               </SheetTrigger>
               <SheetContent className="">
                  <SheetHeader>
                     <SheetTitle>Histórico</SheetTitle>
                     <SheetDescription className="max-h-[90vh] overflow-y-auto">
                        {user.historico?.map((acontecimento, index) => (
                           <div key={index} className="space-y-1 border-b py-2">
                              <p>Ocorrido: {acontecimento.ocorrido}</p>
                              <p>Data: {formatarDataHistorico(acontecimento.data)}</p>
                           </div>
                        ))}
                     </SheetDescription>
                  </SheetHeader>
               </SheetContent>
            </Sheet>
         }
      </div>
   );
}