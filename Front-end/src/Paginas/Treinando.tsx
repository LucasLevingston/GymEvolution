import Container from '@/components/Container'
import { Button } from '@/components/ui/button';
import usersData from '@/data/users-data';
import { useParams } from 'react-router-dom';

export default function Treinando() {
   const { idParams } = useParams();
   const user = usersData[0];
   const treino = user.TreinoDaSemana.diaDeTreino.find((diaDeTreino) => Number(idParams) === Number(diaDeTreino.id));
   return (
      <Container>
         {treino ?
            <div className='border p-2  flex flex-wrap gap-3'>
               {treino.exercicios.map((exercicio, i) => (
                  <div className='space-y-5 text-preto bg-branco p-3 rounded w-[300px] h-[300px]'>
                     <div className='' key={i}>
                        <p className='text-lg font-bold'>Exercicio <span className='text-'>{i + 1}</span>: </p>
                        <p>Nome:<span className='text-vermelho'> {exercicio.nome}</span></p>
                        <p>Repeticões: <span className='text-vermelho'>{exercicio.series}x{exercicio.repeticoes}</span></p>
                        {exercicio.variacao &&
                           <p>
                              Variação:  <span className='text-vermelho'>{exercicio.variacao}</span>
                           </p>}
                     </div>
                     <div className='text-right'>
                        <Button >Fazer</Button>
                     </div>
                  </div>
               ))}
            </div>
            :
            <div>Dia de treino não encontrado</div>
         }
      </Container>
   )
}
