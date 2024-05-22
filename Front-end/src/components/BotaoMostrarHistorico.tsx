import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';
import { BsJournalText } from 'react-icons/bs';
import { formatarData } from '@/estatico';
import useUser from '@/hooks/user-hooks';
import { Historico, UserType } from '@/types/userType';
import { useEffect, useState } from 'react';
export default function BotaoMostrarHistorico() {

   const [user, setUser] = useState<UserType | null>(null);
   const [historico, setHistorico] = useState<Historico[] | null>(null);

   const { getUser, getHistorico } = useUser();

   useEffect(() => {
      const fetchUser = async () => {
         const fetchedUser = await getUser();
         setUser(fetchedUser);

         const historicoAtual = await getHistorico(fetchedUser?.email)
         if (historicoAtual) {
            setHistorico(historicoAtual)
         }

      };
      fetchUser();
   }, [getUser]);

   return (
      <div className="rounded-lg bg-cinza">
         {historico && user &&
            <Sheet>
               <SheetTrigger className="text-xm flex items-center justify-center space-x-2 p-2 px-3 text-preto ">
                  <div>Ver Histórico</div>
                  <BsJournalText />
               </SheetTrigger>
               <SheetContent className="">
                  <SheetHeader>
                     <SheetTitle>Histórico</SheetTitle>
                     <SheetDescription className="max-h-[90vh] overflow-y-auto">
                        {historico.map((acontecimento, index) => (
                           <div key={index} className="space-y-1 border-b py-2">
                              <p>Ocorrido: {acontecimento.ocorrido}</p>
                              <p>Data: {formatarData(acontecimento.data)}</p>
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