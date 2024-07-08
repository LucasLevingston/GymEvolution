import React, { useEffect, useState } from 'react';
import Container from '@/components/Container';
import { TreinoDaSemana } from './TreinoDaSemana';
import { UserType } from '@/types/userType';
import useUser from '@/hooks/user-hooks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Home() {
	const { getUser } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const fetchedUser = await getUser();
				setUser(fetchedUser);
			} catch (e) {
				setError('Erro ao buscar o usuário');
				toast.error(error);
			}
		};

		fetchUser();
	}, [getUser]);

	return (
		<div>
			{user ? (
				<Container>
					<p className="text-2xl">Treino da semana</p>
					<TreinoDaSemana />
				</Container>
			) : (
				<Container>
					<div className="flex items-center justify-center space-x-5  ">
						<div>Faça o login para Continuar </div>
						<Button variant="outline" className="text-preto">
							<Link to="/login">Fazer login</Link>
						</Button>
					</div>
				</Container>
			)}
		</div>
	);
}
