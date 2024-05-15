import Container from '@/components/Container'
import { TreinoDaSemana } from './TreinoDaSemana'

export default function Home() {

   return (
      <div>
         <Container>
            <p className='text-2xl'>
               Treino da semana
            </p>
            <TreinoDaSemana />
         </Container>
      </div>
   )
}
