'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Weight } from '@/types/userType';

interface BodyFatChartProps {
	weights: Weight[];
}

export function BodyFatChart({ weights }: BodyFatChartProps) {
	const chartData = weights.map((weight) => ({
		date: new Date(weight.date).toLocaleDateString(),
		bodyFat: weight.bf,
	}));

	return (
		<Card>
			<CardContent className="p-6">
				<ChartContainer
					config={{
						bodyFat: {
							label: 'Body Fat %',
							color: 'hsl(var(--chart-2))',
						},
					}}
					className="h-[300px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={chartData}>
							<XAxis dataKey="date" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="bodyFat"
								stroke="var(--color-bodyFat)"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
