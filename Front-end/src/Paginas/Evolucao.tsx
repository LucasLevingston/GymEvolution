import Container from '@/components/Container'
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import { Peso, UserType } from '@/types/userType';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Evolucao() {
   const { getUser } = useUser();
   const [user, setUser] = useState<UserType | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [pesos, setPesos] = useState<Peso[] | null>(null)
   if (error) {
      toast.error(error)
   }

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const fetchedUser = await getUser();
            setUser(fetchedUser);
            if (user) {
               setPesos(user.pesosAntigos);
            }

         } catch (error) {
            setError("Erro ao buscar o usuário");
         }
      };

      fetchUser();
   }, [getUser]);

   return (
      <Container>
         {pesos &&
            <div>
               <Button>Registrar novo peso</Button>
               <div>Gráfico</div>
            </div>
         }
      </Container>
   )
}
