import React, { useEffect, useState } from 'react';
import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from './ui/alert-dialog';
import { LuPencil } from 'react-icons/lu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
   estadosBrasileiros,
   formatarDataParaNumeros,
   formatarTelefoneParaNumeros,
   sexoOpcoes,
} from '@/estatico';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from './ui/command';
import { IMaskInput } from 'react-imask';
import { Historico, Peso, UserType } from '@/types/userType';
import useUser from '@/hooks/user-hooks';
import { toast } from 'sonner';
import { SemanaDeTreinoType } from '@/types/treinoType';

export default function BotaoAlterarDado({

   field,
   novoValor,
   antigoValor,
   handleChange,
}: {

   field: string;
   novoValor: string | Historico | Peso | SemanaDeTreinoType;
   antigoValor?: string | number;
   handleChange: (field: string, value: string | Historico | Peso | SemanaDeTreinoType) => void;
}) {
   const [isOpen, setIsOpen] = useState(false);
   const { getUser, alterarDados } = useUser();
   const [user, setUser] = useState<UserType | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const fetchedUser = await getUser();
            setUser(fetchedUser);
         } catch (error) {
            setError("Erro ao buscar o usuário");
         }
      };

      fetchUser();
   }, [getUser]);
   const handleOpenDialog = () => {
      setIsOpen(true);
   };

   const handleCloseDialog = () => {
      setIsOpen(false);
   };

   const handleContinue = async () => {
      handleChange(field, novoValor);
      handleCloseDialog();
      if (user && user.id) {
         if (user.id && field && novoValor) {
            const result = await alterarDados(user.email, field, novoValor)
            if (result) {


               setTimeout(() => {
                  window.location.reload;
               }, 2000);
            }
         } else {
            toast.error('Erro ao atualizar funcionário');
            // setTimeout(() => {
            //    window.location.href = '/';
            // }, 2000);

         }
      }
   };
   function opcoesSelecionar(field: string) {
      if (field === 'sexo') return sexoOpcoes;
   }
   const [open, setOpen] = React.useState(false);
   const [value, setValue] = React.useState('');

   return (
      <>
         <AlertDialog open={isOpen}>
            <AlertDialogTrigger
               asChild
               className="flex items-center justify-center"
            >
               <Button variant="ghost" onClick={handleOpenDialog}>
                  <LuPencil />
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-cinza">
               <AlertDialogHeader>
                  <AlertDialogTitle className="border-cinza ">
                     Alterar dado{' '}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                     {
                        // field === 'fotoPerfil' ? (
                        //    <>
                        //       Atual:
                        //       <img
                        //          className="h-48 w-48 rounded"
                        //          src={user.fotoPerfilUrl}
                        //       />
                        //    </>
                        // ) : 
                        (
                           <>Atual: {String(antigoValor)}</>
                        )}
                  </AlertDialogDescription>
                  {field === 'nascimento' || field === 'dataAdmissao' ? (
                     <Input
                        type="date"
                        className="w-[50%] border-[2px] bg-cinza "
                        placeholder="Selecione a data"
                        onChange={(event) =>
                           handleChange(
                              field,
                              formatarDataParaNumeros(event.target.value)
                           )
                        }
                     />
                  ) : field === 'cep' ? (
                     <div className="flex-col border-preto bg-cinza  p-3">
                        <IMaskInput
                           mask="00000-000"
                           placeholder="Digite o CEP"
                           className="rounded bg-branco p-2"
                           onAccept={(event: string) => {
                              handleChange(field, event);
                           }}
                        />
                     </div>
                  ) : field === 'estado' ? (
                     <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                           asChild
                           className="border-[2px] border-mainColor"
                        >
                           <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn('w-[200px] justify-between border-preto ')}
                           >
                              {value
                                 ? estadosBrasileiros.find(
                                    (estado) => estado.value === value
                                 )?.label
                                 : 'Selecione o estado'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] bg-branco p-0 text-preto">
                           <Command>
                              <CommandInput placeholder="Selecione o estado" />
                              <CommandEmpty>Estado nao encontrado</CommandEmpty>
                              <CommandList className="">
                                 <CommandGroup className="bg-branco font-bold text-preto ">
                                    {estadosBrasileiros.map((estado) => (
                                       <CommandItem
                                          className="font-bold text-preto "
                                          value={estado.value}
                                          key={estado.value}
                                          onSelect={(e: string) => {
                                             setValue(e);
                                             handleChange(field, e);
                                             setOpen(false);
                                          }}
                                       >
                                          <Check
                                             className={cn(
                                                'mr-2 h-4 w-4',
                                                estado.value === antigoValor
                                                   ? 'opacity-100'
                                                   : 'opacity-0'
                                             )}
                                          />
                                          {estado.label}
                                       </CommandItem>
                                    ))}
                                 </CommandGroup>
                              </CommandList>
                           </Command>
                        </PopoverContent>
                     </Popover>
                  ) : field === 'telefone' ? (
                     <div className="flex-col border-preto bg-cinza  p-3">
                        <IMaskInput
                           mask="(00) 00000-0000"
                           placeholder="Digite o Telefone"
                           className="rounded bg-branco p-2"
                           onAccept={(event: string) => {
                              handleChange(field, formatarTelefoneParaNumeros(event));
                           }}
                        />
                     </div>
                  ) : field === 'sexo' ? (
                     <Select
                        onValueChange={(value: string) => handleChange(field, value)}
                        defaultValue={novoValor?.toString()}
                     >
                        <div className="flex justify-between">
                           <SelectTrigger className="w-[180px] border-[2px]  ">
                              <SelectValue placeholder="Selecionar" />
                           </SelectTrigger>
                           <SelectContent className="bg-branco text-preto ">
                              {opcoesSelecionar(field)?.map((opcao) => (
                                 <SelectItem key={opcao.id} value={opcao.id}>
                                    {opcao.opcao}
                                 </SelectItem>
                              ))}
                           </SelectContent>

                        </div>
                     </Select>
                  ) :
                     // field === 'fotoPerfil' ? (
                     //    <Input
                     //       type="file"
                     //       accept="image/png,image/jpeg"
                     //       onChange={(event) => {
                     //          if (event.target.files && event.target.files[0]) {
                     //             handleChange(field, event.target.files[0]);
                     //          }
                     //       }}
                     //       className="border-[2px] bg-cinza font-bold text-preto"
                     //    />
                     // )
                     //  :
                     field === 'salario' ? (
                        <Input
                           placeholder="Digite o novo valor"
                           onChange={(event) => {
                              handleChange(field, event.target.value);
                           }}
                           type={'number'}
                        />
                     ) : (
                        <Input
                           placeholder="Digite o novo valor"
                           onChange={(event) => {
                              handleChange(field, event.target.value);
                           }}
                           type={
                              field === 'salario' || field === 'numero' ? 'Number' : 'text'
                           }
                        />
                     )}
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel
                     className="border-transparent"
                     onClick={handleCloseDialog}
                  >
                     Cancelar
                  </AlertDialogCancel>
                  <Button
                     variant="outline"
                     className="border-preto"
                     onClick={handleContinue}
                  >
                     Alterar
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}