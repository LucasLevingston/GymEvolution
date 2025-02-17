import { create } from 'zustand';
import axios from 'axios';
import { WeightType } from '@/types/userType';

interface WeightState {
	weights: WeightType[];
	isLoading: boolean;
	error: string | null;
	fetchWeights: () => Promise<void>;
	addWeight: (newWeight: Omit<WeightType, 'id'>) => Promise<void>;
	updateWeight: (updatedWeight: WeightType) => Promise<void>;
}

const useWeight = create<WeightState>((set) => ({
	weights: [],
	isLoading: false,
	error: null,

	fetchWeights: async () => {
		set({ isLoading: true });
		try {
			const response = await axios.get('/weights');
			set({ weights: response.data, isLoading: false, error: null });
		} catch (error) {
			set({ error: 'Failed to fetch weights', isLoading: false });
		}
	},

	addWeight: async (newWeight) => {
		set({ isLoading: true });
		try {
			const response = await axios.post(`/weights`, newWeight);
			console.log(response);
		} catch (error) {
			set({ error: 'Failed to add weight', isLoading: false });
		}
	},

	updateWeight: async (updatedWeight) => {
		set({ isLoading: true });
		try {
			const response = await axios.put(
				`/weights/${updatedWeight.id}`,
				updatedWeight
			);
			console.log(response);
		} catch (error) {
			set({ error: 'Failed to update weight', isLoading: false });
		}
	},
}));

export default useWeight;
