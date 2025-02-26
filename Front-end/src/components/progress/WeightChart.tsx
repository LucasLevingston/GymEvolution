'use client';

import { useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { WeightType } from '@/types/userType';
import { Pencil, Save, X } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import useUser from '@/hooks/user-hooks';
import { RegisterWeightDialog } from '../RegisterWeightDialog';

interface EditableWeightChartProps {
	data: WeightType[];
	onDataChange?: (newData: WeightType[]) => void;
}

export function EditableWeightChart({
	data: initialData,
	onDataChange,
}: EditableWeightChartProps) {
	const [data, setData] = useState<WeightType[]>(initialData);
	const [isEditing, setIsEditing] = useState(false);
	const [editingData, setEditingData] = useState<WeightType[]>(initialData);
	const { user, updateUser } = useUser();

	const formatChartData = (weights: WeightType[]) => {
		return weights.map((weight) => ({
			date: new Date(weight.date).toLocaleDateString(),
			weight: Number.parseFloat(weight.weight),
			bf: Number.parseFloat(weight.bf),
		}));
	};

	const chartData = formatChartData(isEditing ? editingData : data);

	const handleEditToggle = () => {
		if (isEditing) {
			setEditingData([...data]);
		} else {
			setEditingData([...data]);
		}
		setIsEditing(!isEditing);
	};

	const handleSaveChanges = async () => {
		setData([...editingData]);

		if (user) {
			const updatedUser = {
				...user,
				oldWeights: editingData,
				currentWeight:
					editingData.length > 0
						? editingData[editingData.length - 1].weight
						: user.currentWeight,
			};

			const result = await updateUser(updatedUser);
			console.log(result);
		}

		setIsEditing(false);
		if (onDataChange) {
			onDataChange(editingData);
		}
	};

	const handleInputChange = (
		index: number,
		field: 'weight' | 'bf',
		value: string
	) => {
		const newData = [...editingData];
		newData[index] = {
			...newData[index],
			[field]: value,
		};
		setEditingData(newData);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between ">
				<CardTitle>Weight Progress</CardTitle>

				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleSaveChanges}
								className="flex items-center gap-1"
							>
								<Save className="h-4 w-4" />
								Save
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleEditToggle}
								className="flex items-center gap-1"
							>
								<X className="h-4 w-4" />
								Cancel
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								onClick={handleEditToggle}
								className="flex items-center gap-1"
							>
								<Pencil className="h-4 w-4" />
								Edit Data
							</Button>
							<RegisterWeightDialog />
						</>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-6">
				<div className="h-[400px]">
					<ResponsiveContainer width="100%" height="100%">
						<ChartContainer
							config={{
								weight: {
									label: 'Weight',
									color: 'hsl(var(--chart-1))',
								},
							}}
							className="h-[300px]"
						>
							<LineChart data={chartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Line
									type="monotone"
									dataKey="weight"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
									name="Weight (kg)"
								/>
							</LineChart>
						</ChartContainer>
					</ResponsiveContainer>
				</div>

				{isEditing && (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Weight (kg)</TableHead>
									<TableHead>Body Fat %</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{editingData.map((item, index) => (
									<TableRow key={item.id}>
										<TableCell>
											{new Date(item.date).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<Input
												type="number"
												value={item.weight}
												onChange={(e) =>
													handleInputChange(index, 'weight', e.target.value)
												}
												className="w-24"
											/>
										</TableCell>
										<TableCell>
											<Input
												type="number"
												value={item.bf}
												onChange={(e) =>
													handleInputChange(index, 'bf', e.target.value)
												}
												className="w-24"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
