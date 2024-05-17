import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useUser from '@/hooks/user-hooks';
import { SemanaDeTreinoCreate } from '@/types/treinoType';
import { UserType } from '@/types/userType';
import React, { useEffect, useState, ChangeEvent } from 'react';

export default function NovoTreino() {
   const { getUser } = useUser();
   const [user, setUser] = useState<UserType | null>(null);
   const [semanaDeTreino, setSemanaDeTreino] = useState<SemanaDeTreinoCreate>({
      informacoes: '',
      feito: false,
      treino: [{
         grupo: '',
         diaDaSemana: '',
         feito: false,
         observacoes: '',
         exercicios: [{
            nome: '',
            variacao: '',
            repeticoes: '',
            quantidadeDeSeries: '',
            feito: false,
            resultado: [{
               serieIndex: '',
               repeticoes: '',
               carga: ''
            }]
         }]
      }]
   });

   useEffect(() => {
      const fetchUser = async () => {
         const fetchedUser = await getUser();
         setUser(fetchedUser);
      };

      fetchUser();
   }, [getUser]);

   const handleInputChange =
      (e: ChangeEvent<HTMLInputElement>, treinoIndex: number, exercicioIndex?: number, resultadoIndex?: number) => {
         const { name, value } = e.target;
         setSemanaDeTreino((prevTreino) => {
            const updatedTreino = { ...prevTreino };
            if (name in updatedTreino) {
               (updatedTreino as any)[name] = value;
            } else if (exercicioIndex !== undefined && resultadoIndex !== undefined) {
               updatedTreino.treino[treinoIndex].exercicios[exercicioIndex].resultado[resultadoIndex][name] = value;
            } else if (exercicioIndex !== undefined) {
               updatedTreino.treino[treinoIndex].exercicios[exercicioIndex][name] = value;
            } else {
               updatedTreino.treino[treinoIndex][name] = value;
            }
            return updatedTreino;
         });
      };

   const handleAddExercicio = (treinoIndex: number) => {
      setSemanaDeTreino((prevTreino) => {
         const updatedTreino = { ...prevTreino };
         updatedTreino.treino[treinoIndex].exercicios.push({
            nome: '',
            variacao: '',
            repeticoes: '',
            quantidadeDeSeries: '',
            feito: false,
            resultado: [{
               serieIndex: '',
               repeticoes: '',
               carga: ''
            }]
         });
         return updatedTreino;
      });
   };

   const handleSubmit = async () => {
      console.log('Treino data:', semanaDeTreino);
   };

   return (
      <Container>
         {user && (
            <div className='w-full h-screen text-preto space-y-3'>
               <Input
                  value={semanaDeTreino.informacoes}
                  name="informacoes"
                  placeholder='Informações (opcional)'
                  className='w-1/2'
                  onChange={(e) => handleInputChange(e, 0)}
               />
               {semanaDeTreino.treino.map((treino, treinoIndex) => (
                  <div key={treinoIndex} className='border bg-branco flex  flex-wrap w-[100%] space-y-3 p-2 rounded'>
                     Dia {treinoIndex + 1} ({treino.diaDaSemana})
                     <Input
                        value={treino.grupo}
                        name="grupo"
                        placeholder='Grupo muscular'
                        onChange={(e) => handleInputChange(e, treinoIndex)}
                     />
                     <Input
                        value={treino.diaDaSemana}
                        name="diaDaSemana"
                        placeholder='Dia da Semana'
                        onChange={(e) => handleInputChange(e, treinoIndex)}
                     />
                     {treino.exercicios.map((exercicio, exercicioIndex) => (
                        <div key={exercicioIndex} className='p-2 bg-preto space-y-3'>
                           <Input
                              value={exercicio.nome}
                              name="nome"
                              placeholder='Nome do Exercício'
                              onChange={(e) => handleInputChange(e, treinoIndex, exercicioIndex)}
                           />
                           <Input
                              value={exercicio.variacao}
                              name="variacao"
                              placeholder='Variação'
                              onChange={(e) => handleInputChange(e, treinoIndex, exercicioIndex)}
                           />
                           <Input
                              value={exercicio.repeticoes}
                              name="repeticoes"
                              placeholder='Repetições'
                              onChange={(e) => handleInputChange(e, treinoIndex, exercicioIndex)}
                           />
                           <Input
                              value={exercicio.quantidadeDeSeries}
                              name="quantidadeDeSeries"
                              placeholder='Quantidade de Séries'
                              onChange={(e) => handleInputChange(e, treinoIndex, exercicioIndex)}
                           />
                        </div>
                     ))}
                  </div>
               ))}
               <Button onClick={() => handleAddExercicio(treinoIndex)}>
                  Adicionar Exercício
               </Button>
               <Button onClick={handleSubmit}>Salvar Treino</Button>
            </div>
         )}
      </Container>
   );
}

