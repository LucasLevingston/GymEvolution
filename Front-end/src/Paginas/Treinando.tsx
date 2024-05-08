import Container from '@/components/Container'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import usersData from '@/data/users-data';
import { ExercicioType, serieType } from '@/types/treinoType';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface SerieAtualType {
   indexExercicioAtual: number
   indexSerieAtual: number,
}

export default function Treinando() {
   const { idParams } = useParams();
   const user = usersData[0];
   const treino = user.TreinoDaSemana?.diaDeTreino.find((diaDeTreino) => Number(idParams) === Number(diaDeTreino.id));
   const [treinoAtual, setTreinoAtual] = useState(treino)
   const [fazendoExercicio, setFazendoExercicio] = useState(false)
   const [serieAtual, setSerieAtual] = useState<SerieAtualType>({
      indexExercicioAtual: 0,
      indexSerieAtual: 0
   })
   const [exerciciosFeitos, setExerciciosFeitos] = useState<ExercicioType[]>([]);
   const [seriesFeitas, setSeriesFeitas] = useState<serieType[]>([]);
   const [repeticoesFeitas, setRepeticoesFeitas] = useState<number>()
   const [cargaFeita, setCargaFeita] = useState<number>()

   const handleFazendoExercicio = (quantidadeSeries: number, indexExercicioAtual: number) => {
      if (!fazendoExercicio) {
         setFazendoExercicio(!fazendoExercicio)
         setSerieAtual({
            indexExercicioAtual,
            indexSerieAtual: 1
         })
      }
   }

   const handleSerieFeita =
      (nome: string, quantidadeSeries: number, repeticoes: number, indexExercicioAtual: number, variacao?: string,) => {
         if (cargaFeita && repeticoesFeitas) {
            setSeriesFeitas(prevSeriesFeitas => [
               ...prevSeriesFeitas,
               {
                  carga: cargaFeita,
                  repeticoes: repeticoesFeitas,
                  serie: serieAtual.indexSerieAtual
               }
            ]);
            setSerieAtual({ indexSerieAtual: serieAtual.indexSerieAtual + 1, indexExercicioAtual: serieAtual.indexExercicioAtual })
            toast.warning("Registrada! Serie atua:", serieAtual.indexSerieAtual)
         }

         if (serieAtual.indexSerieAtual === quantidadeSeries) {
            setExerciciosFeitos(prevExerciciosFeitos => [
               ...prevExerciciosFeitos,
               {
                  nome,
                  quantidadeSeries,
                  repeticoes,
                  resultado: seriesFeitas,
                  variacao,
                  feito: true
               },
            ]);
            setSerieAtual({ indexSerieAtual: 0, indexExercicioAtual: serieAtual.indexExercicioAtual })
            const exercicioIndex = treinoAtual?.exercicios.findIndex((exercicio) => exercicio.nome === nome);
            if (exercicioIndex !== undefined && exercicioIndex !== -1 && treinoAtual) {
               const novoExercicios = [...treinoAtual?.exercicios];
               novoExercicios[exercicioIndex] = {
                  ...novoExercicios[exercicioIndex],
                  resultado: seriesFeitas
               };
               setTreinoAtual({
                  ...treinoAtual,
                  exercicios: novoExercicios,
                  grupo: treinoAtual?.grupo,
                  id: treinoAtual.id
               });

               setExerciciosFeitos([])
               setFazendoExercicio(!fazendoExercicio)
               toast.success("Exercicio Finalizado")
            }
         }
         if (!cargaFeita || !repeticoesFeitas) { toast.warning("Faça a série!") }
      }


   useEffect(() => {
      console.log(treinoAtual);
   }, [treinoAtual]);

   return (
      <Container>
         {treinoAtual ?
            <div className='border p-2  flex flex-wrap gap-3'>
               {treinoAtual.exercicios.map((exercicio, i) => (
                  <div className='space-y-5 text-preto bg-branco p-3 rounded w-[300px] h-[350px]' key={i}>
                     <div className='' >
                        <p className='text-lg font-bold'>Exercício <span className='text-'>{i + 1}</span>: </p>
                        <p>Nome:<span className='text-vermelho'> {exercicio.nome}</span></p>
                        <p>Repeticões: <span className='text-vermelho'>{exercicio.quantidadeSeries}x{exercicio.repeticoes}</span></p>
                        {exercicio.variacao &&
                           <p>
                              Variação:  <span className='text-vermelho'>{exercicio.variacao}</span>
                           </p>}
                     </div>
                     {!fazendoExercicio && !exercicio.feito &&
                        <div className='text-right' onClick={() => (handleFazendoExercicio(exercicio.quantidadeSeries, i))}>
                           <Button >Fazer</Button>
                        </div>
                     }
                     {fazendoExercicio && serieAtual.indexExercicioAtual === i && (
                        <div>
                           <div>Série atual: {serieAtual.indexSerieAtual} </div>
                           Repetições:
                           <Input type="number" placeholder='Repetições' onChange={(e) => (setRepeticoesFeitas(Number(e.target.value)))} />
                           Carga:
                           <Input type="number" placeholder='Carga' onChange={(e) => (setCargaFeita(Number(e.target.value)))} />
                           <div className='text-right' onClick={() => (handleSerieFeita(exercicio.nome, exercicio.quantidadeSeries, exercicio.repeticoes, exercicio.quantidadeSeries, exercicio.variacao))}>
                              <Button>Feito</Button>
                           </div>
                        </div>
                     )}
                     {exercicio.feito === true && (
                        <div>exercicio feito</div>
                     )}
                  </div>
               ))}
            </div>
            :
            <div>Dia de treino não encontrado</div>
         }
      </Container>
   )
}
