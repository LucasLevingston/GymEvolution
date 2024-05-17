import BotaoAlterarDado from "@/components/BotaoAlterarDado";
import BotaoMostrarHistorico from "@/components/BotaoMostrarHistorico";
import Container from "@/components/Container";
import Paginacao from "@/components/Paginacao";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataFormatada, formatarTelefone } from "@/estatico";
import useUser from "@/hooks/user-hooks";
import { SemanaDeTreinoType } from "@/types/treinoType";
import { Historico, Peso, UserType } from "@/types/userType";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const DadosPessoais: React.FC = () => {
   const { getUser } = useUser();
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

   const [formato, setFormato] = useState('rounded-none h-56');
   const [pagina, setPagina] = useState(1);
   const [dadosAlterados, setDadosAlterados] = useState<{
      campo: string;
      novoValor: string | Historico | Peso | SemanaDeTreinoType;
   }>({ campo: '', novoValor: '' });


   const handleChangePage = (page: number) => {
      setPagina(page);
   };

   function onChangeFoto() {
      if (formato == 'h-48') {
         setFormato('rounded-none h-56');
      } else if (formato == 'rounded-none h-56') {
         setFormato('h-48');
      }
   }

   const handleChange = async (campo: string, valor: string | Historico | Peso | SemanaDeTreinoType) => {
      setDadosAlterados({
         campo: campo,
         novoValor: valor,
      });
   };

   return (
      <Container>
         {user ? (
            <div className="flex w-full flex-col items-center justify-center pb-3  ">
               <div className="w-[70%] space-y-8 rounded-3xl border-[4px] bg-branco border-preto text-preto p-5">
                  <div className="flex items-center w-[65%]  justify-between ">
                     <div className="flex items-center space-x-2">
                        <BotaoMostrarHistorico />
                     </div>
                     <div className="p-3 pb-3 text-[40px] font-bold text-preto">
                        Dados do Usuário
                     </div>
                  </div>
                  {pagina == 1 ? (
                     <div>
                        <div className="pb-3 text-2xl font-bold">
                           Informações
                        </div>
                        <div className="flex">
                           <div className="flex w-[50%] flex-col">
                              <div className="w-full space-y-5">
                                 <div className="h-13 w-[90%]  bg-cinza p-2 ">
                                    <h1 className="text-xs font-bold">Nome</h1>
                                    <div className="flex items-center justify-between">
                                       <h2 className="text-lg">{user.nome}</h2>
                                       <BotaoAlterarDado
                                          field="nome"
                                          novoValor={dadosAlterados.novoValor as string}
                                          handleChange={handleChange}
                                          antigoValor={user.nome}
                                       />
                                    </div>{' '}
                                 </div>
                                 <div className="h-13 w-[90%]  bg-cinza p-2 ">
                                    <h1 className="text-xs font-bold">Email</h1>
                                    <div className="flex items-center justify-between">
                                       <h2 className="text-lg">{user.email}</h2>
                                       <BotaoAlterarDado

                                          field="email"
                                          novoValor={dadosAlterados.novoValor as string}
                                          handleChange={handleChange}
                                          antigoValor={user.email}
                                       />
                                    </div>{' '}
                                 </div>
                                 <div className="flex w-[90%]">
                                    <div className="w-[70%]">
                                       <div className="h-13 w-[90%]  bg-cinza p-2 ">
                                          <h1 className="text-xs font-bold">Rua</h1>

                                          <div className="flex items-center justify-between">
                                             <h2 className="text-lg">{user.rua}</h2>
                                             <BotaoAlterarDado

                                                field="rua"
                                                novoValor={dadosAlterados.novoValor as string}
                                                handleChange={handleChange}
                                                antigoValor={user.rua}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="w-[30%]">
                                       <div className="h-13 bg-cinza p-2 ">
                                          <h1 className="text-xs font-bold">Número</h1>
                                          <div className="flex items-center justify-between">
                                             <h2 className="text-lg">
                                                {user.numero}
                                             </h2>
                                             <BotaoAlterarDado

                                                field="numero"
                                                novoValor={dadosAlterados.novoValor as string}
                                                handleChange={handleChange}
                                                antigoValor={user.numero}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="h-13 w-[90%]  bg-cinza p-2 ">
                                    <h1 className="text-xs font-bold">CEP</h1>
                                    <div className="flex items-center justify-between">
                                       <h2 className="text-lg">{user.cep}</h2>
                                       <BotaoAlterarDado

                                          field="cep"
                                          novoValor={dadosAlterados.novoValor as string}
                                          handleChange={handleChange}
                                          antigoValor={user.cep}
                                       />
                                    </div>
                                 </div>
                                 <div className="flex w-[90%] justify-between">
                                    <div className="h-13 w-[50%] bg-cinza p-2 ">
                                       <h1 className="text-xs font-bold">Cidade</h1>
                                       <div className="flex items-center justify-between">
                                          <h2 className="text-lg">{user.cidade}</h2>
                                          <BotaoAlterarDado

                                             field="cidade"
                                             novoValor={dadosAlterados.novoValor as string}
                                             handleChange={handleChange}
                                             antigoValor={user.cidade}
                                          />
                                       </div>
                                    </div>
                                    <div className="h-13 w-[45%]  bg-cinza p-2 ">
                                       <h1 className="text-xs font-bold">Estado</h1>
                                       <div className="flex items-center justify-between">
                                          <h2 className="text-lg">{user.estado}</h2>
                                          <BotaoAlterarDado

                                             field="estado"
                                             novoValor={dadosAlterados.novoValor as string}
                                             handleChange={handleChange}
                                             antigoValor={user.estado}
                                          />
                                       </div>{' '}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex w-[50%] flex-col ">
                              <div className="w-full space-y-5 ">
                                 <div className="flex w-[90%] justify-between space-x-4 bg-cinza p-2">
                                    <div className="flex space-x-4">
                                       <div className="flex flex-col  space-x-2">
                                          <h1 className="py-2 pl-2 text-xs font-bold">
                                             Foto de Perfil
                                          </h1>
                                          <Avatar
                                             className={`${formato}  w-48 border-[4px]  border-cinzabg-cinza`}
                                          >
                                             {/* <AvatarImage
                                                className="h-full w-full"
                                                src={user.fotoPerfilUrl}
                                             /> */}
                                             <AvatarFallback>
                                                {/* <RxAvatar className="h-full w-full" /> */}
                                             </AvatarFallback>
                                          </Avatar>
                                       </div>
                                       <div className="flex justify-center space-x-4 pt-10">
                                          <Switch
                                             aria-readonly
                                             className=""
                                             onCheckedChange={() => {
                                                onChangeFoto();
                                             }}
                                          />
                                          <Label>Foto redonda</Label>
                                       </div>
                                    </div>
                                    {/* <BotaoAlterarDado
                                     
                                       field="fotoPerfil"
                                       novoValor={dadosAlterados.novoValor as File}
                                       handleChange={handleChange}
                                       antigoValor={user.fotoPerfilUrl}
                                    /> */}
                                 </div>
                                 <div className="h-13 w-[90%]  bg-cinza p-2 ">
                                    <h1 className="text-xs font-bold">Sexo</h1>
                                    <div className="flex items-center justify-between">
                                       <h2 className="text-lg">{user.sexo}</h2>
                                       <BotaoAlterarDado

                                          field="sexo"
                                          novoValor={dadosAlterados.novoValor as string}
                                          handleChange={handleChange}
                                          antigoValor={user.sexo}
                                       />
                                    </div>{' '}
                                 </div>
                                 <div className="flex w-[90%] justify-between">
                                    <div className="h-13 w-[50%]  bg-cinza p-2 ">
                                       <h1 className="text-xs font-bold">
                                          Número de Celular
                                       </h1>
                                       <div className="flex items-center justify-between">
                                          <h2 className="text-lg">
                                             {formatarTelefone(user.telefone ?? '')}
                                          </h2>
                                          <BotaoAlterarDado

                                             field="telefone"
                                             novoValor={dadosAlterados.novoValor as string}
                                             handleChange={handleChange}
                                             antigoValor={user.telefone}
                                          />
                                       </div>
                                    </div>
                                    <div className="h-13 w-[45%]  bg-cinza p-2 ">
                                       <h1 className="text-xs font-bold">
                                          Data de Aniversário
                                       </h1>
                                       <div className="flex items-center justify-between">
                                          <h2 className="text-lg">
                                             {DataFormatada(user.nascimento ?? '')}
                                          </h2>
                                          <BotaoAlterarDado

                                             field="nascimento"
                                             novoValor={dadosAlterados.novoValor as string}
                                             handleChange={handleChange}
                                             antigoValor={user.nascimento}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div>

                     </div>
                  )}
                  <Paginacao onChangePage={handleChangePage} />
               </div>
            </div>

         ) : (
            <div className="flex items-center justify-center space-x-5 ">
               <div>Faça o login para Continuar </div>
               <Button variant="outline">
                  <Link to="/login">Fazer login</Link>
               </Button>
            </div>
         )}
      </Container>
   );
}