// @jsx Evolution.tsx

import Container from '@/components/Container';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import useUser from '@/hooks/user-hooks';
import { UserType, Weight } from '@/types/userType';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Evolution() {
	const { getUser } = useUser();
	const [user, setUser] = useState<UserType | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [pesos, setPesos] = useState<Weight[] | null>(null);
	if (error) {
		toast.error(error);
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const fetchedUser = await getUser();
				setUser(fetchedUser);
				if (user) {
					setPesos(user.pesosAntigos);
				}
			} catch (error) {
				setError('Erro ao buscar o usuário');
			}
		};

		fetchUser();
	}, [getUser]);

	return (
		<>
			<Header />
			<Container>
				{pesos && (
					<div>
						<Button>Registrar novo peso</Button>
						<div>Gráfico</div>
					</div>
				)}
			</Container>
		</>
	);
}
