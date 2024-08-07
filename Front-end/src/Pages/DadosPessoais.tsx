import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';
import useUser from '@/hooks/user-hooks';
import { UserType } from '@/types/userType';
import { Link } from 'react-router-dom';
import { UserSchema } from '@/schemas/UserSchema';
import { toast } from 'sonner';
import DataCard from '@/components/DataCard';

type UserFormValues = z.infer<typeof UserSchema>;

export const DadosPessoais: React.FC = () => {
	const { getUser, updateUser } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const fetchedUser = await getUser();
				setUser(fetchedUser);
			} catch (error) {
				setError('Error fetching user data');
			}
			if (error) {
				toast.error(error);
			}
		};

		fetchUser();
	}, [getUser, error]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserFormValues>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			name: user?.name || '',
			email: '',
			street: '',
			number: '',
			zipCode: '',
			city: '',
			state: '',
			sex: '',
			phone: '',
			birthDate: '',
		},
	});

	const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

	const handleEditClick = (field: string) => {
		setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const onSubmit = handleSubmit(async (data: UserFormValues) => {
		if (!user) {
			setError('No user found');
			return;
		}
		const updatedUser: UserType = {
			id: user.id,
			email: data.email,
			password: user.password,
			name: data.name,
			sex: data.sex,
			street: data.street,
			number: data.number,
			zipCode: data.zipCode,
			city: data.city,
			state: data.state,
			birthDate: data.birthDate,
			phone: data.phone,
			currentWeight: user.currentWeight,
			history: user.history,
			oldWeights: user.oldWeights,
			trainingWeeks: user.trainingWeeks,
		};
		try {
			const result = await updateUser(updatedUser);

			if (result) {
				toast.success('Data saved successfully!');
				setEditMode({});
			}
		} catch (error) {
			setError('Error saving data');
		}
	});

	useEffect(() => {
		if (user) {
			Object.keys(user).forEach((key) => {
				const value = user[key as keyof UserType];
				if (typeof value === 'string') {
					setValue(key as keyof UserFormValues, value);
				} else if (typeof value === 'number') {
					setValue(key as keyof UserFormValues, value.toString());
				}
			});
		}
	}, [user, setValue]);

	return (
		<Container>
			{user ? (
				<form
					onSubmit={onSubmit}
					className="flex w-full flex-col items-center justify-center pb-3"
				>
					<div className="w-[70%] space-y-8 rounded-3xl border-[4px] border-black bg-white p-5 text-black">
						<div className="pb-3 text-2xl font-bold">Information</div>
						<div className="flex flex-wrap justify-center gap-5">
							<DataCard
								fieldName="name"
								fieldLabel="Nome"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="email"
								fieldLabel="Email"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="street"
								fieldLabel="Street"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="number"
								fieldLabel="Number"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="zipCode"
								fieldLabel="CEP"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="city"
								fieldLabel="City"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="state"
								fieldLabel="Estado"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="sex"
								fieldLabel="Sexo"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="phone"
								fieldLabel="Phone"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
							<DataCard
								fieldName="birthDate"
								fieldLabel="Birth Date"
								register={register}
								setValue={setValue}
								editMode={editMode}
								handleEditClick={handleEditClick}
								errors={errors}
							/>
						</div>

						<div className="flex justify-between">
							<Button type="button">Past Trainings</Button>
							<Button type="button">Progress</Button>
							<Button type="submit" className="bg-green-500">
								Save
							</Button>
						</div>
					</div>
				</form>
			) : (
				<div className="flex items-center justify-center space-x-5">
					<div>Please log in to continue</div>
					<Button variant="outline" className="text-black">
						<Link to="/login">Log in</Link>
					</Button>
				</div>
			)}
		</Container>
	);
};
