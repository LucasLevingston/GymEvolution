import { DiaDeTreinoType } from '@/types/treinoType';
import React from 'react'
interface ExerciciosCardProps {
   diaDeTreino: DiaDeTreinoType;
}
export const ExerciciosCard: React.FC<ExerciciosCardProps> = ({ diaDeTreino }) => {
   return (
      <div className='border p-2 bg-branco flex flex-col gap-5'>
         {diaDeTreino.exercicios.map((exercicio, i) => (
            <div className='text-preto' key={i}>
               <p>Exercicio <span className='text-vermelho'>{i + 1}</span>: </p>
               <p>Nome:<span className='text-vermelho'> {exercicio.nome}</span></p>
               <p>Repeticões: <span className='text-vermelho'>{exercicio.quantidadeSeries}x{exercicio.repeticoes}</span></p>
               {exercicio.variacao &&
                  <p>
                     Variação:  <span className='text-vermelho'>{exercicio.variacao}</span>
                  </p>}
            </div>
         ))}
      </div>
   )
}
