import { useState, } from 'react';
import axios from 'axios'
import { toast } from 'sonner';
import { UserType } from '@/types/userType';

export const useUser = () => {
   const [user, setUser] = useState(null);
   // const [loading, setLoading] = useState(false);

   const baseUrl = "http://localhost:3100/users"

   // useEffect(() => {
   //    const checkAuthenticated = async () => {
   //       try {
   //          const token = localStorage.getItem('token');
   //          if (token) {
   //             const response = await fetch('/users', {
   //                headers: {
   //                   Authorization: `Bearer ${token}`
   //                }
   //             });
   //             if (response.ok) {
   //                const userData = await response.json();
   //                setUser(userData);
   //             } else {
   //                setUser(null);
   //                localStorage.removeItem('token');
   //             }
   //          } else {
   //             setUser(null);
   //          }
   //       } catch (error) {
   //          console.error('Error while checking authentication:', error);
   //          setUser(null);
   //       } finally {
   //          setLoading(false);
   //       }
   //    };

   //    checkAuthenticated();

   //    return () => {
   //       setUser(null);
   //    };
   // }, []);
   const getUser = async () => {
      const userString = await localStorage.getItem("token");
      const user: UserType = userString ? await JSON.parse(userString) : null;
      return user
   }


   const login = async (email: string, senha: string) => {
      const data = { email, senha };
      console.log(user)
      try {
         const response = await axios.post(baseUrl + '/login', data);

         if (response.status === 200) {
            const userData = await response.data
            localStorage.setItem('token', JSON.stringify(userData));
            setUser(userData);
            console.log("usuario no local storage:", userData)
            // console.log(localStorage.getItem("token"))
            return true;
         } else {
            let errorMessage = 'Failed to login';
            if (response.status === 401) {
               errorMessage = 'Invalid email or password';
            } else if (response.status === 500) {
               errorMessage = 'Server error. Please try again later';
            }
            throw new Error(errorMessage);
         }
      } catch (error) {
         console.error('Error while logging in:', error);
         return false;
      }
   };

   const criarUsuario = async (email: string, senha: string) => {
      const data = { email, senha };

      try {
         const response = await axios.post(baseUrl, data);

         if (response.status === 200) {
            toast.success('Usuário criado com sucesso.');
            return response.data;
         } else {
            toast.error('Erro ao criar usuário.');
            throw new Error('Erro ao criar usuário');
         }
      } catch (error) {
         console.error('Erro ao enviar solicitação:', error);
         throw new Error(`Erro ao cadastrar usuário: ${error}`);
      }
   };
   const alterarDados = async (id: string,
      campo: string,
      novoValor: string | File | number) => {
   }
   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
   };

   return { user, login, logout, criarUsuario, getUser, alterarDados }

};

export default useUser;
