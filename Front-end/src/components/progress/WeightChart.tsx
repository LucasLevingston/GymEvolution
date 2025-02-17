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
import type { WeightType } from '@/types/userType';
import { Form } from 'react-router-dom';
import { weightSchema } from '@/schemas/weightSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import useUser from '@/hooks/user-hooks';
import { toast } from 'sonner';
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from 'react-day-picker';

interface WeightChartProps {
	weights: WeightType[];
}

export function WeightChart({ weights }: WeightChartProps) {
	const { user, updateUser } = useUser();
	if (!user || !user.id) {
		return (
			<Card>
				<CardContent className="flex h-[400px] flex-col items-center justify-center">
					<p className="text-xl font-semibold">
						Please log in to view your progress.
					</p>
				</CardContent>
			</Card>
		);
	}
	const chartData = weights.map((weight) => ({
		date: new Date(weight.date).toLocaleDateString(),
		weight: weight.weight,
	}));

	const form = useForm<z.infer<typeof weightSchema>>({
		resolver: zodResolver(weightSchema),
		defaultValues: {
			weight: '',
			bf: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof weightSchema>) => {
		try {
			const newWeight: WeightType = {
				id: Date.now().toString(),
				weight: values.weight,
				bf: values.bf,
				date: new Date().toISOString(),
				userId: user?.id,
			};

			weights.push(newWeight);

			weights.sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);

			if (user) {
				const updatedUser = {
					...user,
					oldWeights: weights,
					currentWeight: newWeight.weight,
				};
				await updateUser(updatedUser);
			}

			form.reset();

			toast.success('Weight updated successfully');
		} catch (error) {
			console.error('Error updating weight:', error);
			toast.error('Failed to update weight');
		}
	};
	return (
		<Card>
			<CardContent className="p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="weight"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Weight (kg)</FormLabel>
									<FormControl>
										<Input type="number" step="0.1" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bf"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Body Fat %</FormLabel>
									<FormControl>
										<Input type="number" step="0.1" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<Button type="submit">Register New Weight</Button>
					</form>
				</Form>
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
