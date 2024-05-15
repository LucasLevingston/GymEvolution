import { useState, useEffect } from 'react';
import axios from 'axios'

export const useUser = () => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   const baseUrl = "http://localhost:3100"

   useEffect(() => {
      const checkAuthenticated = async () => {
         try {
            const token = localStorage.getItem('token');
            if (token) {
               const response = await fetch('/users', {
                  headers: {
                     Authorization: `Bearer ${token}`
                  }
               });
               if (response.ok) {
                  const userData = await response.json();
                  setUser(userData);
               } else {
                  setUser(null);
                  localStorage.removeItem('token');
               }
            } else {
               setUser(null);
            }
         } catch (error) {
            console.error('Error while checking authentication:', error);
            setUser(null);
         } finally {
            setLoading(false);
         }
      };

      checkAuthenticated();

      return () => {
         setUser(null);
      };
   }, []);

   const login = async (email: string, password: string) => {
      try {
         const response = await fetch(baseUrl + '/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
         });
         if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
         } else {
            throw new Error('Failed to login');
         }
      } catch (error) {
         console.error('Error while logging in:', error);
      }
   };

   const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
   };

   const criarUsuario = async (email: string, senha: string) => {
      const data = { email, senha };

      try {
         console.log('Dados enviados:', data); // Log dos dados antes de enviar a solicitação

         const response = await axios.post(baseUrl + '/users', data);

         if (response.status === 200) {
            console.log('Usuário criado com sucesso:', response.data);
            localStorage.setItem("token", response.data.id)
            return response.data;
         } else {
            console.error('Erro ao criar usuário:', response.status);
            throw new Error('Erro ao criar usuário');
         }
      } catch (error) {
         console.error('Erro ao enviar solicitação:', error);
         throw new Error(`Erro ao cadastrar usuário: ${error}`);
      }
   };

   return { user, loading, login, logout, criarUsuario }

};

export default useUser;
