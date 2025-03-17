// import Container from '@/components/Container'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import useUser from '@/hooks/user-hooks'
// import { DiaDeTreinoType, ExercicioType, serieType } from '@/types/treinoType'
// import { useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { toast } from 'sonner'

// interface SerieAtualType {
//   indexExercicioAtual: number
//   indexSerieAtual: number
// }

// export const Treinando: React.FC = () => {
//   const { user } = useUser()

//   const treinoId = useParams()
//   const treino = user?.TreinoDaSemana?.diaDeTreino.find(
//     (diaDeTreino: DiaDeTreinoType) =>
//       Number(treinoId) === Number(diaDeTreino.id)
//   )
//   const [treinoAtual, setTreinoAtual] = useState(treino)
//   const [fazendoExercicio, setFazendoExercicio] = useState(false)
//   const [serieAtual, setSerieAtual] = useState<SerieAtualType>({
//     indexExercicioAtual: 0,
//     indexSerieAtual: 0,
//   })
//   const [seriesFeitas, setSeriesFeitas] = useState<serieType[]>([])
//   const [repeticoesFeitas, setRepeticoesFeitas] = useState<number>()
//   const [cargaFeita, setCargaFeita] = useState<number>()

//   const handleFazendoExercicio = (
//     quantidadeSeries: number,
//     indexExercicioAtual: number
//   ) => {
//     if (!fazendoExercicio) {
//       setFazendoExercicio(!fazendoExercicio)
//       setSerieAtual({
//         indexExercicioAtual,
//         indexSerieAtual: 1,
//       })
//     }
//   }

//   const handleSerieFeita = async (nome: string, quantidadeSeries: number) => {
//     await Promise.all([cargaFeita, repeticoesFeitas])
//     if (!cargaFeita || !repeticoesFeitas) {
//       toast.warning('Faça a série!')
//     }

//     setSeriesFeitas(prevSeriesFeitas => [
//       ...prevSeriesFeitas,
//       {
//         carga: cargaFeita,
//         repeticoes: repeticoesFeitas,
//         serie: serieAtual.indexSerieAtual,
//       },
//     ])
//     await Promise.all([seriesFeitas])
//     toast.success(`Registrada! Serie feita: ${serieAtual.indexSerieAtual} `)
//     if (serieAtual.indexSerieAtual === quantidadeSeries) {
//       console.log(seriesFeitas)
//       setSerieAtual({
//         indexSerieAtual: 0,
//         indexExercicioAtual: serieAtual.indexExercicioAtual,
//       })
//       const exercicioIndex = treinoAtual?.exercicios.findIndex(
//         (exercicio: ExercicioType) => exercicio.nome === nome
//       )
//       if (
//         exercicioIndex !== undefined &&
//         exercicioIndex !== -1 &&
//         treinoAtual
//       ) {
//         const novoExercicio = [...treinoAtual?.exercicios]
//         novoExercicio[exercicioIndex] = {
//           ...novoExercicio[exercicioIndex],
//           resultado: seriesFeitas,
//           feito: true,
//         }
//         setTreinoAtual({
//           ...treinoAtual,
//           exercicios: novoExercicio,
//           grupo: treinoAtual?.grupo,
//           id: treinoAtual.id,
//         })

//         setSeriesFeitas([])
//         setFazendoExercicio(!fazendoExercicio)
//         return toast.success('Exercicio Finalizado')
//       }
//     }
//     setSerieAtual({
//       indexSerieAtual: serieAtual.indexSerieAtual + 1,
//       indexExercicioAtual: serieAtual.indexExercicioAtual,
//     })
//   }

//   return (
//     <Container>
//       {treinoAtual ? (
//         <div className="p-2">
//           <div className="flex flex-wrap gap-3">
//             {treinoAtual.exercicios.map(
//               (exercicio: ExercicioType, i: number) => (
//                 <div
//                   className="h-[350px] w-[300px] space-y-5 rounded bg-branco p-3 text-preto"
//                   key={i}
//                 >
//                   <div className="">
//                     <p className="text-lg font-bold">
//                       Exercício <span className="text-">{i + 1}</span>:{' '}
//                     </p>
//                     <p>
//                       Nome:{' '}
//                       <span className="text-vermelho">{exercicio.nome}</span>
//                     </p>
//                     <p>
//                       Repeticões:{' '}
//                       <span className="text-vermelho">
//                         {exercicio.quantidadeSeries}x{exercicio.repeticoes}
//                       </span>
//                     </p>
//                     {exercicio.variacao && (
//                       <p>
//                         Variação:{' '}
//                         <span className="text-vermelho">
//                           {exercicio.variacao}
//                         </span>
//                       </p>
//                     )}
//                   </div>
//                   {!fazendoExercicio && exercicio.feito === false && (
//                     <div
//                       className="text-right"
//                       onClick={() =>
//                         handleFazendoExercicio(exercicio.quantidadeSeries, i)
//                       }
//                     >
//                       <Button>Fazer</Button>
//                     </div>
//                   )}
//                   {fazendoExercicio && serieAtual.indexExercicioAtual === i && (
//                     <div>
//                       <div>Série atual: {serieAtual.indexSerieAtual} </div>
//                       Repetições:
//                       <Input
//                         type="number"
//                         placeholder="Repetições"
//                         onChange={e =>
//                           setRepeticoesFeitas(Number(e.target.value))
//                         }
//                       />
//                       Carga:
//                       <Input
//                         type="number"
//                         placeholder="Carga"
//                         onChange={e => setCargaFeita(Number(e.target.value))}
//                       />
//                       <div
//                         className="text-right"
//                         onClick={() =>
//                           handleSerieFeita(
//                             exercicio.nome,
//                             exercicio.quantidadeSeries
//                           )
//                         }
//                       >
//                         <Button>Feito</Button>
//                       </div>
//                     </div>
//                   )}
//                   {exercicio.resultado?.map((resultado, i) => (
//                     <div key={i} className="rounded  bg-cinza p-1">
//                       Série {resultado.serie}: Repetições:{' '}
//                       {resultado.repeticoes} - Carga: {resultado.carga}kg
//                     </div>
//                   ))}
//                 </div>
//               )
//             )}
//           </div>
//           <div className="text-right">
//             <Button className="bg-branco text-preto hover:bg-white/70">
//               Treino finalizado
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <div>Dia de treino não encontrado</div>
//       )}
//     </Container>
//   )
// }
