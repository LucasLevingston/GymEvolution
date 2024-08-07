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

	// Fetch history when user changes
	useEffect(() => {
		if (user) {
			fetchHistory(user.email);
		}
	}, [user]);

	const fetchHistory = async (email: string) => {
		try {
			const response = await axios.get(`${baseUrl}/${email}`);
			setHistory(response.data);
		} catch (err) {
			console.error('Error fetching history:', err);
			setError('Error fetching history');
		}
	};

	// const addToHistory = async (updatedUser: UserType) => {
	// 	if (!user) {
	// 		throw new Error('User not found');
	// 	}

	// 	const changes: string[] = [];
	// 	const fieldsToCheck = [
	// 		'name',
	// 		'email',
	// 		'street',
	// 		'number',
	// 		'postalCode',
	// 		'city',
	// 		'state',
	// 		'gender',
	// 		'phone',
	// 		'birthDate',
	// 	];

	// 	fieldsToCheck.forEach((field) => {
	// 		if (user[field] !== updatedUser[field]) {
	// 			changes.push(
	// 				`O campo ${field} foi alterado de ${user[field]} para ${updatedUser[field]}`
	// 			);
	// 		}
	// 	});

	// 	if (changes.length > 0) {
	// 		for (const change of changes) {
	// 			await createEventonHistory({
	// 				event: change,
	// 				date: new Date().toISOString(),
	// 				userId: user.id,
	// 			});
	// 		}
	// 	}
	// };

	// const createEventonHistory = async (newEvent: {
	// 	event: string;
	// 	date: string;
	// 	userId: string;
	// }) => {
	// 	try {
	// 		const response = await axios.post(baseUrl, newEvent);
	// 		setHistory((prevHistory) => [response.data, ...prevHistory]);
	// 	} catch (err) {
	// 		console.error('Error adding to history:', err);
	// 		setError('Error adding to history');
	// 	}
	// };

	return {
		history,
		error,
		fetchHistory,
		// addToHistory,
	};
};
