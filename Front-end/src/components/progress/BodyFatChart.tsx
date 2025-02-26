import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { WeightType } from '@/types/userType';

interface BodyFatChartProps {
	weights: WeightType[];
}

export function BodyFatChart({ weights }: BodyFatChartProps) {
	const chartData = weights.map((weight) => ({
		date: new Date(weight.date).toLocaleDateString(),
		bodyFat: weight.bf,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Body Fat Percentage Progress</CardTitle>
			</CardHeader>
			<CardContent className="p-6">
				<div className="h-[400px]">
					<ResponsiveContainer width="100%" height="100%">
						<ChartContainer
							config={{
								bodyFat: {
									label: 'Body Fat %',
									color: 'hsl(var(--chart-2))',
								},
							}}
							className="h-[300px]"
						>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Legend />
								<Line
									type="monotone"
									dataKey="bodyFat"
									stroke="var(--color-bodyFat)"
									strokeWidth={2}
								/>
							</LineChart>
						</ChartContainer>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
