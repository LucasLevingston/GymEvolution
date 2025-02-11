import axios from 'axios';
import type { UserType } from '@/types/userType';
import { useUserStore } from '@/store/user-store';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
export const useUser = () => {
	const {
		setUser,
		user,
		clearUser,
		updateUser: updateUserStore,
		token,
		setToken,
	} = useUserStore();

	const getUser = async (id: string): Promise<UserType> => {
		const response = await axios.get<UserType>(`${baseUrl}/${id}`);
		if (!response.data) throw new Error('Error no get user');

		if (response.data.id === user?.id) {
			setUser(response.data);
		}
		return response.data;
	};

	const login = async (email: string, password: string): Promise<UserType> => {
		const data = { email, password };
		try {
			const response = await axios.post<{ user: UserType; token: string }>(
				`${baseUrl}/login`,
				data
			);
			if (response.status !== 200) throw new Error('Error on login');
			setUser(response.data.user);
			setToken(response.data.token);
			console.log('TESTE:', user, token);
			return response.data.user;
		} catch (error: any) {
			throw new Error(error.response.data.message);
		}
	};

	const createUser = async (newUser: {
		email: string;
		password: string;
	}): Promise<UserType> => {
		try {
			const response = await axios.post<UserType>(`${baseUrl}/create`, newUser);

			return response.data;
		} catch (error: any) {
			throw new Error(error.response.data.message);
		}
	};

	const updateUser = async (
		updatedUser: Partial<UserType>
	): Promise<UserType> => {
		try {
			const response = await axios.put<UserType>(`${baseUrl}`, updatedUser, {
				headers: { Authorization: `Bearer ${token}` },
			});

			updateUserStore(response.data);

			return response.data;
		} catch (error: any) {
			throw new Error(error.response.data.message);
		}
	};

	const logout = () => {
		clearUser();
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
