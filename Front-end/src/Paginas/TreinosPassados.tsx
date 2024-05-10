import Container from '@/components/Container';
import { ExerciciosCard } from '@/components/DiaDeTreinoCard';
import { Button } from '@/components/ui/button';
import usersData from '@/data/users-data';
import { useEffect, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function TreinosPassados() {
   const user = usersData[0];
   const treinos = user.TreinosAntigos || [];
   const [treinoIdex, setTreinoIndex] = useState(0)
   const [treinoAntigoAtual, setTreinoAntigoAtual] = useState(treinos[treinoIdex])

   useEffect(() => {
      setTreinoAntigoAtual(treinos[treinoIdex])
   }, [treinoIdex])

   return (
      <Container className='space-y-2'>
         {treinoAntigoAtual &&
            <div className='space-y-2'>
               <div className='items-center flex gap-2'>
                  <Button className='bg-white text-cinzaEscuro hover:bg-white/50'
                     disabled={treinoIdex === 0}

                     onClick={() => (setTreinoIndex(treinoIdex - 1))}>
                     <IoChevronBack />
                  </Button>
                  Semana: {treinoAntigoAtual.semana}
                  <Button
                     className='bg-white text-cinzaEscuro hover:bg-white/50'
                     disabled={treinoIdex === treinos.length - 1}
                     onClick={() => {
                        if (treinoIdex !== treinos.length) {
                           setTreinoIndex(treinoIdex + 1);
                        }
                     }}
                  >
                     <IoChevronForward />
                  </Button>

               </div>
               <div className="flex flex-wrap gap-3">
                  {treinoAntigoAtual.treino.diaDeTreino.map((diaDeTreino, index) => (
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
         }
      </Container>
   );
}
