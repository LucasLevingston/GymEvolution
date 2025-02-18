import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { weightSchema } from '@/schemas/weightSchema';
import type { WeightType } from '@/types/userType';
import useUser from '@/hooks/user-hooks';

interface RegisterWeightDialogProps {
	onWeightAdded: (newWeight: WeightType) => void;
}

export function RegisterWeightDialog({
	onWeightAdded,
}: RegisterWeightDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { user, updateUser } = useUser();

	const form = useForm<z.infer<typeof weightSchema>>({
		resolver: zodResolver(weightSchema),
		defaultValues: {
			weight: '',
			bf: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof weightSchema>) => {
		setIsLoading(true);
		try {
			if (!user || !user.id) {
				throw new Error('User not logged in');
			}

			const newWeight: WeightType = {
				id: Date.now().toString(),
				weight: values.weight,
				bf: values.bf,
				date: new Date().toISOString(),
				userId: user.id,
			};

			const updatedUser = {
				...user,
				oldWeights: [...(user.oldWeights || []), newWeight],
				currentWeight: newWeight.weight,
			};

			await updateUser(updatedUser);
			onWeightAdded(newWeight);
			form.reset();
			setIsOpen(false);
			toast.success('Weight updated successfully');
		} catch (error) {
			console.error('Error updating weight:', error);
			toast.error('Failed to update weight');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Add New Weight</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Add New Weight</AlertDialogTitle>
					<AlertDialogDescription>
						Enter your current weight and body fat percentage.
					</AlertDialogDescription>
				</AlertDialogHeader>
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
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<AlertDialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Saving...' : 'Save'}
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
