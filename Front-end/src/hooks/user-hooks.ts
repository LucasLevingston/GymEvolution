import { useState } from 'react';
import axios from 'axios';
import { UserType } from '@/types/userType';

export const useUser = () => {
	const [user, setUser] = useState<UserType | null>(null);

	const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

	const getUser = async () => {
		const userString = localStorage.getItem('token');
		const user: UserType | null = userString ? JSON.parse(userString) : null;

		if (!user) throw new Error('User not found in localStorage');

		const response = await axios.get(baseUrl + `/${user.id}`);
		if (!response) throw new Error('Error no get user');

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

	const createUser = async (email: string, password: string) => {
		const data = { email, password };

		try {
			const response = await axios.post(`${baseUrl}/create`, data);

			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error('Error creating user');
			}
		} catch (error) {
			console.error('Error sending request:', error);
			throw new Error(`Error registering user: ${error}`);
		}
	};

	const updateUser = async (updatedUser: UserType) => {
		try {
			const response = await axios.put(`${baseUrl}`, updatedUser);
			return response.data;
		} catch (error) {
			console.error('Error updating user:', error);
			throw new Error('Error updating data');
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
		createUser,
		getUser,
		updateUser,
	};
};

export default useUser;
