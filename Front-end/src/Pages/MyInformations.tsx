'use client';

import type React from 'react';
import { useState } from 'react';
import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';
import useUser from '@/hooks/user-hooks';
import type { UserType } from '@/types/userType';
import { Link } from 'react-router-dom';
import { UserSchema } from '@/schemas/UserSchema';
import { toast } from 'sonner';
import DataCard from '@/components/DataCard';
import HistoryButton from '@/components/HistoryButton';
import Header from '@/components/Header';

type UserFormValues = z.infer<typeof UserSchema>;

export const DadosPessoais: React.FC = () => {
	const { updateUser, user } = useUser();
	const [selectedState] = useState<string | null>(null);
	const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<UserFormValues>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
			street: user?.street || '',
			number: user?.number || '',
			zipCode: user?.zipCode || '',
			city: user?.city || '',
			state: user?.state || '',
			sex: user?.sex || '',
			phone: user?.phone || '',
			birthDate: user?.birthDate || '',
			currentWeight: user?.currentWeight || '',
		},
		mode: 'onChange',
	});

	const handleEditClick = (field: string) => {
		setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const onSubmit = async (data: UserFormValues) => {
		if (!user) return;

		const updatedUser: UserType = {
			...user,
			...data,
			state: selectedState || data.state,
		};
		try {
			const response = await updateUser(updatedUser);
			if (response) {
				toast.success('Data saved successfully!');
			}
		} catch (error) {
			console.error(error);
			toast.error(`Error: ${error}`);
		}
	};

	if (!user) {
		return (
			<Container>
				<div className="flex h-screen flex-col items-center justify-center space-y-4">
					<div className="text-xl font-semibold text-foreground">
						Please log in to continue
					</div>
					<Button asChild variant="default" className="w-32">
						<Link to="/login">Log in</Link>
					</Button>
				</div>
			</Container>
		);
	}

	return (
		<>
			<Header />
			<Container>
				<div className="mx-auto max-w-4xl py-8">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<div className="rounded-lg bg-card p-6 shadow-lg">
							<div className="mb-6 flex items-center justify-between">
								<h2 className="text-3xl font-bold text-card-foreground">
									Personal Information
								</h2>
								<HistoryButton />
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{Object.keys(UserSchema.shape).map((fieldName) => (
									<DataCard
										key={fieldName}
										fieldName={fieldName as keyof UserFormValues}
										fieldLabel={fieldName.split(/(?=[A-Z])/).join(' ')}
										register={register}
										editMode={editMode}
										handleEditClick={() => handleEditClick(fieldName)}
										errors={errors}
									/>
								))}
							</div>
						</div>
						<div className="flex justify-between space-x-4">
							<Button type="button" variant="outline" className="flex-1">
								Past Trainings
							</Button>
							<Button type="button" variant="outline" className="flex-1">
								Progress
							</Button>
							<Button
								type="submit"
								variant="default"
								className="flex-1"
								disabled={!isDirty || !isValid}
							>
								Save Changes
							</Button>
						</div>
					</form>
				</div>
			</Container>
		</>
	);
};
