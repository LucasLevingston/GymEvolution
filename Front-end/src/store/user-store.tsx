import { UserType } from '@/types/userType';
import { create } from 'zustand';

interface UserStoreProps {
	user: UserType | null;
	token: string | null;
	setUser: (user: UserType) => void;
	updateUser: (updatedUser: Partial<UserType>) => void;
	clearUser: () => void;
	getUser: () => UserType;
	setToken: (token: string) => void;
}
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;
const storedToken = localStorage.getItem('token');
const initialToken = storedToken ? JSON.parse(storedToken) : null;

export const useUserStore = create<UserStoreProps>()((set) => ({
	user: initialUser,
	token: initialToken,
	setUser: (user) => {
		set({ user });
		localStorage.setItem('user', JSON.stringify(user));
		return user;
	},

	updateUser: (updatedUser) =>
		set((state) => {
			const newUser = state.user ? { ...state.user, ...updatedUser } : null;
			localStorage.setItem('user', JSON.stringify(newUser));
			return { user: newUser };
		}),

	clearUser: () => {
		set({ user: null, token: null });

		localStorage.removeItem('user');
		localStorage.removeItem('token');
	},

	getUser: () => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	},

	getToken: () => {
		const storedUser = localStorage.getItem('token');
		return storedUser ? JSON.parse(storedUser) : null;
	},

	setToken: (token) => {
		set({ token });
		localStorage.setItem('token', JSON.stringify(token));
		return token;
	},
}));
