import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/hooks/user-hooks';
// import { UserType } from '@/types/userType';

interface History {
	event: string;
	date: string;
	userId: string;
}

export const useHistory = () => {
	const [history, setHistory] = useState<History[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { user } = useUser();

	const baseUrl = `${import.meta.env.VITE_API_URL}/historico`;

	useEffect(() => {
		if (user) {
			getHistory(user.email);
		}
	}, [user]);

	const getHistory = async (id: string) => {
		try {
			const response = await axios.get(`${baseUrl}/${id}`);
			setHistory(response.data);
			return response.data;
		} catch (error) {
			console.error('Error fetching history:', error);
			setError('Error fetching history');
			return [];
		}
	};

	return {
		history,
		error,
		getHistory,
	};
};
