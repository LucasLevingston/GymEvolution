import { ExerciciosCard } from "@/components/DiaDeTreinoCard"
import { Button } from "@/components/ui/button"
import useUser from "@/hooks/user-hooks"
import { SemanaDeTreinoType } from "@/types/treinoType";
import { UserType } from "@/types/userType";
import { useEffect, useState } from "react";

export const TreinoDaSemana: React.FC = () => {
   const { getUser } = useUser();
   const [user, setUser] = useState<UserType | null>(null);
   const [semanaDeTreinoAtual, setSemanaDeTreinoAtual] = useState<SemanaDeTreinoType | null>(null)

   useEffect(() => {
      const fetchUser = async () => {
         const fetchedUser = await getUser();
         setUser(fetchedUser);

      }
      fetchUser();
      let quantidade = 0
      if (user?.SemanasDeTreino) {
         quantidade = user?.SemanasDeTreino.length
      }
      if (quantidade && typeof quantidade === "number" && user?.SemanasDeTreino) {
         setSemanaDeTreinoAtual(user?.SemanasDeTreino[quantidade])

      }
   }, [getUser]);


   return (
      <div className="space-y-3">
         {/* <h2 className="text-xl">Semana: {user?.SemanasDeTreino[user.SemanasDeTreino.length].semanaIndex}</h2> */}
         <div className="flex flex-wrap gap-3">
            {user && semanaDeTreinoAtual ? semanaDeTreinoAtual.treino.map((diaDeTreino, index) => (
               <div key={index} className="bg-branco border border-preto w-[320px] h-full text-preto p-3 rounded-md ">
                  <div className="space-y-3">
                     <p>
                        Agrupamento:   {diaDeTreino.grupo}
                     </p>
                     <p>
                        Dia: {diaDeTreino.diaDaSemana}
                     </p>
                     <p>
                        Exercícios:
                     </p>
                     <div className="flex flex-wrap">
                        <ExerciciosCard diaDeTreino={diaDeTreino} />
                     </div>
                     <div className="flex justify-end text-right">
                        {diaDeTreino.feito ?

                           <Button className="bg-cinzaEscuro" disabled
                              onClick={() => { window.location.href = `/treinando/${diaDeTreino.id}` }}>Feito</Button> :
                           <Button className="bg-cinzaEscuro"
                              onClick={() => { window.location.href = `/treinando/${diaDeTreino.id}` }}>Treinar</Button>
                        }
                     </div>
                  </div>
               </div>
            )) :
               <div className="flex justify-center  flex-col pt-2">
                  Nenhum treino encontrado!
                  <Button className="bg-branco hover:bg-cinza text-preto" onClick={() => { window.location.href = "novo-treino" }}>Registrar novo treino</Button>
               </div>
            }
         </div>
      </div>
   )
}
