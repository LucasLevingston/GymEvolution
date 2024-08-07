import { useState } from 'react';
import axios from 'axios';
import { UserType } from '@/types/userType';

export const useUser = () => {
	const [user, setUser] = useState<UserType | null>(null);

	const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

	const getUser = async () => {
		const userString = await localStorage.getItem('token');
		const user: UserType | null = userString ? JSON.parse(userString) : null;

		if (!user) {
			throw new Error('Usuário não encontrado no localStorage');
		}
		const email = user.email;
		const response = await axios.get(baseUrl + `/${email}`);
		return response.data;
	};

	const login = async (email: string, password: string) => {
		const data = { email, password };
		try {
			const response = await axios.post(baseUrl + '/login', data);

			if (response.status === 200) {
				const userData = await response.data;
				localStorage.setItem('token', JSON.stringify(userData));
				setUser(userData);
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

	const criarUsuario = async (email: string, password: string) => {
		const data = { email, password };

		try {
			const response = await axios.post(`${baseUrl}/create`, data);

			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error('Erro ao criar usuário');
			}
		} catch (error) {
			console.error('Erro ao enviar solicitação:', error);
			throw new Error(`Erro ao cadastrar usuário: ${error}`);
		}
	};

	const updateUser = async (updatedUser: UserType) => {
		try {
			const response = await axios.put(`${baseUrl}`, updatedUser);
			return response.data;
		} catch (error) {
			console.error('Error updating user:', error);
			throw new Error('Erro ao alterar os dados');
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	return {
		user,
		login,
		logout,
		criarUsuario,
		getUser,
		updateUser,
	};
};

export default useUser;
