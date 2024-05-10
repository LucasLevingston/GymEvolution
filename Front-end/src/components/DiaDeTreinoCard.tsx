import { DiaDeTreinoType } from '@/types/treinoType';
import React from 'react'
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


interface ExerciciosCardProps {
   diaDeTreino: DiaDeTreinoType;
}
export const ExerciciosCard: React.FC<ExerciciosCardProps> = ({ diaDeTreino }) => {
   return (
      <div className='border p-2 flex flex-col gap-3 bg-cinza rounded w-full'>
         {diaDeTreino.exercicios.map((exercicio, i) => (
            <div className='text-preto' key={i}>
               <p>Exercício <span className='text-vermelho font-bold'>{i + 1}</span>: </p>
               <p>Nome:<span className={`text-vermelho font-bold ${exercicio.feito ? 'line-through' : null}`}> {exercicio.nome}</span></p>
               <p>Repeticões: <span className={`text-vermelho font-bold ${exercicio.feito ? 'line-through' : null}`}>{exercicio.quantidadeSeries}x{exercicio.repeticoes}</span></p>
               {exercicio.variacao &&
                  <p>
                     Variação:  <span className='text-vermelho font-bold'>{exercicio.variacao}</span>
                  </p>}
               {exercicio.feito && (
                  <DropdownMenu >
                     <DropdownMenuTrigger className='w-1/2' asChild>
                        <Button variant="outline" >Resultado</Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Resultados</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                           {exercicio.resultado?.map((serie) => (
                              <DropdownMenuItem >{serie.serie}° Série: Carga: {serie.carga}Kg - Repetições: {serie.repeticoes}</DropdownMenuItem>
                           ))}
                        </DropdownMenuGroup>
                     </DropdownMenuContent>
                  </DropdownMenu>
               )}
            </div>
         ))}
      </div>
   )
}
