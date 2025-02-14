import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { LoadData } from '@/types/progressTypes';

interface LoadChartProps {
	data: LoadData[];
}

export function LoadChart({ data }: LoadChartProps) {
	return (
		<Card>
			<CardContent className="p-6">
				<ChartContainer
					config={{
						upper: {
							label: 'Upper Body',
							color: 'hsl(var(--chart-6))',
						},
						lower: {
							label: 'Lower Body',
							color: 'hsl(var(--chart-7))',
						},
					}}
					className="h-[300px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<XAxis dataKey="week" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="upper"
								stroke="var(--color-upper)"
								strokeWidth={2}
							/>
							<Line
								type="monotone"
								dataKey="lower"
								stroke="var(--color-lower)"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
