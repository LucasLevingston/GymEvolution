import Container from '@/components/Container'
import usersData from '@/data/users-data';
import { useParams } from 'react-router-dom';

export default function Treinando() {
   const { idParams } = useParams();
   const user = usersData[0];
   const treino = user.TreinoDaSemana.diaDeTreino.find((diaDeTreino) => Number(idParams) === Number(diaDeTreino.id));
   return (
      <Container>
         {treino ?
            <div className='border p-2 bg-branco flex flex-col gap-5'>
               {treino.exercicios.map((exercicio, i) => (
                  <div className='text-preto' key={i}>
                     <p>Exercicio <span className='text-vermelho'>{i + 1}</span>: </p>
                     <p>Nome:<span className='text-vermelho'> {exercicio.nome}</span></p>
                     <p>Repeticões: <span className='text-vermelho'>{exercicio.series}x{exercicio.repeticoes}</span></p>
                     {exercicio.variacao &&
                        <p>
                           Variação:  <span className='text-vermelho'>{exercicio.variacao}</span>
                        </p>}
                  </div>
               ))}
            </div>
            :
            <div>Dia de treino não encontrado</div>
         }
      </Container>
   )
}
