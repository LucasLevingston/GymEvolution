import {
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	CartesianGrid,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import type { Weight } from '@/types/userType';

interface WeightChartProps {
	weights: Weight[];
}

export function WeightChart({ weights }: WeightChartProps) {
	const chartData = weights.map((weight) => ({
		date: new Date(weight.date).toLocaleDateString(),
		weight: weight.weight,
	}));

	return (
		<Card>
			<CardContent className="p-6">
				<ChartContainer
					config={{
						weight: {
							label: 'Weight',
							color: 'hsl(var(--chart-1))',
						},
					}}
					className="h-[300px]"
				>
					<ResponsiveContainer width="100%" height="100%">
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
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
