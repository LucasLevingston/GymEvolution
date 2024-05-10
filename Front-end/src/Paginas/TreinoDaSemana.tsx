import { ExerciciosCard } from "@/components/DiaDeTreinoCard"
import { Button } from "@/components/ui/button"
import usersData from "@/data/users-data"

export default function TreinoDaSemana() {
   const user = usersData[0]

   return (
      <div className="space-y-3">
         <h2 className="text-xl">Semana: {user.TreinoDaSemana?.semana}</h2>
         <div className="flex flex-wrap gap-3">
            {user && user.TreinoDaSemana?.diaDeTreino.map((diaDeTreino, index) => (
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
            ))}
         </div>
      </div>
   )
}
