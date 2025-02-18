'use client';

import { useState } from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { WeightType } from '@/types/userType';
import { RegisterWeightDialog } from '../RegisterWeightDialog';

interface WeightChartProps {
	weights: WeightType[];
}

export function WeightChart({ weights: initialWeights }: WeightChartProps) {
	const [weights, setWeights] = useState(initialWeights);

	const chartData = weights.map((weight) => ({
		date: new Date(weight.date).toLocaleDateString(),
		weight: weight.weight,
	}));

	const handleWeightAdded = (newWeight: WeightType) => {
		setWeights((prevWeights) => {
			const updatedWeights = [...prevWeights, newWeight];
			return updatedWeights.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);
		});
	};

	return (
		<Card>
			<CardContent className="p-6">
				<RegisterWeightDialog onWeightAdded={handleWeightAdded} />
				<ChartContainer
					config={{
						weight: {
							label: 'Weight',
							color: 'hsl(var(--chart-1))',
						},
					}}
					className="mt-4 h-[300px]"
				>
					<LineChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Line
							type="monotone"
							dataKey="weight"
							stroke="var(--color-weight)"
							strokeWidth={2}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
