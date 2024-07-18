import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Container from '@/components/Container';
import useUser from '@/hooks/user-hooks';
import { UserType } from '@/types/userType';
import { Link } from 'react-router-dom';
import { UserSchema } from '@/schemas/UserSchema';
import { toast } from 'sonner';

// Defina um novo tipo que corresponde ao esquema de validação
type UserFormValues = z.infer<typeof UserSchema>;

export const DadosPessoais: React.FC = () => {
	const { getUser, alterarDados } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const fetchedUser = await getUser();
				setUser(fetchedUser);
			} catch (error) {
				setError('Erro ao buscar o usuário');
			}
		};

		fetchUser();
	}, [getUser]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserFormValues>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			nome: '',
			email: '',
			rua: '',
			numero: '',
			cep: '',
			cidade: '',
			estado: '',
			sexo: '',
			telefone: '',
			nascimento: '',
		},
	});

	const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

	const handleEditClick = (field: string) => {
		setEditMode({ ...editMode, [field]: !editMode[field] });
	};

	const onSubmit = handleSubmit(async (data: UserFormValues) => {
		if (!user) {
			setError('sem usuario');
		}
		try {
			console.log('Salvando dados:', data);
			const result = alterarDados({
				...data,
				SemanasDeTreino: user?.SemanasDeTreino,
			});
			if (result) {
				toast.success('Dados salvos com sucesso!');
				return result;
			}
			setEditMode({});
		} catch (error) {
			setError('Erro ao salvar dados.');
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
					<div className="w-[70%] space-y-8 rounded-3xl border-[4px] border-preto bg-branco p-5 text-preto">
						<div className="pb-3 text-2xl font-bold">Informações</div>
						<div className="flex gap-5">
							<div className="w-[50%] space-y-5">
								<div className="h-13 w-full bg-cinza p-2">
									<h1 className="text-xs font-bold">Nome</h1>
									<div className="flex items-center justify-between">
										<Input
											{...register('nome')}
											onChange={(e) => setValue('nome', e.target.value)}
											disabled={!editMode['nome']}
											className={`rounded border p-1 ${editMode['nome'] ? 'bg-white' : 'bg-gray-200'} ${errors.nome ? 'border-red-500' : ''}`}
										/>
										<Button
											type="button"
											onClick={() => handleEditClick('nome')}
											className="ml-2"
										>
											{editMode['nome'] ? 'Salvar' : 'Editar'}
										</Button>
									</div>
									{errors.nome && (
										<span className="text-xs text-red-500">
											{errors.nome?.message}
										</span>
									)}
								</div>

								{/* Repita o bloco acima para os outros campos, como 'email', 'rua', etc. */}
							</div>
							<div className="w-[50%] space-y-5">{/* Outros campos */}</div>
						</div>

						<div className="flex justify-between">
							<Button type="button">Treinos passados</Button>
							<Button type="button">Evolução</Button>
							<Button type="submit" className="bg-green-500">
								Salvar
							</Button>
						</div>
					</div>
				</form>
			) : (
				<div className="flex items-center justify-center space-x-5">
					<div>Faça o login para Continuar</div>
					<Button variant="outline" className="text-preto">
						<Link to="/login">Fazer login</Link>
					</Button>
				</div>
			)}
		</Container>
	);
};
