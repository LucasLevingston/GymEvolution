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
import { Pencil, Save, X, Trash2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import useUser from '@/hooks/user-hooks';
import { RegisterWeightDialog } from '../RegisterWeightDialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useWeight } from '@/hooks/use-weight';
import { toast } from 'sonner';

interface EditableWeightChartProps {
	data: WeightType[];
	onDataChange?: (newData: WeightType[]) => void;
}

export function EditableWeightChart({
	data: initialData,
	onDataChange,
}: EditableWeightChartProps) {
	const [data, setData] = useState<WeightType[]>(initialData);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingValues, setEditingValues] = useState<{
		weight: string;
		bf: string;
	} | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<WeightType | null>(null);
	const { user } = useUser();
	const { updateWeight, deleteWeight } = useWeight();

	const formatChartData = (weights: WeightType[]) => {
		return weights.map((weight) => ({
			date: new Date(weight.date).toLocaleDateString(),
			weight: Number.parseFloat(weight.weight),
			bf: Number.parseFloat(weight.bf),
		}));
	};

	const chartData = formatChartData(data);

	const handleEditStart = (item: WeightType) => {
		setEditingId(item.id);
		setEditingValues({
			weight: item.weight,
			bf: item.bf,
		});
	};

	const handleEditCancel = () => {
		setEditingId(null);
		setEditingValues(null);
	};

	const handleEditSave = async (item: WeightType) => {
		if (!editingValues || !user) return;

		try {
			const updatedWeight = {
				...item,
				weight: editingValues.weight,
				bf: editingValues.bf,
			};

			const updatedWeights = data.map((weight) =>
				weight.id === item.id ? updatedWeight : weight
			);

			await updateWeight(updatedWeight);
			setData(updatedWeights);
			if (onDataChange) {
				onDataChange(updatedWeights);
			}
			toast.success('Weight updated successfully');
			setEditingId(null);
			setEditingValues(null);
		} catch (error) {
			toast.error('Failed to update weight');
			console.error('Error updating weight:', error);
		}
	};

	const handleInputChange = (field: 'weight' | 'bf', value: string) => {
		if (!editingValues) return;
		setEditingValues({
			...editingValues,
			[field]: value,
		});
	};

	const handleDeleteClick = (item: WeightType) => {
		setItemToDelete(item);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = async () => {
		try {
			if (!itemToDelete) throw new Error('No item to delete');
			await deleteWeight(itemToDelete.id);

			const updatedWeights = data.filter((w) => w.id !== itemToDelete.id);
			setData(updatedWeights);
			if (onDataChange) {
				onDataChange(updatedWeights);
			}

			toast.warning('Weight deleted successfully');
			setDeleteDialogOpen(false);
			setItemToDelete(null);
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Failed to delete weight');
		}
	};

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Weight Progress</CardTitle>
					<RegisterWeightDialog />
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

					<div className="mt-6 rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Weight (kg)</TableHead>
									<TableHead>Body Fat %</TableHead>
									<TableHead className="w-[150px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((item) => (
									<TableRow key={item.id}>
										<TableCell>
											{new Date(item.date).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{editingId === item.id ? (
												<Input
													type="number"
													value={editingValues?.weight}
													onChange={(e) =>
														handleInputChange('weight', e.target.value)
													}
													className="w-24"
												/>
											) : (
												item.weight
											)}
										</TableCell>
										<TableCell>
											{editingId === item.id ? (
												<Input
													type="number"
													value={editingValues?.bf}
													onChange={(e) =>
														handleInputChange('bf', e.target.value)
													}
													className="w-24"
												/>
											) : (
												item.bf
											)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{editingId === item.id ? (
													<>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleEditSave(item)}
															className="h-8 w-8"
														>
															<Save className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={handleEditCancel}
															className="h-8 w-8"
														>
															<X className="h-4 w-4" />
														</Button>
													</>
												) : (
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleEditStart(item)}
														className="h-8 w-8"
													>
														<Pencil className="h-4 w-4" />
													</Button>
												)}
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDeleteClick(item)}
													className="h-8 w-8 text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Weight Entry</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this weight entry? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
