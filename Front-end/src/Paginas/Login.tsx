import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { IoEyeOutline, IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export default function Login() {
   const [senhaVisivel, setSenhaVisivel] = useState(false);
   const toggleShowPassword = () => {
      setSenhaVisivel(!senhaVisivel);
   };
   const [email, setEmail] = useState('');
   const [senha, setSenha] = useState('');


   return (
      <div>
         <Toaster richColors position="top-right" />
         <Header />
         <div className="flex h-full w-full items-center justify-center pt-10">
            <Tabs defaultValue="account" className="w-[400px]">
               <TabsList className="grid w-full bg-cinzaEscuro">
                  <Label className="text-2xl text-white">Entrar na sua conta</Label>
               </TabsList>
               <TabsContent value="account">
                  <Card>
                     <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription></CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-2">
                        <div className="space-y-1">
                           <Label htmlFor="email">Email</Label>
                           <Input
                              id="email"
                              required
                              onChange={(e) => setEmail(e.target.value)}
                           />
                        </div>
                        <div className="space-y-1">
                           <Label htmlFor="senha">Senha</Label>
                           <div className="flex">
                              <Input
                                 id="senha1"
                                 type={senhaVisivel ? 'text' : 'password'}
                                 required
                                 minLength={8}
                                 onChange={(e) => setSenha(e.target.value)}
                              />
                              <button
                                 id="senha2"
                                 onClick={toggleShowPassword}
                                 className="pl-3"
                                 type="button"
                              >
                                 {senhaVisivel ? (
                                    <IoEyeOutline className="h-7 w-7" />
                                 ) : (
                                    <IoEyeSharp className="h-7 w-7" />
                                 )}
                              </button>
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter className="flex flex-col items-center justify-center">
                        {/* {carregando ? (
                           <Button disabled>
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              Carregando...
                           </Button>
                        ) : !error ? (
                           <Button
                              variant="outline"
                              onClick={async () => {
                                 if (await loginComEmailESenha(email, senha)) {
                                    toast.success('Login efetuado com sucesso!');
                                    setTimeout(() => {
                                       window.location.href = '/';
                                    }, 2000);
                                 } else {
                                    toast.error('Email ou senha inválidos');
                                    setTimeout(() => {
                                       window.location.href = '/';
                                    }, 2000);
                                 }
                              }}
                           >
                              Entrar
                           </Button>
                        ) : (
                           <Button variant="destructive" disabled>
                              {error.message}
                           </Button>
                        )} */}
                        <br />
                        <Link
                           to="/redefinir-senha"
                           className="text-[12px] text-mainColor"
                        >
                           Esqueceu a senha? Clique aqui para recuperar
                        </Link>
                     </CardFooter>
                     <CardFooter className="flex flex-col items-center justify-center">
                        <Label>Não possui conta?</Label>
                        <Link
                           to="/cadastro-usuario"
                           className="text-[12px] text-mainColor"
                        >
                           Fazer cadastro aqui!
                        </Link>
                     </CardFooter>
                  </Card>
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}